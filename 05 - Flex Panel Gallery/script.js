const panels = document.querySelectorAll('.panel');

const toggleOpen = (e) => {
	panels.forEach((panel) => {
		if (panel.classList.contains('is-active')) {
			panel.classList.remove('is-active');
		}
	});
	e.target.classList.toggle('is-active');
};

panels.forEach((panel) => panel.addEventListener('click', toggleOpen));
