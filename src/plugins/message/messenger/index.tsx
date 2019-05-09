
import { MessageComponentProps, MessagePluginFactory } from "../../../common/interfaces/message-plugin";
import { getMessengerPreview } from "./MessengerPreview/MessengerPreview";
import { registerMessagePlugin } from '../../helper';
import { transformMessage } from "./MessengerPreview/lib/transform";
import { IFBMGenericTemplatePayload } from "./MessengerPreview/interfaces/GenericTemplatePayload.interface";

const getMessengerPayload = message => {
    const { data } = message;
    if (!data)
        return null;

    const { _cognigy } = data;
    if (!_cognigy)
        return null;

    const { _facebook, _webchat } = _cognigy;

    return _webchat || _facebook;
}

const isMessengerPayload = message => !!getMessengerPayload(message);

// return true if a message is a messenger generic template with more than one element
// one element should be rendered like default
const isFullscreenMessengerGenericPayload = rawMessage => {
    const messengerPayload = getMessengerPayload(rawMessage);

    if (!messengerPayload)
        return false;

    const { message } = messengerPayload;
    if (!message)
        return false;
    
    const { attachment } = message;
    if (!attachment)
        return false;

    const { payload } = attachment;
    if (!payload)
        return false;

    if (payload.template_type !== 'generic')
        return false;

    const { elements } = payload as IFBMGenericTemplatePayload;

    return elements.length > 1;
}

const messengerPlugin: MessagePluginFactory = ({ React, styled }) => {

    const MessengerPreview = getMessengerPreview({ React, styled });

    return ({
        match: isMessengerPayload,
        component: ({ message, onSendMessage, config }: MessageComponentProps) => (
            <MessengerPreview
                message={transformMessage(getMessengerPayload(message).message)}
                onAction={(e, action) => {
                    // @ts-ignore
                    if (action.type === 'postback' || action.content_type === 'text') {
                        // @ts-ignore
                        const { payload, title } = action;

                        onSendMessage(payload, null, { label: title });
                    }

                    // @ts-ignore
                    if (action.type === 'web_url') {
                        // @ts-ignore
                        window.open(action.url, '_blank');
                    }
                }}
                config={config}
            />
        )
    })
}


const fullscreenMessengerGenericPlugin: MessagePluginFactory = ({ React, styled }) => {

    const MessengerPreview = getMessengerPreview({ React, styled });

    return ({
        match: isFullscreenMessengerGenericPayload,
        component: ({ message, onSendMessage, config }: MessageComponentProps) => (
            <MessengerPreview
                message={transformMessage(getMessengerPayload(message).message)}
                onAction={(e, action) => {
                    // @ts-ignore
                    if (action.type === 'postback' || action.content_type === 'text') {
                        // @ts-ignore
                        const { payload, title } = action;

                        onSendMessage(payload, null, { label: title });
                    }

                    // @ts-ignore
                    if (action.type === 'web_url') {
                        // @ts-ignore
                        window.open(action.url, '_blank');
                    }
                }}
                config={config}
            />
        ),
        options: {
            fullwidth: true
        }
    })
}

registerMessagePlugin(fullscreenMessengerGenericPlugin);
registerMessagePlugin(messengerPlugin);

// export default messengerPlugin;
