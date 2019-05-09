import { IFBMButtonTemplatePayload } from '../../interfaces/ButtonTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerFrame } from '../MessengerFrame';

interface IMessengerButtonTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMButtonTemplatePayload
}

export const getMessengerButtonTemplate = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerFrame = getMessengerFrame({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const Text = styled.div(({ theme }) => ({
        padding: theme.unitSize
    }));

    const MessengerButtonTemplate = ({ payload, onAction, ...divProps }: IMessengerButtonTemplateProps & React.HTMLProps<HTMLDivElement>) => {
        const { text, buttons } = payload;

        return (
            <MessengerFrame {...divProps}>
                {text && (
                    <Text>
                        {text}
                    </Text>
                )}
                {buttons.map((button, index) => (
                    <React.Fragment
                        key={index}
                    >
                        <Divider />
                        <MessengerButton
                            button={button}
                            onClick={e => onAction(e, button)}
                        />
                    </React.Fragment>
                ))}
            </MessengerFrame>
        )
    }

    return MessengerButtonTemplate;
}