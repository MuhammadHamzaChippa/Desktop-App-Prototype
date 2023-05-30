import React, { useState, useMemo } from "react";
import { stack } from "./data";
import Stack from "./Stack";
import DroppableBoard from "./DroppableBoard";
import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { selectedCardsState } from "./store";
import { useRecoilState } from "recoil";
import { arrayMove } from "@dnd-kit/sortable";

const DesktopView = () => {
	const [stacks, setStacks] = useState(stack);
	const [activeCard, setActiveCard] = useState(null);
	const [selectedCards, setSelectedCards] = useRecoilState(selectedCardsState);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const findContainer = (id) => {
		if (id in stacks) {
			return id;
		}

		return Object.keys(stacks).find((key) => stacks[key].cards.includes(id));
	};

	const initialContainer = useMemo(
		() => (activeCard ? findContainer(activeCard) : null),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activeCard]
	);

	function filterItems(stacks) {
		if (!activeCard) {
			return stacks;
		}

		return stacks.cards.filter((id) => id === activeCard || !selectedCards.includes(id));
	}

	const onDragStart = (result) => {
		const { active } = result;
		if (active.data.current.type === "card") {
			setSelectedCards((selectedCard) =>
				selectedCard.includes(active.id) ? selectedCard : []
			);
			setActiveCard(active.id);
		}
	};

	const onDragOver = (result) => {
		const { active, over } = result;
		if (active.data.current.type === "card") {
			const overId = over?.id;
			if (!overId || active.id in stacks) {
				return;
			}
			const overStack = findContainer(overId);
			const activeStack = findContainer(active.id);

			if (!overStack || !activeStack) {
				return;
			}

			if (activeStack !== overStack) {
				setStacks((stacks) => {
					const activeItems = stacks[activeStack].cards;
					const overItems = stacks[overStack].cards;
					const overIndex = overItems.indexOf(overId);
					const activeIndex = activeItems.indexOf(active.id);

					let newIndex;

					if (overId in stacks) {
						newIndex = overItems.length + 1;
					} else {
						const isBelowOverItem =
							over &&
							active.rect.current.translated &&
							active.rect.current.translated.top > over.rect.top + over.rect.height;

						const modifier = isBelowOverItem ? 1 : 0;

						newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
					}

					const updatedActiveStack = {
						...stacks[activeStack],
						cards: stacks[activeStack].cards.filter((card) => card !== active.id),
					};

					const updatedOverStack = {
						...stacks[overStack],
						cards: [
							...stacks[overStack].cards.slice(0, newIndex),
							stacks[activeStack].cards[activeIndex],
							...stacks[overStack].cards.slice(
								newIndex,
								stacks[overStack].cards.length
							),
						],
					};

					return {
						...stacks,
						[activeStack]: updatedActiveStack,
						[overStack]: updatedOverStack,
					};
				});
			}
		}
	};

	const onDragEnd = (result) => {
		const { active, delta, over } = result;
		if (active.data.current.type === "stack") {
			setStacks({
				...stacks,
				[active.id]: {
					...stacks[active.id],
					x: stacks[active.id].x + delta.x,
					y: stacks[active.id].y + delta.y,
				},
			});
		}
		if (active.data.current.type === "card") {
			const activeContainer = findContainer(active.id);
			const overId = over?.id;

			if (!activeContainer || !overId || !initialContainer) {
				setActiveCard(null);
				setSelectedCards([]);
				return;
			}

			const ids = selectedCards.length
				? [active.id, ...selectedCards.filter((id) => id !== active.id)]
				: [active.id];

			const overContainer = findContainer(overId);

			if (overContainer) {
				const overItems = filterItems(stacks[overContainer]);
				const overIndex = overItems.indexOf(overId);
				const activeIndex = overItems.indexOf(active.id);
				const newItems = arrayMove(overItems, activeIndex, overIndex);
				const newActiveIndex = newItems.indexOf(active.id);

				setStacks((items) => ({
					...items,
					[initialContainer]: {
						...items[initialContainer],
						cards: items[initialContainer].cards.filter((id) => !ids.includes(id)),
					},
					[activeContainer]: {
						...items[activeContainer],
						cards: items[activeContainer].cards.filter((id) => !ids.includes(id)),
					},
					[overContainer]: {
						...items[overContainer],
						cards: [
							...newItems.slice(0, newActiveIndex + 1),
							...ids.filter((id) => id !== active.id),
							...newItems.slice(newActiveIndex + 1, newItems.length),
						],
					},
				}));
			}

			setActiveCard(null);
		}
	};

	return (
		<DndContext
			modifiers={[restrictToParentElement]}
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			<DroppableBoard>
				{Object.keys(stacks).map((s) => {
					const stack = stacks[s];
					return <Stack key={stack.title} stack={stack} />;
				})}
			</DroppableBoard>
			<DragOverlay>
				{activeCard && (
					<div className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center">
						{activeCard}
					</div>
				)}
			</DragOverlay>
		</DndContext>
	);
};

export default DesktopView;
