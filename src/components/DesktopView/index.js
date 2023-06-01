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
	useDndContext,
} from "@dnd-kit/core";
import { selectedCardsState, overIdState } from "./store";
import { useRecoilState } from "recoil";
import { arrayMove } from "@dnd-kit/sortable";
import Card from "./Card";

const CardOverlay = ({ card, stacks }) => {
	const { over } = useDndContext();
	const findContainer = (id) => {
		if (id in stacks) {
			return id;
		}

		return Object.keys(stacks).find((key) => stacks[key].cards.includes(id));
	};
	const container = findContainer(over?.id);
	const zIndex = stacks[container]?.cards?.indexOf(over?.id);

	return <Card card={card} zIndex={-5} />;
};
const DesktopView = () => {
	const [stacks, setStacks] = useState(stack);
	const [activeCard, setActiveCard] = useState(null);
	const [selectedCards, setSelectedCards] = useRecoilState(selectedCardsState);
	const [overId, setOverId] = useRecoilState(overIdState);
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

	const draggingZindex = (overId) => {
		const container = findContainer(overId);
		const cards = stacks[container]?.cards;
		const zIndex = cards?.indexOf(overId);
		console.log(zIndex, cards?.length);
		if (zIndex === cards?.length - 1) {
			return zIndex + 2;
		} else {
			return zIndex;
		}
	};

	const handleSelect = (id) => {
		setSelectedCards((selectedIds) => {
			if (selectedCards.includes(id)) {
				return selectedCards.filter((value) => value !== id);
			}

			if (!selectedCards.length || findContainer(id) !== findContainer(selectedIds[0])) {
				return [id];
			}

			return selectedCards.concat(id);
		});
	};

	const initialContainer = useMemo(
		() => (activeCard ? findContainer(activeCard) : null),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activeCard]
	);

	function filterItems(stack) {
		if (!activeCard) {
			return stack.cards;
		}

		return stack.cards.filter((id) => id === activeCard || !selectedCards.includes(id));
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
			setOverId(overId);
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
			setSelectedCards([]);
			setActiveCard(null);
		}
	};

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			<DroppableBoard>
				{Object.keys(stacks).map((s) => {
					const stack = stacks[s];
					return (
						<Stack
							key={stack.title}
							stack={stack}
							handleSelect={handleSelect}
							cards={filterItems(stack)}
							draggingZindex={draggingZindex}
						/>
					);
				})}
			</DroppableBoard>
			{}
			{/* <DragOverlay>
				{activeCard && <CardOverlay card={activeCard} stacks={stacks} />}
			</DragOverlay> */}
		</DndContext>
	);
};

export default DesktopView;
