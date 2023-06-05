import React, { useState, useMemo } from "react";
import { stack } from "./data";
import Stack from "./Stack";
import DroppableBoard from "./DroppableBoard";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { selectedCardsState, stacksState } from "./store";
import { useRecoilState } from "recoil";
import { arrayMove } from "@dnd-kit/sortable";
import FreeCard from "./FreeCard";
import useMousePosition from "./useMousePosition";

const DesktopView = () => {
	const mousePosition = useMousePosition();
	const [freeCards, setFreeCards] = useState([]);
	const [stacks, setStacks] = useRecoilState(stacksState);
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

		return Object.keys(stacks).find((key) =>
			stacks[key].cards.map((card) => card.title).includes(id)
		);
	};

	const handleSelect = (card) => {
		setSelectedCards((selectedCards) => {
			if (selectedCards.includes(card)) {
				return selectedCards.filter((value) => value !== card);
			}

			if (
				!selectedCards.length ||
				findContainer(card.title) !== findContainer(selectedCards[0].title)
			) {
				return [card];
			}

			return selectedCards.concat(card);
		});
	};

	const initialContainer = useMemo(
		() => (activeCard ? findContainer(activeCard.title) : null),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activeCard]
	);

	function filterItems(stack) {
		if (!activeCard) {
			return stack.cards;
		}

		return stack.cards.filter(
			(card) =>
				card.title === activeCard.title ||
				!selectedCards.map((selectedCard) => selectedCard.title).includes(card.title)
		);
	}

	const onDragStart = (result) => {
		const { active } = result;
		if (active.data.current.type === "card") {
			setSelectedCards((selectedCards) =>
				selectedCards.map((card) => card.title).includes(active.id) ? selectedCards : []
			);
			const activeStack = findContainer(active.id);
			setActiveCard(stacks[activeStack].cards.find((card) => card.title === active.id));
		}
	};

	const onDragOver = (result) => {
		const { active, over,delta } = result;
		console.log(active, over);
		if (active.data.current.type === "card") {
			const overId = over?.id;
			if (!overId || active.id in stacks) {
				return;
			}
			const activeStack = findContainer(active.id);
			if (overId === "desktop") {
				const ids = selectedCards.length
					? [activeCard, ...selectedCards.filter((id) => id !== active.id)]
					: [activeCard];
				const activeStack = findContainer(active.id);
				const activeCards = stacks[activeStack].cards.filter(
					(card) => !ids.map((selectedCard) => selectedCard.title).includes(card.title)
				);
				setStacks((stacks) => {
					return {
						...stacks,
						[activeStack]: {
							...stacks[activeStack],
							cards: activeCards,
						},
					};
				});
				setFreeCards(
					ids.map((card) => ({ ...card, x: delta.x, y: delta.y + 88 }))
				);
				return;
			}
			const overStack = findContainer(overId);

			if (!overStack || !activeStack) {
				return;
			}

			if (activeStack !== overStack) {
				setStacks((stacks) => {
					const activeItems = stacks[activeStack].cards;
					const overItems = stacks[overStack].cards;
					const overIndex = overItems.findIndex((card) => card.title === overId);
					const activeIndex = activeItems.findIndex((card) => card.title === active.id);

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
						cards: stacks[activeStack].cards.filter((card) => card.title !== active.id),
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
				? [activeCard, ...selectedCards.filter((id) => id !== active.id)]
				: [activeCard];

			const overContainer = findContainer(overId);

			if (overContainer) {
				console.log(ids);
				const overItems = filterItems(stacks[overContainer]);
				const overIndex = overItems.findIndex((card) => card.title === overId);
				const activeIndex = overItems.findIndex((card) => card.title === active.id);
				const newItems = arrayMove(overItems, activeIndex, overIndex);
				const newActiveIndex = newItems.findIndex((card) => card.title === active.id);

				const initalStack = {
					...stacks[initialContainer],
					cards: stacks[initialContainer].cards.filter(
						(card) => !ids.map((c) => c.title).includes(card.title)
					),
				};

				const activeStack = {
					...stacks[activeContainer],
					cards: stacks[activeContainer].cards.filter(
						(card) => !ids.map((c) => c.title).includes(card.title)
					),
				};

				const overStack = {
					...stacks[overContainer],
					cards: [
						...newItems.slice(0, newActiveIndex + 1),
						...ids.filter((card) => card.title !== active.id),
						...newItems.slice(newActiveIndex + 1, newItems.length),
					],
				};

				setStacks((items) => ({
					...items,
					[initialContainer]: initalStack,
					[activeContainer]: activeStack,
					[overContainer]: overStack,
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
			<p>
				{mousePosition.x}-{mousePosition.y}
			</p>
			<p>Selected{selectedCards.map((card) => card.title).toString()}</p>
			<p>FreeCard{freeCards.map((card) => card.title).toString()}</p>
			<DroppableBoard>
				{Object.keys(stacks).map((s) => {
					const stack = stacks[s];
					return (
						<Stack
							key={stack.title}
							stack={stack}
							handleSelect={handleSelect}
							cards={filterItems(stack)}
						/>
					);
				})}
				{freeCards.length > 0 && <FreeCard card={freeCards[0]} />}
			</DroppableBoard>
		</DndContext>
	);
};

export default DesktopView;
