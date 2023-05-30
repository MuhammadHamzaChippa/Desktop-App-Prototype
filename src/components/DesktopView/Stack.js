import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineFullscreen } from "react-icons/ai";
import { useDraggable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";
const Stack = ({ stack }) => {
	const [showStack, setShowStack] = useState(false);
	const { attributes, listeners, isDragging, setNodeRef, transform } = useDraggable({
		id: stack.title,
		data: { type: "stack" },
	});

	function getStyles(left, top, transform) {
		return {
			cursor: "grab",
			position: "absolute",
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
					opacity: showStack ? 1 : 0,
				}}
			>
				<SortableContext items={stack.cards} strategy={verticalListSortingStrategy}>
					{stack.cards
						// .slice(0)
						// .reverse()
						.map((card, index) => {
							return (
								<Card
									key={card}
									card={card}
									index={stack.cards.length - index}
									zIndex={index}
								/>
							);
						})}
				</SortableContext>
			</motion.div>
			<div
				{...attributes}
				{...listeners}
				style={{ zIndex: stack.cards.length + 1 }}
				className="relative flex items-center justify-between w-[176px] bg-[#29AAE1] mt-[-20px] text-[white] cursor-pointer rounded-[8px] py-[4px] px-[8px]"
			>
				{stack.title}
				<AiOutlineFullscreen onClick={() => setShowStack(!showStack)} />
			</div>
		</div>
	);
};

export default Stack;
