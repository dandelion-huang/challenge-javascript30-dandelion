const secondHand = document.querySelector('.second-hand');
const minHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

let secondRound = 0, shouldUpdateSecond = true;
let minRound = 0, shouldUpdateMin = true;
let hourRound = 0, shouldUpdateHour = true;

const setTransition = () => {
	secondHand.style.transition = 'transform 0.05s cubic-bezier(0.1, 2.7, 0.58, 1)';
};

const shouldFixDegrees = (date) => {
	if (date === 0) {
		return true;
	}

	return false;
};

const setDate = () => {
	const now = new Date();
	const seconds = now.getSeconds();

	if (shouldUpdateSecond && shouldFixDegrees(seconds)) {
		shouldUpdateSecond = false;
		++secondRound;

		setTimeout(() => {
			shouldUpdateSecond = true;
		}, 1000);
	}

	const secondsDegrees = (seconds / 60 + secondRound) * 360;

	secondHand.style.transform = `translateX(-2px) rotate(${secondsDegrees}deg)`;

	const mins = now.getMinutes();

	if (shouldUpdateMin && shouldFixDegrees(mins)) {
        shouldUpdateMin = false;
		++minRound;

        setTimeout(() => {
			shouldUpdateMin = true;
		}, 1000);
	}

	const minsDegrees = (mins / 60 + minRound) * 360 + (seconds / 60) * 6;

	minHand.style.transform = `translate(-3px, 25%) rotate(${minsDegrees}deg)`;

	const hours = now.getHours();

	if (shouldUpdateHour && shouldFixDegrees(hours)) {
        shouldUpdateHour = false;
		++hourRound;

        setTimeout(() => {
			shouldUpdateHour = true;
		}, 1000);
	}

	const hoursDegrees = (hours / 12 + hourRound) * 360 + (mins / 60) * 30;

	hourHand.style.transform = `translate(-4px, 66.6667%) rotate(${hoursDegrees}deg`;

	setTimeout(setDate, 60);
};

setTransition();
setDate();
