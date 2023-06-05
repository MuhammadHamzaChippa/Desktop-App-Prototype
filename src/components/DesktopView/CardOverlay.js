import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
const CardOverlay = ({ card }) => {
	return (
		<DragOverlay >
			{card && (
				<div className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center mt-[-88px]">
					{card.title}
				</div>
			)}
		</DragOverlay>
	);
};

export default CardOverlay;
