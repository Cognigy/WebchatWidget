import * as React from "react";
import * as ReactDOM from "react-dom";

export class MessageRenderer {
  static renderMessage(message: unknown, target: HTMLElement) {
    target.innerText = JSON.stringify(message);
    ReactDOM.render(
      <span style={{ color: "red" }}>{JSON.stringify(message)}</span>,
      target
    );
  }
}
