import { IFBMRegularMessage } from '../../interfaces/Message.interface';
import {
    IFBMTextQuickReply,
    IFBMQuickReply
} from '../../interfaces/QuickReply.interface';
import { getMessengerQuickReply } from '../MessengerQuickReply';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerBubble } from '../MessengerBubble';
import uuid from "uuid";
import { useEffect } from 'react';

interface Props extends IWithFBMActionEventHandler {
    message: IFBMRegularMessage;
}

export const getMessengerTextWithQuickReplies = ({
    React,
    styled
}: MessagePluginFactoryProps) => {
    const MessengerQuickReply = getMessengerQuickReply({ React, styled });
    const MessengerBubble = getMessengerBubble({ React, styled });

    const BorderBubble = styled(MessengerBubble)(({ theme }) => ({
        border: `1px solid ${theme.greyColor}`
    }));

    const QuickReplies = styled.div({
        textAlign: "center",

        margin: -5,
        marginTop: 3,
        flexWrap: "wrap",

        "&>*": {
            margin: 5
        }
    });

    const QuickReplyImage = styled.img(({ theme }) => ({
        width: theme.unitSize * 3,
        height: theme.unitSize * 3,
        marginRight: theme.unitSize
    }));

    const MessengerTextWithQuickReplies = ({
        message,
        onAction,
        ...divProps
    }: Props & React.HTMLProps<HTMLDivElement>) => {
        const { text, quick_replies } = message;

        const hasQuickReplies = quick_replies && quick_replies.length > 0;
        const hasMoreThanOneQuickReply = quick_replies && quick_replies.length > 1;
        const webchatQuickReplyTemplateButtonId = `webchatQuickReplyTemplateButton-${uuid.v4()}`;
        const webchatQuickReplyTemplateHeaderId = `webchatQuickReplyTemplateHeader-${uuid.v4()}`;
        const buttonGroupAriaLabelledby = text ? webchatQuickReplyTemplateHeaderId : undefined;
        const a11yProps = hasMoreThanOneQuickReply ? 
            {role: "group", "aria-labelledby": buttonGroupAriaLabelledby } : {};

        // TODO add click behaviour

        useEffect(() => {
            const quickReplyButton = document.getElementById(`${webchatQuickReplyTemplateButtonId}-0`);
            setTimeout(() => {quickReplyButton?.focus()}, 200);
        }, []);

        return (
            <div {...divProps} className="webchat-quick-reply-template-root">
                <BorderBubble
                    className="webchat-quick-reply-template-header-message"
                    dangerouslySetInnerHTML={{ __html: text }}
                    id={webchatQuickReplyTemplateHeaderId}
                ></BorderBubble>

                {hasQuickReplies && (
                    <QuickReplies className="webchat-quick-reply-template-replies-container" {...a11yProps}>
                        {(quick_replies as IFBMQuickReply[]).map((quickReply, index) => {
                            const { content_type } = quickReply;
                            let label: string = "";
                            let image: React.ReactNode;

                            switch (content_type) {
                                case "location": {
                                    label = "Send Location";
                                    break;
                                }

                                case "text": {
                                    const { title, image_url, image_alt_text } = quickReply as IFBMTextQuickReply;
                                    label = title;
                                    if (image_url) image = <QuickReplyImage src={image_url} alt={image_alt_text || ""}/>;
                                    break;
                                }

                                case "user_email": {
                                    label = "Send Email-Address";
                                    break;
                                }

                                case "user_phone_number": {
                                    label = "Send Phone Number";
                                    break;
                                }
                            }

                            return (
                                <MessengerQuickReply
                                    key={index}
                                    onClick={e => onAction(e, quickReply)}
                                    className="webchat-quick-reply-template-reply"
                                    id={`${webchatQuickReplyTemplateButtonId}-${index}`}
                                >
                                    {image}
                                    <span dangerouslySetInnerHTML={{ __html: label }} />
                                </MessengerQuickReply>
                            );
                        })}
                    </QuickReplies>
                )}
            </div>
        );
    };

    return MessengerTextWithQuickReplies;
};
