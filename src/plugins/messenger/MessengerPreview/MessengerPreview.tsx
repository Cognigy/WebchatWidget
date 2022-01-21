import {
  IFBMMessage,
  IFBMAttachmentMessage,
  IFBMRegularMessage,
} from "./interfaces/Message.interface";
import { IFBMButtonTemplatePayload } from "./interfaces/ButtonTemplatePayload.interface";
import { IFBMGenericTemplatePayload } from "./interfaces/GenericTemplatePayload.interface";
import { IFBMListTemplatePayload } from "./interfaces/ListTemplatePayload.interface";
import { IFBMMediaTemplatePayload } from "./interfaces/MediaTemplatePayload.interface";

import { getMessengerButtonTemplate } from "./components/MessengerButtonTemplate/MessengerButtonTemplate";
import { getMessengerGenericTemplate } from "./components/MessengerGenericTemplate/MessengerGenericTemplate";
import { getMessengerListTemplate } from "./components/MessengerListTemplate/MessengerListTemplate";
import { getMessengerMediaTemplate } from "./components/MessengerMediaTemplate/MessengerMediaTemplate";

import { FBMActionEventHandler } from "./MessengerPreview.interface";
import { MessagePluginFactoryProps } from "../../../common/interfaces/message-plugin";
import { getMessengerTextWithQuickReplies } from "./components/MessengerTextWithQuickReplies/MessengerTextWithQuickReplies";
import { IWebchatConfig } from "../../../common/interfaces/webchat-config";
import { IWithMessageColor } from "./interfaces/MessageColor.interface";
import { IWithMessageDirection } from "./interfaces/MessageDirection.interface";

export interface IMessengerPreviewProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "color">,
    IWithMessageColor,
    IWithMessageDirection {
  /** input.data._cognigy._facebook */
  message: IFBMMessage;
  onAction?: FBMActionEventHandler;
  config: IWebchatConfig;
}

export const getMessengerPreview = ({
  React,
  styled,
}: MessagePluginFactoryProps) => {
  const MessengerButtonTemplate = getMessengerButtonTemplate({ React, styled });
  const MessengerGenericTemplate = getMessengerGenericTemplate({
    React,
    styled,
  });
  const MessengerListTemplate = getMessengerListTemplate({ React, styled });
  const MessengerMediaTemplate = getMessengerMediaTemplate({ React, styled });
  const MessengerTextWithQuickReplies = getMessengerTextWithQuickReplies({
    React,
    styled,
  });

  const MessengerPreview = (props: IMessengerPreviewProps) => {
    const {
      message,
      onAction: handleAction,
      config,
      messageColor,
      messageDirection,
      ...divProps
    } = props;

    const { attachment } = message as IFBMAttachmentMessage;

    // if no action handler is present, use a dummy function
    const onAction =
      props.onAction ||
      ((e) => {
        e.stopPropagation();
      });

    if (attachment) {
      // return text and quick replies

      const { type, payload } = attachment;

      switch (type) {
        case "template": {
          const { template_type } = payload;

          switch (template_type) {
            case "button": {
              return (
                <MessengerButtonTemplate
                  {...divProps}
                  payload={payload as IFBMButtonTemplatePayload}
                  onAction={onAction}
                  config={config}
                  messageColor={messageColor}
                />
              );
            }

            case "generic": {
              return (
                <MessengerGenericTemplate
                  {...(divProps as any)}
                  payload={payload as IFBMGenericTemplatePayload}
                  onAction={onAction}
                  config={config}
                />
              );
            }

            case "list": {
              return (
                <MessengerListTemplate
                  {...divProps}
                  payload={payload as IFBMListTemplatePayload}
                  onAction={onAction}
                  config={config}
                  messageColor={messageColor}
                />
              );
            }

            case "media": {
              return (
                <MessengerMediaTemplate
                  {...divProps}
                  payload={payload as IFBMMediaTemplatePayload}
                  onAction={onAction}
                  config={config}
                />
              );
            }
          }

          break;
        }
      }
    }

    return (
      <MessengerTextWithQuickReplies
        {...divProps}
        message={message as IFBMRegularMessage}
        onAction={onAction}
        config={config}
        messageColor={messageColor}
        messageDirection={messageDirection}
      />
    );
  };

  return MessengerPreview;
};
