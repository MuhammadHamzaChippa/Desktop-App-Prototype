import React, { useState } from "react";
import { stack } from "./data";
import Stack from "./Stack";
const DesktopView = () => {
	const [stacks, setStacks] = useState(stack);
	return (
		<div className="bg-[lightgrey] h-[100vh] relative">
			{Object.keys(stacks).map((s) => {
				const stack = stacks[s];
				console.log(stack.cards.reverse());
				return <Stack stack={stack} />;
			})}
		</div>
	);
};

export default DesktopView;
