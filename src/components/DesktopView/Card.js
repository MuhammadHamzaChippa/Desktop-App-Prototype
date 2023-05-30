import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

const Card = ({ card, index, zIndex }) => {
	const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
		id: card,
		data: {
			type: "card",
		},
	});

	const style = {
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
				style={{
					position: "relative",
					zIndex: zIndex,
					marginLeft: 12 * index,
				}}
				key={card}
				className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] mt-[-88px] flex items-center justify-center"
			>
				{card}
			</motion.div>
		</div>
	);
};

export default Card;
