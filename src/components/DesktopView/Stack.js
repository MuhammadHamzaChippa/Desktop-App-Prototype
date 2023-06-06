import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineFullscreen } from "react-icons/ai";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { isDraggingState, selectedCardsState } from "./store";
import { useRecoilValue } from "recoil";
import Card from "./Card";
const Stack = ({ stack, handleSelect, cards }) => {
	const [showStack, setShowStack] = useState(false);
	const selectedCards = useRecoilValue(selectedCardsState);
	const draggingFlag = useRecoilValue(isDraggingState);
	const { attributes, listeners, isDragging, setNodeRef, transform } = useDraggable({
		id: stack.title,
		data: { type: "stack" },
	});

	const { setNodeRef: dropRef } = useDroppable({
		id: stack.title,
	});

	function getStyles(left, top, transform) {
		return {
			cursor: "grab",
			position: "absolute",
			zIndex: isDragging ? 999 : 1,
			"--top": `${top}px`,
			"--left": `${left}px`,
			"--translate-x": `${transform?.x ?? 0}px`,
			"--translate-y": `${transform?.y ?? 0}px`,
		};
	}

	return (
		<div
			className="stack"
			style={{ ...getStyles(stack.x, stack.y, transform) }}
			key={stack.title}
			ref={setNodeRef}
		>
			<motion.div
				initial={false}
				animate={{
					scale:
						showStack ||
						draggingFlag ||
						stack.cards.filter((card) => selectedCards.includes(card)).length > 0
							? 1
							: 0,
					transition: { duration: 0.3 },
				}}
			>
				<SortableContext
					items={stack.cards.map((card) => card.title)}
					strategy={verticalListSortingStrategy}
				>
					<div
						ref={dropRef}
						className={`${
							stack.cards.length === 0 ? "" : ""
						} flex flex-col bg-[red] pt-[20px]`}
					>
						{cards
							// .slice(0)
							// .reverse()
							.map((card, index) => {
								return (
									<Card
										key={card.title}
										card={card}
										index={stack.cards.length - index}
										zIndex={index}
										handleSelect={handleSelect}
									/>
								);
							})}
					</div>
				</SortableContext>
			</motion.div>
			<div
				{...attributes}
				{...listeners}
				style={{ zIndex: stack.cards.length + 1 }}
				className="border border-solid border-[#29AAE1] text-[#29AAE1] relative flex items-center justify-between w-[176px] bg-[white] mt-[-20px] text-[white] cursor-pointer rounded-[8px] py-[4px] px-[8px]"
			>
				{stack.title}
				<AiOutlineFullscreen onClick={() => setShowStack(!showStack)} />
			</div>
		</div>
	);
};

export default Stack;
