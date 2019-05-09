import { IFBMListTemplatePayload } from '../../interfaces/ListTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerListTemplateElement } from './components/MessengerListTemplateElement';
import { getMessengerFrame } from '../MessengerFrame';
import { getMessengerListTemplateHeaderElement } from './components/MessengerListTemplateHeaderElement';

export interface IMessengerListTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMListTemplatePayload;
}

export const getMessengerListTemplate = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerListTemplateHeaderElement = getMessengerListTemplateHeaderElement({ React, styled });
    const MessengerFrame = getMessengerFrame({ React, styled });
    const MessengerListTemplateElement = getMessengerListTemplateElement({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const MessengerListTemplate = ({ payload, onAction, ...divProps }: IMessengerListTemplateProps & React.HTMLProps<HTMLDivElement>) => {
        const { elements, top_element_style, buttons } = payload;

        const regularElements = top_element_style === 'large'
            ? elements.slice(1)
            : elements

        const headerElement = top_element_style === 'large'
            ? elements[0]
            : null;

        const button = buttons && buttons[0];

        return (
            <MessengerFrame {...divProps}>
                {headerElement && (
                    <MessengerListTemplateHeaderElement
                        element={headerElement}
                        onAction={onAction}
                    />
                )}
                {regularElements.map((element, index) => (
                    <React.Fragment
                        key={index}
                    >
                        {index !== 0 && (
                            <Divider />
                        )}
                        <MessengerListTemplateElement
                            element={element}
                            onAction={onAction}
                        />
                    </React.Fragment>
                ))}
                {button && (
                    <>
                        <Divider />
                        <MessengerButton
                            button={button}
                            onClick={e => onAction(e, button)}
                        />
                    </>
                )}
            </MessengerFrame>
        )
    };

    return MessengerListTemplate;
}