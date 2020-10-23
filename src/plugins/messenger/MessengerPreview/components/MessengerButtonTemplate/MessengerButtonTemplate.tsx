import { IFBMButtonTemplatePayload } from '../../interfaces/ButtonTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerFrame } from '../MessengerFrame';
import { getMessengerButtonTop } from '../MessengerButtonTop';

interface IMessengerButtonTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMButtonTemplatePayload;
}

export const getMessengerButtonTemplate = ({
    React,
    styled
}: MessagePluginFactoryProps) => {
    const MessengerButtonTop = getMessengerButtonTop({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const Text = styled.div(({ theme }) => ({
        padding: `${theme.unitSize * 2}px ${theme.unitSize * 3}px`,
        whiteSpace: "pre-line"
    }));

    const MessengerButtonTemplate = ({
        payload,
        onAction,
        ...divProps
    }: IMessengerButtonTemplateProps & React.HTMLProps<HTMLDivElement>) => {
        const { text, buttons } = payload;

        const processedText = text.replace('\n', '<br>');

        return (
            <MessengerButtonTop {...divProps} className="webchat-buttons-template-root">
                {processedText && <Text className="webchat-buttons-template-header" dangerouslySetInnerHTML={{__html: processedText}} />}
                {buttons.map((button, index) => (
                    <React.Fragment key={index}>
                        <Divider />
                        <MessengerButton
                            button={button}
                            onClick={e => onAction(e, button)}
                            className="webchat-buttons-template-button"
                        />
                    </React.Fragment>
                ))}
            </MessengerButtonTop>
        );
    };

    return MessengerButtonTemplate;
};
