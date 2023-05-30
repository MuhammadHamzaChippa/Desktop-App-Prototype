import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineFullscreen } from "react-icons/ai";
import { useDraggable } from "@dnd-kit/core";
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
				{stack.cards
					.slice(0)
					.reverse()
					.map((card, index) => {
						return (
							<motion.div
								whileHover={{
									y: -5,
									transition: { duration: 0.3 },
								}}
								style={{
									position: "relative",
									zIndex: index,
									marginLeft: 12 * (stack.cards.length - index),
								}}
								key={card}
								className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] mt-[-88px] flex items-center justify-center"
							>
								{card}
							</motion.div>
						);
					})}
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
