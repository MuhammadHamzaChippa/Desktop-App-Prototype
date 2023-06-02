// Helper function to generate a random number within a range
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate an array of cards
function generateCards(stackName, numCards) {
	const cards = [];
	for (let i = 1; i <= numCards; i++) {
		cards.push({ title: `${stackName}-Card${i}`, x: 0, y: 0 });
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

// Print the generated stack
console.log(stack);
