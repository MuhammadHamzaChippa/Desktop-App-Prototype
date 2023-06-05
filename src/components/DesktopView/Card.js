import React from "react";
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { selectedCardsState } from "./store";
import { useRecoilValue } from "recoil";
import useZindex from "./useZindex";
const Card = ({ card, index, zIndex, handleSelect }) => {
	const { over } = useDndContext();
	const draggingZindex = useZindex();
	const selectedCards = useRecoilValue(selectedCardsState);
	const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
		id: card.title,
		data: {
			type: "card",
		},
	});

	const cardZindex = isDragging ? draggingZindex : zIndex + 1;

	const style = {
		position: "relative",
		transition,
		transform: CSS.Transform.toString(transform),
		zIndex: cardZindex,
	};

	return (
		<div ref={setNodeRef} {...attributes} {...listeners} style={style}>
			<motion.div
				onClick={() => handleSelect(card)}
				whileHover={{
					y: index !== 1 ? -10 : 0,
					transition: { duration: 0.3 },
				}}
				animate={{ x: selectedCards.includes(card) && !isDragging ? 20 : 0 }}
				style={
					{
						marginTop: -88,
						marginLeft: 12 * index,
					}
				}
				key={card}
				className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center"
			>
				{card.title} <br />
				{/* {cardZindex} */}
			</motion.div>
		</div>
	);
};

export default Card;
