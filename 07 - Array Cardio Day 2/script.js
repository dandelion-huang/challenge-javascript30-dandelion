// ## Array Cardio Day 2

const people = [
	{ name: 'Wes', year: 1988 },
	{ name: 'Kait', year: 1986 },
	{ name: 'Irv', year: 1970 },
	{ name: 'Lux', year: 2015 },
];

const comments = [
	{ text: 'Love this!', id: 523423 },
	{ text: 'Super good', id: 823423 },
	{ text: 'You are the best', id: 2039842 },
	{ text: 'Ramen is my fav food ever', id: 123523 },
	{ text: 'Nice Nice Nice!', id: 542328 },
];

// Some and Every Checks
// Array.prototype.some() // is at least one person 19 or older?
// Array.prototype.every() // is everyone 19 or older?
const isAnyAdult = people.some((person) => {
	const currentYear = new Date().getFullYear();

	if (currentYear - person.year >= 18) return true;
});

console.log(isAnyAdult);

const isEveryAdult = people.every((person) => {
	const currentYear = new Date().getFullYear();

	if (currentYear - person.year >= 18) return true;
});

console.log(isEveryAdult);

// Array.prototype.find()
// Find is like filter, but instead returns just the one you are looking for
// find the comment with the ID of 823423

const comment = comments.find((comment) => comment.id === 823423);

console.log(comment);

// Array.prototype.findIndex()
// Find the comment with this ID
// delete the comment with the ID of 823423

const commentIndex = comments.findIndex((comment) => comment.id === 823423);

console.log(commentIndex);

const newComments1 = [
  ...comments.slice(0, commentIndex),
  ...comments.slice(commentIndex + 1)
];

console.table(newComments1);

const comments2 = comments.splice(commentIndex, 1);

console.table(comments); // notice that we log comments but comments2

comments.splice(
	4,
  0,
	{ text: 'I am hungry...', id: 265031 },
	{ text: 'QAQ...', id: 957128 }
);

console.table(comments);
