import { MessagePlugin } from "../../common/interfaces/message-plugin";
import { registerMessagePlugin } from "../helper";
import FilesMessage from "./FilesMessage";

const filesMessagePlugin: MessagePlugin = {
  match: (message) => message.data?.attachments?.length > 0,
  component: FilesMessage,
};

registerMessagePlugin(filesMessagePlugin);

export default filesMessagePlugin;