import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { getButtonLabel } from '../../MessengerButton/lib/messengerButtonHelpers';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../../common/interfaces/message-plugin';
import { getMessengerContent } from '../../MessengerContent';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';

interface IMessengerListTemplateElementProps extends IWithFBMActionEventHandler {
    element: IFBMListTemplateElement;
}

export const getMessengerListTemplateElement = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const MessengerContent = getMessengerContent({ React, styled });

    const Root = styled(MessengerContent)(({ theme }) => ({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridColumnGap: theme.unitSize,
        backgroundColor: 'white',
        cursor: 'pointer'
    }));

    const Image = styled.div<{ url: string }>(({ theme }) => ({
        width: theme.blockSize,
        height: theme.blockSize,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        borderRadius: theme.unitSize
    }));

    const Button = styled.button(({ theme }) => ({
        backgroundColor: 'transparent',
        borderRadius: theme.unitSize,
        padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
        marginTop: theme.unitSize,
        color: theme.primaryColor,
        border: `1px solid ${theme.primaryColor}`,
        cursor: 'pointer',
        outline: 'none',

        '&:hover': {
            backgroundColor: 'hsl(0, 0%, 97%)'
        },

        '&:active': {
            backgroundColor: 'hsl(0, 0%, 92%)'
        }
    }));

    const MessengerListTemplateElement = ({ element, onAction }: IMessengerListTemplateElementProps) => {
        const { title, subtitle, image_url, buttons, default_action } = element;
        // TODO default_action

        const button = buttons && buttons[0];

        const imgStyle: React.CSSProperties = {
            backgroundImage: `url('${image_url}')`
        }

        return (
            <Root
                onClick={default_action && (e => onAction(e, default_action))}
            >
                <div>
                    <MessengerTitle>{title}</MessengerTitle>
                    <MessengerSubtitle>{subtitle}</MessengerSubtitle>
                    {button && (
                        <Button
                            onClick={e => onAction(e, button)}
                        >
                            {getButtonLabel(button)}
                        </Button>
                    )}
                </div>
                {image_url && (
                    <Image url={image_url} style={imgStyle} />
                )}
            </Root>
        )
    };

    return MessengerListTemplateElement;
}