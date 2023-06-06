import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { useDndContext } from "@dnd-kit/core";
const CardOverlay = ({ card, index }) => {
	const { active } = useDndContext();
	if (active?.data.current.type === "card") {
		return (
			<DragOverlay>
				{card && (
					<img
						src={card.image}
						alt={card.title}
						className="w-[176px] h-[100px] rounded-[8px] mt-[-88px]"
					/>
				)}
			</DragOverlay>
		);
	}
};

export default CardOverlay;
