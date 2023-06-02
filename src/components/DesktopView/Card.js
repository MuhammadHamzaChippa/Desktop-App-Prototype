import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { selectedCardsState, overIdState } from "./store";
import { useRecoilValue } from "recoil";
const Card = ({ card, index, zIndex, handleSelect, draggingZindex }) => {
	const selectedCards = useRecoilValue(selectedCardsState);
	const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
		id: card,
		data: {
			type: "card",
		},
	});

	const cardZindex = isDragging ? draggingZindex() : zIndex + 1;

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
					y: -10,
					transition: { duration: 0.3 },
				}}
				animate={{ x: selectedCards.includes(card) && !isDragging ? 20 : 0 }}
				style={{
					marginTop: -88,
					marginLeft: 12 * index,
				}}
				key={card}
				className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center"
			>
				{card} <br />
				{cardZindex}
			</motion.div>
		</div>
	);
};

export default Card;
