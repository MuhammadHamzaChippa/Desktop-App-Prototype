import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useDndContext } from "@dnd-kit/core";
const CardOverlay = ({ card, index }) => {
	const { active } = useDndContext();
	if (active?.data.current.type === "card") {
		return (
			<DragOverlay modifiers={[snapCenterToCursor]}>
				{card && (
					<div className="bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center mt-[-88px]">
						{card.title}
					</div>
				)}
			</DragOverlay>
		);
	}
};

export default CardOverlay;
