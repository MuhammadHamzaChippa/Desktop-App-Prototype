import React from "react";
import { DragOverlay, useDndContext } from "@dnd-kit/core";
const CardOverlay = ({ card }) => {
	const { over } = useDndContext();
	if (over?.id === "desktop") {
		return (
			<DragOverlay>
				{card && (
					<div className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center">
						{card.title}
					</div>
				)}
			</DragOverlay>
		);
	}
};

export default CardOverlay;
