import styled from '@emotion/styled';
import React from 'react';
import { IUploadFileMetaData } from '../../common/interfaces/file-upload';
import { MessageComponentProps } from '../../common/interfaces/message-plugin';
import { RegularMessage } from '../../webchat-ui/components/plugins/message/regular';
import { getMessengerListTemplate } from '../messenger/MessengerPreview/components/MessengerListTemplate/MessengerListTemplate';
import { IFBMListTemplateElement, IFBMListTemplatePayload } from '../messenger/MessengerPreview/interfaces/ListTemplatePayload.interface';

const MessengerListTemplate = getMessengerListTemplate({ React, styled });
const AttachmentsMessage = (props: MessageComponentProps) => {
	const { message, config, color } = props
	const attachments = message.data.attachments as IUploadFileMetaData[];

	const payloadElements = attachments.map(item => {
		const isImage = item?.url && item?.mimeType?.startsWith("image/");

		console.log(item)

		return {
			title: item?.fileName || "",
			subtitle: "",
			image_url: isImage ? item?.url : "",
			buttons: [{
				type: "web_url",
				url: item?.url,
				title: "Open",
				target: "_blank",
			}]
		} as IFBMListTemplateElement
	})

	const payload: IFBMListTemplatePayload = {
		template_type: "list",
		buttons: [],
		top_element_style: "compact",
		elements: payloadElements,
	}
	const onAction = (e => {
		e.stopPropagation();
	});

	return (
		<div style={{ display: "block" }}>
			<RegularMessage
				{...props}
			/>
			<MessengerListTemplate
				payload={payload}
				onAction={onAction}
				config={config}
				messageColor={color}
			/>
		</div>
	);
};

export default AttachmentsMessage;