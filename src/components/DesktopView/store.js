import { atom } from "recoil";
import { stack } from "./data";

export const selectedCardsState = atom({
	key: "selectedCards",
	default: [],
});

export const stacksState = atom({
	key: "stacks",
	default: stack,
});

export const isDraggingState = atom({
	key: "isDragging",
	default: false,
});

export const selectedStackState = atom({
	key: "selectedStack",
	default: null,
});
