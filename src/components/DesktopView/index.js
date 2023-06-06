import React, { useState, useMemo, useEffect } from "react";
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
import { selectedCardsState, stacksState, isDraggingState } from "./store";
import { useRecoilState, useSetRecoilState } from "recoil";
import { arrayMove } from "@dnd-kit/sortable";
import CardOverlay from "./CardOverlay";
import { stack } from "./data";
const DesktopView = () => {
	const [mousePosition, setMousePosition] = useState({ x: null, y: null });
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		const updateMousePosition = (ev) => {
			setMousePosition({ x: ev.clientX, y: ev.clientY });
		};
		window.addEventListener("mousemove", updateMousePosition);
		return () => {
			window.removeEventListener("mousemove", updateMousePosition);
		};
	}, []);

	const setDraggingFlag = useSetRecoilState(isDraggingState);
	const [stacks, setStacks] = useRecoilState(stacksState);
	const [activeCard, setActiveCard] = useState(null);
	const [activeCardIndex, setActiveCardIndex] = useState(null);
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
				return selectedCards.filter((value) => value.title !== card.title);
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
				!selectedCards.map((card) => card.title).includes(card.title)
		);
	}

	const onDragStart = (result) => {
		const { active } = result;
		if (active.data.current.type === "card") {
			setDraggingFlag(true);
			setSelectedCards((selectedCard) =>
				selectedCard.map((card) => card.title).includes(active.id) ? selectedCard : []
			);
			const activeStack = findContainer(active.id);
			setActiveCard(stacks[activeStack].cards.find((card) => card.title === active.id));
			setActiveCardIndex(
				stacks[activeStack].cards.findIndex((card) => card.title === active.id)
			);
		}
	};

	const onDragOver = (result) => {
		const { active, over } = result;
		console.log(active, over);
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
			if (overId === "desktop") {
				const ids = selectedCards.length
					? [activeCard, ...selectedCards.filter((card) => card.title !== active.id)]
					: [activeCard];

				const newStack = `Stack${Object.keys(stack).length + 1}`;
				setStacks((stacks) => {
					return {
						...stacks,
						[activeContainer]: {
							...stacks[activeContainer],
							cards: stacks[activeContainer].cards.filter(
								(card) => !ids.map((c) => c.title).includes(card.title)
							),
						},
						[newStack]: {
							title: newStack,
							cards: ids,
							x: mousePosition.x,
							y: mousePosition.y,
						},
					};
				});
				setSelectedCards([]);
				return;
			}
			if (!activeContainer || !overId || !initialContainer) {
				setActiveCard(null);
				setActiveCardIndex(null);
				setSelectedCards([]);
				return;
			}

			const ids = selectedCards.length
				? [activeCard, ...selectedCards.filter((card) => card.title !== active.id)]
				: [activeCard];

			const overContainer = findContainer(overId);

			if (overContainer) {
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
			setActiveCardIndex(null);
			setDraggingFlag(false);
		}
	};

	const searchHandler = (e) => {
		e.preventDefault();
		if (searchText.length === 0) {
			setSelectedCards([]);
			return;
		}
		const allCards = Object.values(stacks).flatMap((stack) => stack.cards);
		setSelectedCards(allCards.filter((card) => card.title.includes(searchText)));
	};

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragCancel={() => setDraggingFlag(false)}
			sensors={sensors}
			collisionDetection={rectIntersection}
		>
			<div className="bg-[#29AAE1] flex items-center justify-center gap-[5px]  py-[8px] ">
				<form className="flex gap-[5px]" onSubmit={searchHandler}>
					<input
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						type="text"
						className="px-4 py-2 rounded-lg outline-none"
						placeholder="Search Cards"
					/>
				</form>
			</div>
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
			</DroppableBoard>
			<CardOverlay card={activeCard} index={activeCardIndex} />
		</DndContext>
	);
};

export default DesktopView;
