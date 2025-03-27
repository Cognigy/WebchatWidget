import { sanitize, Config } from 'dompurify';

export const allowedHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont",
	"bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col",
	"colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed",
	"fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5",
	"h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link",
	"main", "map", "mark", "meta", "meter", "nav", "noframes", "object", "ol", "optgroup", "option", "output", "p", "param",
	"picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small", "source", "span", "strike",
	"strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead",
	"time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];

export const allowedHtmlAttributes = ["accept", "accept-charset", "accesskey", "action", "align", "alt", "autocomplete", "autofocus",
	"autoplay", "bgcolor", "border", "charset", "checked", "cite", "class", "color", "cols", "colspan", "content",
	"contenteditable", "controls", "coords", "data", "data-*", "datetime", "default", "dir", "dirname",
	"disabled", "download", "draggable", "dropzone", "enctype", "for", "form", "formaction", "headers", "height",
	"hidden", "high", "href", "hreflang", "http-equiv", "id", "ismap", "kind", "label", "lang", "list", "loop", "low",
	"max", "maxlength", "media", "method", "min", "multiple", "muted", "name", "novalidate", "open", "optimum",
	"pattern", "placeholder", "poster", "preload", "readonly", "rel", "required", "reversed", "rows", "rowspan",
	"sandbox", "scope", "selected", "shape", "size", "sizes", "span", "spellcheck", "src", "srcdoc", "srclang",
	"srcset", "start", "step", "style", "tabindex", "target", "title", "translate", "type", "usemap", "value", "width", "wrap"];

const config: Config = {
    ALLOWED_TAGS: allowedHtmlTags,
    ALLOWED_ATTR: allowedHtmlAttributes
}

export const sanitizeHTML = (text: string) => sanitize(text, config).toString();