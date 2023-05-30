import { atom } from "recoil";

export const selectedCardsState = atom({
	key: "selectedCards",
	default: [],
});
