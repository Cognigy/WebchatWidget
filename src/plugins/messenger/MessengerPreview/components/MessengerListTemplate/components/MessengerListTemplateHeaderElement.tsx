import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';
import { getMessengerImage } from '../../MessengerImage/MessengerImage';
import { getMessengerListButton } from '../../MessengerListButton';
import { getButtonLabel } from '../../MessengerButton/lib/messengerButtonHelpers';
import { IWebchatConfig } from '../../../../../../common/interfaces/webchat-config';
import { useRandomId } from '../../../../../../common/utils/randomId';
import { sanitizeHTML } from '../../../../../../webchat/helper/sanitize';
import { IWithMessageColor } from '../../../interfaces/MessageColor.interface';

interface IMessengerListTemplateHeaderElementProps extends IWithFBMActionEventHandler, IWithMessageColor {
    element: IFBMListTemplateElement;
    config: IWebchatConfig;
}

export const getMessengerListTemplateHeaderElement = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const ListButton = getMessengerListButton({ React, styled });
    const MessengerImage = getMessengerImage({ React, styled });

    const Root = styled.div(() => ({
        position: 'relative',
        "&:focus":{
            opacity: 0.85,
        }
    }));

    const DarkLayer = styled.div({
        display: 'block',
        content: '" "',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'hsla(0, 0%, 0%, .6)'
    });

    const Content = styled.div({
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        padding: 10,
    });

    const Title = styled(MessengerTitle)({
        color: 'hsla(0, 0%, 100%, .9)'
    });

    const Subtitle = styled(MessengerSubtitle)({
        color: 'hsla(0, 0%, 100%, .9)'
    });

    const ListHeaderButton = styled(ListButton)<IWithMessageColor>(({ theme, messageColor }) => ({
        backgroundColor: messageColor === 'neutral' ? theme.greyColor : theme.primaryColor,
        color: messageColor === 'neutral' ? theme.greyContrastColor :  theme.primaryContrastColor,
        border: `none`,
        cursor: 'pointer',
        outline: 'none',

        '&:hover': {
            backgroundColor: messageColor === 'neutral' ? theme.greyWeakColor : theme.primaryWeakColor
		},
		
		'&:focus': {
			backgroundColor: messageColor === 'neutral' ? theme.greyStrongColor : theme.primaryStrongColor,
        },

        '&:active': {
            backgroundColor: messageColor === 'neutral' ? theme.greyStrongColor :  theme.primaryStrongColor
        }
    }))

    const MessengerListTemplateHeaderElement = ({ element, onAction, config, messageColor }: IMessengerListTemplateHeaderElementProps) => {
        const { title, subtitle, image_url, image_alt_text, default_action, buttons } = element;
        // TODO buttons, default_action

        const button = buttons && buttons[0];
        const messengerTitle = title ? title + ". " : "";
        const ariaLabelForMessengerTitle = default_action?.url ? messengerTitle + "Opens in new tab" : title;
        const messengerSubtitleId = useRandomId("webchatListTemplateHeaderSubtitle"); 

        const handleKeyDown = (event, default_action) => {
            if(default_action && event.key === "Enter") {
                onAction(event, default_action);
            }
        }

        const isSanitizeEnabled = !config.settings.disableHtmlContentSanitization;

        const titleHtml = isSanitizeEnabled ? sanitizeHTML(title) : title;
        const subtitleHtml = isSanitizeEnabled ? sanitizeHTML(subtitle) : subtitle;
        const buttonHtml = !!button && (isSanitizeEnabled ? sanitizeHTML(getButtonLabel(button)) : getButtonLabel(button));

        return (
            <div role="listitem">
                <Root
                    onClick={default_action && (e => onAction(e, default_action))}
                    className="webchat-list-template-header"
                    role={default_action?.url ? "link" : undefined}
                    aria-label={ariaLabelForMessengerTitle}
                    aria-describedby={subtitle ? messengerSubtitleId : undefined}
                    tabIndex={default_action?.url ? 0 : -1}
                    onKeyDown = {e => handleKeyDown(e, default_action)}
                    style={default_action?.url ? { cursor: "pointer" }:{}}
                >
                    <MessengerImage url={image_url} config={config} altText={image_alt_text} template="list" />
                    <DarkLayer />
                    <Content className="webchat-list-template-header-content">
                        <Title className="webchat-list-template-header-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
                        <Subtitle className="webchat-list-template-header-subtitle" dangerouslySetInnerHTML={{ __html: subtitleHtml }} config={config} id={messengerSubtitleId}/>
                        {button && (
                            <ListHeaderButton
                                onClick={e => {e.stopPropagation(); onAction(e, button)}}
                                className="webchat-list-template-header-button"
                                dangerouslySetInnerHTML={{ __html: buttonHtml }}
                                messageColor={messageColor}
                            >
                            </ListHeaderButton>
                        )}
                    </Content>
                </Root>
            </div>
        )
    };

    return MessengerListTemplateHeaderElement;
}