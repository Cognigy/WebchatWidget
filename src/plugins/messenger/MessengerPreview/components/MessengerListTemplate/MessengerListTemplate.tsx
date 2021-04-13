import { IFBMListTemplatePayload } from '../../interfaces/ListTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerListTemplateElement } from './components/MessengerListTemplateElement';
import { getMessengerFrame } from '../MessengerFrame';
import { getMessengerListTemplateHeaderElement } from './components/MessengerListTemplateHeaderElement';
import { IWebchatConfig } from '../../../../../common/interfaces/webchat-config';
import { useEffect } from 'react';
import uuid from 'uuid';

export interface IMessengerListTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMListTemplatePayload;
    config: IWebchatConfig;
}

export const getMessengerListTemplate = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerListTemplateHeaderElement = getMessengerListTemplateHeaderElement({ React, styled });
    const MessengerFrame = getMessengerFrame({ React, styled });
    const MessengerListTemplateElement = getMessengerListTemplateElement({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const MessengerListTemplate = ({ payload, onAction, config, ...divProps }: IMessengerListTemplateProps & React.HTMLProps<HTMLDivElement>) => {
        const { elements, top_element_style, buttons } = payload;

        // We support the "large" string to maintain compatibility with old format
        const showTopElementLarge = (top_element_style === "large" || top_element_style === true);

        const regularElements = showTopElementLarge
            ? elements.slice(1)
            : elements

        const headerElement = showTopElementLarge
            ? elements[0]
            : null;

        const button = buttons && buttons[0];
        const listTemplateId = `webchatListTemplateRoot-${uuid.v4()}`;

        useEffect(() => {
            const chatHistory = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");

            if(!config?.settings.enableAutoFocus) return;

            if(!chatHistory?.contains(document.activeElement)) return;

            const listTemplateRoot = document.getElementById(listTemplateId);
            // get the first focusable element within the list and add focus
            const focusable = listTemplateRoot?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
            const firstFocusable = focusable && focusable[0] as HTMLElement;
            setTimeout(() => { firstFocusable?.focus(); }, 200);
        }, [config]);

        return (
            <MessengerFrame {...divProps} className="webchat-list-template-root" role="list" id={listTemplateId}>
                {headerElement && (
                    <MessengerListTemplateHeaderElement
                        element={headerElement}
                        onAction={onAction}
                        config={config}
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
                            config={config}
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