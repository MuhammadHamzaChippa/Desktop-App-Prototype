import React, { useState } from "react";
import { stack } from "./data";
import Stack from "./Stack";
import DroppableBoard from "./DroppableBoard";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
const DesktopView = () => {
	const [stacks, setStacks] = useState(stack);
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const onDragStart = (result) => {
		console.log(result);
	};

	const onDragEnd = (result) => {
		const { active, delta } = result;
		console.log(result);
		if (active.data.current.type === "stack") {
			setStacks({
				...stacks,
				[active.id]: {
					...stacks[active.id],
					x: stacks[active.id].x + delta.x,
					y: stacks[active.id].y + delta.y,
				},
			});
		}
	};

	return (
		<DndContext
			modifiers={[restrictToParentElement]}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			<DroppableBoard>
				{Object.keys(stacks).map((s) => {
					const stack = stacks[s];
					return <Stack key={stack.title} stack={stack} />;
				})}
			</DroppableBoard>
		</DndContext>
	);
};

export default DesktopView;
