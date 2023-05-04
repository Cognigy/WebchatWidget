import { sanitizeUrl } from '@braintree/sanitize-url';
import React, { memo } from 'react';
import { IUploadFileMetaData } from '../../common/interfaces/file-upload';
import { MessageComponentProps } from '../../common/interfaces/message-plugin';
import { styled } from '../../webchat-ui/style';
import { getMessengerListTemplate } from '../messenger/MessengerPreview/components/MessengerListTemplate/MessengerListTemplate';
import { IFBMURLButton } from '../messenger/MessengerPreview/interfaces/Button.interface';
import { IFBMListTemplateElement, IFBMListTemplatePayload } from '../messenger/MessengerPreview/interfaces/ListTemplatePayload.interface';

const MessengerListTemplate = getMessengerListTemplate({ React, styled });
const AttachmentsMessage = (props: MessageComponentProps) => {
	const { message, config, color, onEmitAnalytics } = props
	const attachments = message.attachments as IUploadFileMetaData[];

	const payloadElements: IFBMListTemplateElement[] = [];

	if (message.text) {
		payloadElements.push({
			title: message.text,
			subtitle: "",
			image_url: "",
			buttons: []
		})
	}

	attachments.map(item => {
		const isImage = item?.url && item?.mimeType?.startsWith("image/");

		payloadElements.push({
			title: "",
			subtitle: item?.fileName || "",
			image_url: isImage ? item?.url : "",
			buttons: [{
				type: "web_url",
				url: item?.url,
				title: "Open",
				target: "_blank",
			}]
		})
	})

	const payload: IFBMListTemplatePayload = {
		template_type: "list",
		buttons: [],
		top_element_style: "compact",
		elements: payloadElements,
	}

	const onAction = (e, action) => {
		onEmitAnalytics('action', action);
		if (action.type === 'web_url' && action.url) {
			const url = (() => {
				const { url: buttonUrl } = action as IFBMURLButton;
				if (config.settings.disableUrlButtonSanitization)
					return buttonUrl;

				return sanitizeUrl(buttonUrl)
			})();

			// prevent no-ops from sending you to a blank page
			if (url === 'about:blank')
				return;

			const target = (action as IFBMURLButton).target === "_self" ? "_self" : "_blank";

			window.open(url, target);
		}
	};

	return (
		<MessengerListTemplate
			payload={payload}
			onAction={onAction}
			config={config}
			messageColor={color}
		/>
	);
};

export default memo(AttachmentsMessage);