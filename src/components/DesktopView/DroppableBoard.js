import React from "react";
import { useDroppable } from "@dnd-kit/core";
const DroppableBoard = ({ children }) => {
	const { setNodeRef } = useDroppable({
		id: "desktop",
	});
	return (
		<div className="bg-[lightgrey] h-[100vh] relative" ref={setNodeRef}>
			{children}
		</div>
	);
};

export default DroppableBoard;
