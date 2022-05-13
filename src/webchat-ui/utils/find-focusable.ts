/**
 * Gets keyboard-focusable elements within the webchat
 * @returns {Array}
 */
const getKeyboardFocusableElements = () => {
	const webchatWindow = document.getElementById("webchatWindow");

	// Get all interactive elements in webchat
	const interactiveEls = webchatWindow?.querySelectorAll(
		'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
	);
	const interactiveElsArray = interactiveEls && Array.from(interactiveEls);

	// Filter all the interactive elements that are not disabled or have aria-hidden 'true'
	const focusable = interactiveElsArray?.filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

	const firstFocusable = focusable && focusable[0] as HTMLElement;
	const lastFocusable = focusable && focusable[focusable.length-1] as HTMLElement;

	return {firstFocusable, lastFocusable};		
}

export default getKeyboardFocusableElements;