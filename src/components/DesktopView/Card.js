import React from "react";
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { selectedCardsState, isDraggingState } from "./store";
import { useRecoilValue } from "recoil";

const Card = ({ card, index, handleSelect }) => {
	const draggingFlag = useRecoilValue(isDraggingState);
	const { over } = useDndContext();
	const selectedCards = useRecoilValue(selectedCardsState);
	const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
		id: card.id,
		data: {
			type: "card",
		},
	});

	const style = {
		position: "relative",
		transition,
		transform: CSS.Transform.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} {...attributes} {...listeners} style={style}>
			<motion.div
				onClick={() => handleSelect(card)}
				whileHover={{
					y: index !== 1 ? -10 : 0,
					transition: { duration: 0.5 },
				}}
				animate={{
					marginTop: draggingFlag ? 0 : -88,
					marginLeft: draggingFlag ? 0 : 12 * index,
					x: selectedCards.includes(card) && !isDragging && !draggingFlag ? 20 : 0,
				}}
				style={{
					background: over?.id === "desktop" && isDragging ? "pink" : "white",
				}}
				key={card}
				className="border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center"
			>
				{card.title} <br />
				{/* {cardZindex} */}
			</motion.div>
		</div>
	);
};

export default Card;
