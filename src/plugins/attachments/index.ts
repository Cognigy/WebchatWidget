import { MessagePlugin } from "../../common/interfaces/message-plugin";
import { registerMessagePlugin } from "../helper";
import AttachmentsMessage from "./AttachmentsMessage";

const AttachmentsMessagePlugin: MessagePlugin = {
	match: (message) => message.data?.attachments?.length > 0,
	component: AttachmentsMessage,
};

registerMessagePlugin(AttachmentsMessagePlugin);

export default AttachmentsMessagePlugin;