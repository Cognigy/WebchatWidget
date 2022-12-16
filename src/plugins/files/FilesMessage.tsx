import styled from '@emotion/styled';
import React from 'react';
import { IUploadFileMetaData } from '../../common/interfaces/file-upload';
import { MessageComponentProps } from '../../common/interfaces/message-plugin';
import { getMessengerMediaTemplate } from '../messenger/MessengerPreview/components/MessengerMediaTemplate/MessengerMediaTemplate';
import { IFBMMediaTemplatePayload } from '../messenger/MessengerPreview/interfaces/MediaTemplatePayload.interface';

//TODO the react component in this file needs to be re-written.
//I just included some design from MessengerPreview plugin

const MessengerMediaTemplate = getMessengerMediaTemplate({ React, styled });
export default ({ message, config }: MessageComponentProps) => {
	//return <div>{JSON.stringify(message.data.attachments)}</div>;

	const attachments = message.data.attachments as IUploadFileMetaData;
	const payload = {
		template_type: 'media',
		elements: [{
			media_type: "image",
			url: attachments[0].url,
			altText: attachments[0].url,
			buttons: [{
				type: 'web_url',
				url: attachments[0].url,
				title: "Download",
				target: '_blank'
			}]
		}]
	}
	const onAction = (e => {
		e.stopPropagation();
	});

	return (
		<MessengerMediaTemplate
			payload={payload as IFBMMediaTemplatePayload}
			onAction={onAction}
			config={config}
		/>
	);
};