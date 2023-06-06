import { v4 as uuidv4 } from "uuid";

const words = [
	{
		title: "butterfly",
		image: "https://images.pexels.com/photos/1321524/pexels-photo-1321524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "panda",
		image: "https://images.pexels.com/photos/3608263/pexels-photo-3608263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "parrot",
		image: "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "horse",
		image: "https://images.pexels.com/photos/2313396/pexels-photo-2313396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "lion",
		image: "https://images.pexels.com/photos/41315/africa-african-animal-cat-41315.jpeg?auto=compress&cs=tinysrgb&w=1600",
	},
	{
		title: "cat",
		image: "https://images.pexels.com/photos/2255564/pexels-photo-2255564.jpeg?auto=compress&cs=tinysrgb&w=1600",
	},
	{
		title: "dog",
		image: "https://images.pexels.com/photos/15175668/pexels-photo-15175668/free-photo-of-a-black-dog-in-close-up-shot.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "elephant",
		image: "https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=1600",
	},
	{
		title: "deer",
		image: "https://images.pexels.com/photos/704320/pexels-photo-704320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "peacock",
		image: "https://images.pexels.com/photos/45911/peacock-plumage-bird-peafowl-45911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "eagle",
		image: "https://images.pexels.com/photos/53581/bald-eagles-bald-eagle-bird-of-prey-adler-53581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "girrafe",
		image: "https://images.pexels.com/photos/54081/giraffes-south-africa-safari-africa-54081.jpeg?auto=compress&cs=tinysrgb&w=1600",
	},
	{
		title: "zebra",
		image: "https://images.pexels.com/photos/259547/pexels-photo-259547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
	{
		title: "penguin",
		image: "https://images.pexels.com/photos/46235/emperor-penguins-antarctic-life-animal-46235.jpeg?auto=compress&cs=tinysrgb&w=1600",
	},
	{
		title: "fish",
		image: "https://images.pexels.com/photos/3220368/pexels-photo-3220368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
	},
];

// Helper function to generate a random number within a range
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomWord() {
	return words[Math.floor(Math.random() * words.length)];
}

// Helper function to generate an array of cards
export function generateCards(stackName, numCards) {
	const cards = [];
	for (let i = 1; i <= numCards; i++) {
		const animal = getRandomWord();
		cards.push({
			id: uuidv4(),
			title: animal.title,
			image: animal.image,
			x: 0,
			y: 0,
		});
	}
	return cards;
}

// Generate 100 stacks
export const stack = {};
for (let i = 1; i <= 3; i++) {
	const stackKey = `Stack${i}`;
	stack[stackKey] = {
		title: stackKey,
		x: getRandomNumber(0, window.innerWidth - 200),
		y: getRandomNumber(0, window.innerHeight - 200),
		cards: generateCards(stackKey, 3),
	};
}
