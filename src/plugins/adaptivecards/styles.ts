import memoize from 'memoize-one';

// create a container element for adaptive card styles
const styleEl = document.createElement('style');
styleEl.type = 'text/css';
styleEl.id = 'accss';

// add container element to the body
const head = document.head || document.getElementsByTagName('head')[0];
head.appendChild(styleEl);


// calculate css based on a theme
export const getAdaptiveCardCSS = theme => `
.ac-pushbutton,
.ac-pushbutton.subdued {
  background-color: transparent;
  border: 1px solid ${theme.primaryColor};  
  color: ${theme.primaryColor};

  cursor: pointer;
  height: 40px;

  padding: ${theme.unitSize}px ${theme.unitSize * 2}px;
  border-radius: ${theme.unitSize * 2}px;
}

.ac-pushbutton.style-default.expandable.expanded {
  background: ${theme.primaryGradient};
  color: ${theme.primaryContrastColor};
  border: 1px solid ${theme.primaryColor};

  cursor: pointer;
  height: 40px;

  padding: ${theme.unitSize}px ${theme.unitSize * 2}px;
  border-radius: ${theme.unitSize * 2}px;
}

/*.ac-input {
  border: 1px solid ${theme.primaryColor};
  height: 40;
  padding: ${theme.unitSize}px ${theme.unitSize * 2}px;
}*/

.adaptivecard-wrapper {
  width: 100%;
  padding-left: ${theme.unitSize * 2}px;
  padding-right: ${theme.unitSize * 2}px;
  box-sizing: border-box;
}

.adaptivecard-wrapper > * {
  background-color: white;
  border-radius: ${theme.unitSize}px;
  box-shadow: ${theme.shadow};
}
`;

// updates the container style element with styles form the render function
const updateAdaptiveCardCSS = theme => {
  styleEl.innerHTML = getAdaptiveCardCSS(theme);
}

// updates only if necessary
export const updateAdaptiveCardCSSCheaply = memoize(updateAdaptiveCardCSS);