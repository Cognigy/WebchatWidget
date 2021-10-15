import * as React from "react";
import * as ReactDOM from "react-dom";
import { IMessage } from "../common/interfaces/message";
import { IWebchatConfig } from "../common/interfaces/webchat-config";
import MessageRendererComponent from "./MessageRenderer";

export class MessageRenderer {
  static renderMessage(message: IMessage, target: HTMLElement, config?: IWebchatConfig) {
    ReactDOM.render(<MessageRendererComponent message={message} config={config} />, target);
  }
}
