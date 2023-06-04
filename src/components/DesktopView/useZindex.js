import React from "react";
import { stacksState } from "./store";
import { useRecoilValue } from "recoil";
import { useDndContext } from "@dnd-kit/core";
const useZindex = () => {
	const stacks = useRecoilValue(stacksState);
	const { active, over } = useDndContext();

	const findContainer = (id) => {
		if (id in stacks) {
			return id;
		}

		return Object.keys(stacks).find((key) =>
			stacks[key].cards.map((card) => card.title).includes(id)
		);
	};

	const overContainer = findContainer(over?.id);
	const activeContainer = findContainer(active?.id);
	const overCards = stacks[overContainer]?.cards;
	const activeCards = stacks[activeContainer]?.cards;
	const activeIndex = activeCards?.findIndex((card) => card.title === active?.id);
	const overIndex = overCards?.findIndex((card) => card.title === over?.id);
	// if (zIndex === cards?.length - 1) {
	// 	return zIndex + 2;
	// } else {
	// 	return zIndex + 1;
	// }
	if (activeIndex > overIndex) {
		return overIndex || 0;
	} else {
		return overIndex + 2 || 999;
	}
};

export default useZindex;
