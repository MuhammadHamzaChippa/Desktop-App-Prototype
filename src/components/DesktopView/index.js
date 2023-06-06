import React, { useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Stack from "./Stack";
import DroppableBoard from "./DroppableBoard";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	closestCorners,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { selectedCardsState, stacksState, isDraggingState, selectedStackState } from "./store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { arrayMove } from "@dnd-kit/sortable";
import CardOverlay from "./CardOverlay";
import { stack, getRandomWord } from "./data";
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
	const selectedStack = useRecoilValue(selectedStackState);
	const [activeCard, setActiveCard] = useState(null);
	const [activeCardIndex, setActiveCardIndex] = useState(null);
	const [selectedCards, setSelectedCards] = useRecoilState(selectedCardsState);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const createStack = () => {
		const newStack = `Stack${Object.keys(stack).length + 1}`;

		setStacks((stacks) => {
			return {
				...stacks,
				[newStack]: {
					title: newStack,
					cards: [],
					x: 100,
					y: 100,
				},
			};
		});
	};

	const createCard = () => {
		const animal = getRandomWord();
		const newCard = { id: uuidv4(), x: 0, y: 0, ...animal };
		setStacks((stacks) => {
			return {
				...stacks,
				[selectedStack]: {
					...stacks[selectedStack],
					cards: [newCard, ...stacks[selectedStack].cards],
				},
			};
		});
	};
	const findContainer = (id) => {
		if (id in stacks) {
			return id;
		}

		return Object.keys(stacks).find((key) =>
			stacks[key].cards.map((card) => card.id).includes(id)
		);
	};

	const handleSelect = (card) => {
		setSelectedCards((selectedCards) => {
			if (selectedCards.includes(card)) {
				return selectedCards.filter((value) => value.id !== card.id);
			}

			return selectedCards.concat(card);
		});
	};

	const initialContainer = useMemo(
		() => (activeCard ? findContainer(activeCard.id) : null),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[activeCard]
	);

	function filterItems(stack) {
		if (!activeCard) {
			return stack.cards;
		}

		return stack.cards.filter(
			(card) =>
				card.id === activeCard.id || !selectedCards.map((card) => card.id).includes(card.id)
		);
	}

	const onDragStart = (result) => {
		const { active } = result;
		if (active.data.current.type === "card") {
			setDraggingFlag(true);
			setSelectedCards((selectedCard) =>
				selectedCard.map((card) => card.id).includes(active.id) ? selectedCard : []
			);
			const activeStack = findContainer(active.id);
			setActiveCard(stacks[activeStack].cards.find((card) => card.id === active.id));
			setActiveCardIndex(
				stacks[activeStack].cards.findIndex((card) => card.id === active.id)
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
					const overIndex = overItems.findIndex((card) => card.id === overId);
					const activeIndex = activeItems.findIndex((card) => card.id === active.id);

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
						cards: stacks[activeStack].cards.filter((card) => card.id !== active.id),
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
					? [activeCard, ...selectedCards.filter((card) => card.id !== active.id)]
					: [activeCard];

				const newStacks = {};
				for (let key of Object.keys(stacks)) {
					newStacks[key] = {
						...stacks[key],
						cards: stacks[key].cards.filter(
							(card) => !ids.map((c) => c.id).includes(card.id)
						),
					};
				}

				const newStack = `Stack${Object.keys(stack).length + 1}`;

				newStacks[newStack] = {
					title: newStack,
					cards: ids,
					x: mousePosition.x,
					y: mousePosition.y,
				};

				setDraggingFlag(false);
				setStacks(newStacks);
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
				? [activeCard, ...selectedCards.filter((card) => card.id !== active.id)]
				: [activeCard];

			const overContainer = findContainer(overId);

			if (overContainer) {
				const overItems = filterItems(stacks[overContainer]);
				const overIndex = overItems.findIndex((card) => card.id === overId);
				const activeIndex = overItems.findIndex((card) => card.id === active.id);
				const newItems = arrayMove(overItems, activeIndex, overIndex);
				const newActiveIndex = newItems.findIndex((card) => card.id === active.id);

				const initalStack = {
					...stacks[initialContainer],
					cards: stacks[initialContainer].cards.filter(
						(card) => !ids.map((c) => c.id).includes(card.id)
					),
				};

				const activeStack = {
					...stacks[activeContainer],
					cards: stacks[activeContainer].cards.filter(
						(card) => !ids.map((c) => c.id).includes(card.id)
					),
				};

				const overStack = {
					...stacks[overContainer],
					cards: [
						...newItems.slice(0, newActiveIndex + 1),
						...ids.filter((card) => card.id !== active.id),
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
		setSelectedCards(
			allCards.filter((card) => card.title.toLowerCase().includes(searchText.toLowerCase()))
		);
	};

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragOver={onDragOver}
			onDragEnd={onDragEnd}
			onDragCancel={() => setDraggingFlag(false)}
			sensors={sensors}
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
					{selectedCards.length > 0 && (
						<button
							onClick={() => setSelectedCards([])}
							className="bg-[red] text-[white] px-4 py-2 rounded-lg"
						>
							Clear Searched Cards
						</button>
					)}
					{!!selectedStack && (
						<button
							onClick={createCard}
							className="bg-[lightblue] text-[white] px-4 py-2 rounded-lg"
						>
							Create Card
						</button>
					)}
					<button
						onClick={createStack}
						className="bg-[lightblue] text-[white] px-4 py-2 rounded-lg"
					>
						Create Stack
					</button>
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
