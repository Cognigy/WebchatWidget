import { IFBMButtonTemplatePayload } from '../../interfaces/ButtonTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerButtonHeader } from '../MessengerButtonHeader';
import { useEffect } from 'react';
import {IWebchatConfig} from '../../../../../common/interfaces/webchat-config';
import { useRandomId } from '../../../../../common/utils/randomId';
import { sanitizeHTML } from '../../../../../webchat/helper/sanitize';

interface IMessengerButtonTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMButtonTemplatePayload;
    config: IWebchatConfig;
}

export const getMessengerButtonTemplate = ({
    React,
    styled
}: MessagePluginFactoryProps) => {
    const MessengerButtonHeader = getMessengerButtonHeader({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const Text = styled.div(({ theme }) => ({
        padding: `${theme.unitSize * 2}px ${theme.unitSize * 3}px`,
        whiteSpace: "pre-line"
    }));

    const MessengerButtonTemplate = ({
        payload,
        onAction,
        config,
        ...divProps
    }: IMessengerButtonTemplateProps & React.HTMLProps<HTMLDivElement>) => {
        const { text, buttons } = payload;
        const webchatButtonTemplateButtonId = useRandomId("webchatButtonTemplateButton");
        const webchatButtonTemplateTextId = useRandomId("webchatButtonTemplateHeader");
        const buttonGroupAriaLabelledby = text ? webchatButtonTemplateTextId : undefined;
        const a11yProps = buttons?.length > 1 ? {role: "group", "aria-labelledby": buttonGroupAriaLabelledby} : {};

        useEffect(() => {
            const firstButton = document.getElementById(`${webchatButtonTemplateButtonId}-0`);
            const chatHistory = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");

            if(!config?.settings.enableAutoFocus) return;

            if(!chatHistory?.contains(document.activeElement)) return;

            setTimeout(() => {
                firstButton?.focus();
            }, 200);
        }, []);

        const __html = config.settings.disableHtmlContentSanitization ? text : sanitizeHTML(text);

        return (
            <MessengerButtonHeader {...divProps} className="webchat-buttons-template-root">
                {text && <Text className="webchat-buttons-template-header" dangerouslySetInnerHTML={{ __html }} id={webchatButtonTemplateTextId} />}
                <div {...a11yProps}>
					{buttons.map((button, index) => (
						<React.Fragment key={index}>
							<Divider />
							<MessengerButton
								button={button}
								onClick={e => onAction(e, button)}
								className="webchat-buttons-template-button"
                                config={config}
								id={`${webchatButtonTemplateButtonId}-${index}`}
							/>
						</React.Fragment>
					))}
				</div>
            </MessengerButtonHeader>
        );
    };

    return MessengerButtonTemplate;
};
