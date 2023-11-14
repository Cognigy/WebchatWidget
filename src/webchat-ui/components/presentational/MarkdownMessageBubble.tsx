import styled from '@emotion/styled';
import MessageBubble from "./MessageBubble";
import tinycolor from "tinycolor2";

/**
 * A Message Bubble, but enhanced with
 * generic CSS styles for markdown output
 *
 *
 * Derive from:
 * https://github.com/markdowncss/modest
 */
export const MarkdownMessageBubble = styled(MessageBubble)((props) => {
  const dividerColor = tinycolor(
    props.color === "primary"
      ? props.theme.primaryContrastColor
      : props.theme.greyContrastColor
  ).setAlpha(0.25);

  const textColor =
    props.color === "primary"
      ? props.theme.primaryContrastColor
      : props.theme.greyContrastColor;

  const interactionColor =
    props.color === "primary"
      ? props.theme.primaryWeakColor
      : props.theme.greyWeakColor;

  const codeBackgroundColor =
    props.color === "primary"
      ? props.theme.primaryWeakColor
      : props.theme.greyWeakColor;

  const monospaceFontFamily =
    'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace';

  return `
    white-space: pre-wrap;
    color: ${textColor};
  
    th, 
    td {
        padding: ${props.theme.unitSize / 2}px;
        color: ${textColor};
    }
  
    &>*:first-child {
      margin-top: 0;
    }
  
    &>*:last-child {
      margin-bottom: 0;
    }
    
    pre {
      padding: 1em;
      line-height: 1.25;
      overflow-x: auto;
    }
    
    a,
    a:visited {
      color: ${textColor};
    }
    
    a:hover,
    a:focus,
    a:active {
      text-decoration: none;
    }
    
    p,
    .modest-p {
      font-size: 1em;
      margin-bottom: 1.3em;
    }
    
    h1,
    h2,
    h3,
    h4 {
      margin: 1em 0 .5em;
      font-weight: inherit;
      line-height: 1.42;
    }
    
    h1 {
      margin-top: 0;
      font-size: 3.998em;
    }
    
    h2 {
      font-size: 2.827em;
    }
    
    h3 {
      font-size: 1.999em;
    }
    
    h4 {
      font-size: 1.414em;
    }
    
    h5 {
      font-size: 1.121em;
    }
    
    h6 {
      font-size: .88em;
    }
    
    small,
    .modest-small {
      font-size: .707em;
    }
    
    img,
    canvas,
    iframe,
    video,
    svg,
    select,
    textarea {
      max-width: 100%;
    }
    
    blockquote {
      border-left: ${props.theme.unitSize / 2}px solid ${dividerColor};
      padding: ${props.theme.unitSize}px;
      margin-left: 0;
    }
    
    pre,
    code {
      background-color: ${codeBackgroundColor};
      font-family: ${monospaceFontFamily};
      font-size: small;
    }
  
    hr {
      border-color: ${dividerColor};
    }

    dl {
      margin-top: 1em;
      margin-bottom: 1em;
    }

    dt {
      margin-top: 1em;
      font-weight: bold;
      margin-bottom: .3em;
    }
    dt:first-of-type {
      margin-top: 0;
    }

    dd {
      padding-left: 0;
      margin-left: .5em;
    }
  `;
});
