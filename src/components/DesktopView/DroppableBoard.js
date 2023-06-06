import React from "react";
import { useDroppable } from "@dnd-kit/core";
const DroppableBoard = ({ children }) => {
	const { setNodeRef } = useDroppable({
		id: "desktop",
	});
	return (
		<div style={{height: "calc(100vh - 56px)"}} className="bg-[lightgrey] relative" ref={setNodeRef}>
			{children}
		</div>
	);
};

export default DroppableBoard;
