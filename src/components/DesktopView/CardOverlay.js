import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { useDndContext } from "@dnd-kit/core";
const CardOverlay = ({ card, index }) => {
	const { active } = useDndContext();
	if (active?.data.current.type === "card") {
		return (
			<DragOverlay >
				{card && (
					<div className="bg-[white] border-solid mt-[10px] border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center mt-[-88px]">
						{card.title}
					</div>
				)}
			</DragOverlay>
		);
	}
};

export default CardOverlay;
