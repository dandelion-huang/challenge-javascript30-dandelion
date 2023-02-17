const inputs = document.querySelectorAll('.controls input');

const handleUpdate = (e) => {
	// '' for color input or it'll be undefined
	const suffix = e.target.dataset.sizing || '';
	document.documentElement.style.setProperty(`--${e.target.name}`, e.target.value + suffix);
};

inputs.forEach((input) => {
	input.addEventListener('input', handleUpdate);
	input.addEventListener('change', handleUpdate);
});
