export class MessageRenderer {
  static renderMessage(message: unknown, target: HTMLElement) {
    target.innerText = JSON.stringify(message);
  }
}
