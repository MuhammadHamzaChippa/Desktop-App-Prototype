import { atom } from "recoil";

export const selectedCardsState = atom({
	key: "selectedCards",
	default: [],
});

export const draggingIdsState = atom({
	key: "draggingIdsState",
	default: {},
});

