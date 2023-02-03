const playSound = (e) => {
	let keyCode;

	if (e.type === 'mousedown') {
		keyCode = e.target.closest('.key').dataset.keyCode;
	} else if (e.type === 'keydown') {
		keyCode = e.code;
	} else return; // early return

	const audio = document.querySelector(`audio[data-key-code=${keyCode}]`);

	if (audio === null) return; // early return

	audio.currentTime = 0; // reset the audio time
	audio.play(); // play the audio
};

const highlightKeyStyle = (e) => {
    let keyCode;

	if (e.type === 'mousedown') {
		keyCode = e.target.closest('.key').dataset.keyCode;
	} else if (e.type === 'keydown') {
		keyCode = e.code;
	} else return; // early return

	const key = document.querySelector(`.key[data-key-code=${keyCode}]`);

	if (key === null) return; // early return

	key.classList.add('playing');
};

const removeHighlightKeyStyle = (e) => {
    let keyCode;

	if (e.type === 'mouseup' || e.type === 'mouseleave') {
		keyCode = e.target.closest('.key').dataset.keyCode;
	} else if (e.type === 'keyup') {
		keyCode = e.code;
	} else return; // early return

	const key = document.querySelector(`.key[data-key-code=${keyCode}]`);

	if (key.classList.contains('playing')) {
		key.classList.remove('playing');
	}
};

window.addEventListener('keydown', playSound);
window.addEventListener('keydown', highlightKeyStyle);
window.addEventListener('keyup', removeHighlightKeyStyle);

const keys = document.querySelectorAll('.key');
keys.forEach((key) => {
	key.addEventListener('mousedown', playSound);
	key.addEventListener('mousedown', highlightKeyStyle);
	key.addEventListener('mouseup', removeHighlightKeyStyle);
	key.addEventListener('mouseleave', removeHighlightKeyStyle);
});
