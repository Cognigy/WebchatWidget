import '@emotion/react'
import { IWebchatTheme } from './webchat-ui/style';

declare module '@emotion/react' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface Theme extends IWebchatTheme { }
}