import React from "react";
import { useDraggable } from "@dnd-kit/core";
const FreeCard = ({ card }) => {
	const { attributes, listeners, isDragging, setNodeRef, transform } = useDraggable({
		id: card.title,
		data: { type: "freeCard" },
	});

	function getStyles(left, top, transform) {
		return {
			cursor: "grab",
			position: "absolute",
			zIndex: isDragging ? 999 : 1,
			"--top": `${top}px`,
			"--left": `${left}px`,
			"--translate-x": `${transform?.x ?? 0}px`,
			"--translate-y": `${transform?.y ?? 0}px`,
		};
	}

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			style={{ ...getStyles(card.x, card.y, transform) }}
			className="stack bg-[white] border-solid border-[2px] border-[#29AAE1] w-[176px] h-[100px] rounded-[8px] flex items-center justify-center"
		>
			{card.title}
		</div>
	);
};

export default FreeCard;
