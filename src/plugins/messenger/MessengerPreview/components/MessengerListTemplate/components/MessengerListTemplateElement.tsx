import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { getButtonLabel } from '../../MessengerButton/lib/messengerButtonHelpers';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';
import { getMessengerContent } from '../../MessengerContent';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';
import { getMessengerListButton } from '../../MessengerListButton';
import { getBackgroundImage } from '../../../lib/css';
import { IWebchatConfig } from '../../../../../../common/interfaces/webchat-config';
import uuid from "uuid";

interface IMessengerListTemplateElementProps extends IWithFBMActionEventHandler {
    element: IFBMListTemplateElement;
    config: IWebchatConfig;
}

export const getMessengerListTemplateElement = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const MessengerContent = getMessengerContent({ React, styled });
    const ListButton = getMessengerListButton({ React, styled });

    const Root = styled(MessengerContent)(({ theme }) => ({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridColumnGap: theme.unitSize,
        backgroundColor: 'white',
        "&:focus": {
            outline: 'none',
            backgroundColor: 'hsl(0, 0%, 92%)'
        }
    }));

    const Image = styled.div(({ theme }) => ({
        width: theme.blockSize,
        height: theme.blockSize,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        borderRadius: theme.unitSize
    }));


    const MessengerListTemplateElement = ({ element, onAction, config }: IMessengerListTemplateElementProps) => {
        const { title, subtitle, image_url, image_alt_text,  buttons, default_action } = element;
        // TODO default_action

        const button = buttons && buttons[0];

        const imgStyle: React.CSSProperties = {
            backgroundImage: getBackgroundImage(image_url)
        }
        const messengerSubtitleId = `webchatListTemplateSubtitle-${uuid.v4()}`;
        const messengerTitle = title ? title + ". " : "";
        const messengerAriaLabel  = default_action?.url ? messengerTitle + "Opens in new tab" : title;

        const handleKeyDown = (event, default_action) => {
            if(event.key === "Enter" && default_action) {
                onAction(event, default_action);
            }
        }

        return (
            <div role="listitem">
                <Root
                    role={default_action?.url ? "link" : undefined} 
                    onClick={default_action && (e => onAction(e, default_action))}
                    className="webchat-list-template-element"
                    style={default_action?.url ? { cursor: "pointer" }:{}}
                    aria-label={messengerAriaLabel} 
                    aria-describedby={subtitle ? messengerSubtitleId : undefined}
                    tabIndex={default_action?.url ? 0 : -1}
                    onKeyDown = {e => handleKeyDown(e, default_action)}
                >
                    <div>
                        <MessengerTitle className="webchat-list-template-element-title" dangerouslySetInnerHTML={{__html: title}} />
                        <MessengerSubtitle className="webchat-list-template-element-subtitle" dangerouslySetInnerHTML={{__html: subtitle}} config={config} id={messengerSubtitleId} />
                        {button && (
                            <ListButton
                                onClick={e => {e.stopPropagation(); onAction(e, button)}}
                                className="webchat-list-template-element-button"
                                dangerouslySetInnerHTML={{__html: getButtonLabel(button)}}
                            />
                        )}
                    </div>
                    {image_url && (
                        <Image style={imgStyle}>
                            <span role="img" aria-label={image_alt_text || "List Image"}> </span>
                        </Image>
                    )}
                </Root>
            </div>
        )
    };

    return MessengerListTemplateElement;
}