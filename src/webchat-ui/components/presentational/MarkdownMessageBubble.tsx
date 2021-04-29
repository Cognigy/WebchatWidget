import { styled } from "../../style";
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
  const dividerColor = tinycolor(props.theme.primaryContrastColor).setAlpha(
    0.25
  );

  return `
    white-space: initial;
    color: ${props.theme.primaryContrastColor};
  
    th, 
    td {
        padding: ${props.theme.unitSize / 2}px;
        color: ${props.theme.primaryContrastColor};
    }
  
    &>*:first-child {
      margin-top: 0;
    }
  
    &>*:last-child {
      margin-bottom: 0;
    }
  
    pre,
    code {
      font-family: Menlo, Monaco, "Courier New", monospace;
    }
    
    pre {
      padding: .5em;
      line-height: 1.25;
      overflow-x: auto;
    }
    
    a,
    a:visited {
      color: ${props.theme.primaryContrastColor};
    }
    
    a:hover,
    a:focus,
    a:active {
      color: ${props.theme.primaryWeakColor};
    }
    
    .modest-no-decoration {
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
      background-color: ${props.theme.primaryStrongColor};
    }
  
    hr {
      border-color: ${dividerColor};
    }
  `;
});
