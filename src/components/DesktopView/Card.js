import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { selectedCardsState } from "./store";
const Card = ({ card, index, zIndex }) => {
	const [selectedCards, setSelectedCards] = useRecoilState(selectedCardsState);

	const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
		id: card,
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
				whileHover={{
					y: -5,
					transition: { duration: 0.3 },
				}}
				style={
					{
						// marginTop: -88 ,
						// marginLeft: 12 * index,
					}
				}
				key={card}
				className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center"
			>
				{card}
			</motion.div>
		</div>
	);
};

export default Card;