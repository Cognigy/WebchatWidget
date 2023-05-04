import { IUploadFileMetaData } from "../../common/interfaces/file-upload";
import { MessagePlugin } from "../../common/interfaces/message-plugin";
import { registerMessagePlugin } from "../helper";
import AttachmentsMessage from "./AttachmentsMessage";

const AttachmentsMessagePlugin: MessagePlugin = {
	match: (message) =>  (message.attachments as IUploadFileMetaData[])?.length > 0,
	component: AttachmentsMessage,
};

registerMessagePlugin(AttachmentsMessagePlugin);

export default AttachmentsMessagePlugin;