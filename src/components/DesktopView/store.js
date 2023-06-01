import { atom } from "recoil";

export const selectedCardsState = atom({
	key: "selectedCards",
	default: [],
});

export const overIdState = atom({
	key: "overId",
	default: "",
});
