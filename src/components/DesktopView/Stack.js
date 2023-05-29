import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineFullscreen } from "react-icons/ai";
const Stack = ({ stack }) => {
	const [showStack, setShowStack] = useState(false);
	return (
		<div style={{ top: stack.y, left: stack.x }} key={stack.title} className="absolute">
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
				style={{ zIndex: stack.cards.length + 1 }}
				className="relative flex items-center justify-between w-[176px] bg-[#29AAE1] mt-[-20px] w-fit text-[white] cursor-pointer rounded-[8px] py-[4px] px-[8px]"
			>
				{stack.title}
				<AiOutlineFullscreen onClick={() => setShowStack(!showStack)} />
			</div>
		</div>
	);
};

export default Stack;
