import * as React from "react";
import * as ReactDOM from "react-dom";
import { IMessage } from "../common/interfaces/message";
import MessageRendererComponent from "./MessageRenderer";

export class MessageRenderer {
  static renderMessage(message: IMessage, target: HTMLElement) {
    ReactDOM.render(<MessageRendererComponent message={message} />, target);
  }
}
