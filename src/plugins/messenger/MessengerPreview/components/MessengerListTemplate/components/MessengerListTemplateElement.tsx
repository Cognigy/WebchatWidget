import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { getButtonLabel } from '../../MessengerButton/lib/messengerButtonHelpers';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';
import { getMessengerContent } from '../../MessengerContent';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';
import { getMessengerListButton } from '../../MessengerListButton';
import { getBackgroundImage } from '../../../lib/css';

interface IMessengerListTemplateElementProps extends IWithFBMActionEventHandler {
    element: IFBMListTemplateElement;
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
    }));

    const Image = styled.div(({ theme }) => ({
        width: theme.blockSize,
        height: theme.blockSize,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        borderRadius: theme.unitSize
    }));


    const MessengerListTemplateElement = ({ element, onAction }: IMessengerListTemplateElementProps) => {
        const { title, subtitle, image_url, buttons, default_action } = element;
        // TODO default_action

        const button = buttons && buttons[0];

        const imgStyle: React.CSSProperties = {
            backgroundImage: getBackgroundImage(image_url)
        }

        return (
            <Root
                onClick={default_action && (e => onAction(e, default_action))}
                className="webchat-list-template-element"
                style={default_action ? { cursor: "pointer" }:{}}
            >
                <div>
                    <MessengerTitle className="webchat-list-template-element-title" dangerouslySetInnerHTML={{__html: title}} />
                    <MessengerSubtitle className="webchat-list-template-element-subtitle" dangerouslySetInnerHTML={{__html: subtitle}} />
                    {button && (
                        <ListButton
                            onClick={e => {e.stopPropagation(); onAction(e, button)}}
                            className="webchat-list-template-element-button"
                            dangerouslySetInnerHTML={{__html: getButtonLabel(button)}}
                        />
                    )}
                </div>
                {image_url && (
                    <Image style={imgStyle} />
                )}
            </Root>
        )
    };

    return MessengerListTemplateElement;
}