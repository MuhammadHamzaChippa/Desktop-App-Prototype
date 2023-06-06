const words = [
	"Apple",
	"Banana",
	"Cat",
	"Dog",
	"Elephant",
	"Frog",
	"Guitar",
	"House",
	"Igloo",
	"Juice",
	"Kangaroo",
	"Lemon",
	"Monkey",
	"Night",
	"Orange",
	"Penguin",
	"Queen",
	"Rabbit",
	"Sun",
	"Tiger",
	"Umbrella",
	"Violin",
	"Whale",
	"Xylophone",
	"Yak",
	"Zebra",
	"Ant",
	"Ball",
	"Car",
	"Desk",
	"Elephant",
	"Feather",
	"Globe",
	"Hat",
	"Island",
	"Jacket",
	"Key",
	"Lion",
	"Mouse",
	"Nest",
	"Octopus",
	"Pear",
	"Quilt",
	"Rose",
	"Snake",
	"Tree",
	"Unicorn",
	"Vase",
	"Water",
	"X-ray",
	"Yak",
	"Zebra",
	"Airplane",
	"Boat",
	"Cup",
	"Dolphin",
	"Egg",
	"Fire",
	"Guitar",
	"Hat",
	"Ice cream",
	"Jellyfish",
	"Koala",
	"Lizard",
	"Monkey",
	"Noodle",
	"Owl",
	"Pizza",
	"Queen",
	"Rainbow",
	"Snake",
	"Tiger",
	"Umbrella",
	"Volcano",
	"Waterfall",
	"Xylophone",
	"Yogurt",
	"Zebra",
	"Apple",
	"Butterfly",
	"Cat",
	"Dolphin",
	"Elephant",
	"Fox",
	"Giraffe",
	"Horse",
	"Ice cream",
	"Jellyfish",
	"Kiwi",
	"Lion",
	"Monkey",
	"Nut",
	"Owl",
	"Penguin",
	"Quail",
	"Rabbit",
	"Snake",
	"Tiger",
	"Umbrella",
	"Vulture",
];

// Helper function to generate a random number within a range
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate an array of cards
function generateCards(stackName, numCards) {
	const cards = [];
	for (let i = 1; i <= numCards; i++) {
		cards.push({
			title: `${words[Math.floor(Math.random() * words.length)]}-${getRandomNumber(
				1,
				10000
			)}`,
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
