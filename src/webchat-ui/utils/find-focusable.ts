/**
 * Gets keyboard-focusable elements within a given element
 * @param {HTMLElement} element
 * @returns {Array}
 */
const getKeyboardFocusableElements = (element: HTMLElement) => {
	// Get all interactive elements in given element
	const interactiveEls = element?.querySelectorAll(
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