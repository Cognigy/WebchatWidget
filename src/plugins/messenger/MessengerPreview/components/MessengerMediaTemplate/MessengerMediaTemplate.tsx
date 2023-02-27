import ReactPlayer from 'react-player';
import { getMessengerFrame } from '../MessengerFrame';
import {
    IFBMMediaTemplatePayload,
    IFBMMediaTemplateUrlElement
} from '../../interfaces/MediaTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getDivider } from '../Divider';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerImage } from '../MessengerImage/MessengerImage';
import { IWebchatConfig } from '../../../../../common/interfaces/webchat-config';
import { useRandomId } from '../../../../../common/utils/randomId';
import "../../../../../assets/style.css";

interface IProps extends IWithFBMActionEventHandler {
    payload: IFBMMediaTemplatePayload;
    config: IWebchatConfig;
}

export const getMessengerMediaTemplate = ({
    React,
    styled
}: MessagePluginFactoryProps) => {
    const MessengerFrame = getMessengerFrame({ React, styled });
    const MessengerImage = getMessengerImage({ React, styled });

    const Video = styled.div({
        paddingTop: "75%",
        position: "relative",
    });

    const VideoPlayer = styled(ReactPlayer)({
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "black",
        borderRadius: "16px",
    });

    const MessengerMediaTemplate = ({
        payload,
        onAction,
        config,
        ...divProps
    }: IProps & React.HTMLProps<HTMLDivElement>) => {
        const { elements } = payload;
        const element = elements && elements[0];

        const { media_type, url, altText, buttons } = element as IFBMMediaTemplateUrlElement;

        const isDownloadableImage = buttons.find(b => b.type === 'web_url') !== undefined && media_type === "image";

        const hasMoreThanOnebutton = buttons && buttons.length > 1;
        const hasNobuttons = !buttons || buttons?.length < 1;

        const webchatButtonTemplateButtonId = useRandomId("webchatButtonTemplateButton");
        const a11yProps = hasMoreThanOnebutton ? {role: "group", "aria-label": altText} : {};

        const MessengerButton = getMessengerButton({ React, styled });
        const Divider = getDivider({ React, styled });

        if (!element) return null;

        const handleFocus = (player: ReactPlayer) => {
            const chatHistory = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");

            if(!config?.settings.enableAutoFocus) return;

            if(!chatHistory?.contains(document.activeElement)) return;

            setTimeout(() => {
                player.getInternalPlayer()?.focus()
            }, 100);
        }

        const imageButtons = () => {
            if(hasNobuttons) return null;
            
            return(
                <div {...a11yProps}>
                    {buttons.map((button, index) => (
                        <React.Fragment key={index}>
                            <Divider />
                            <MessengerButton
                                button={button}
                                onClick={e => onAction(e, button)}
                                className="webchat-buttons-template-button"
                                config={config}
                                id={`${webchatButtonTemplateButtonId}-${index}`}
                                position={index + 1}
                                total={buttons.length}
                            />
                        </React.Fragment>
                    ))}
                </div>
            )
        }

        if (media_type === "image") {
            return (
                <MessengerFrame {...divProps} className="webchat-media-template-image">
                    <MessengerImage url={url} config={config} altText={altText} isDownloadable={isDownloadableImage} />
                    {imageButtons()}
                </MessengerFrame>
            );
        }

        if (media_type === "video") {
            return (
                <MessengerFrame {...divProps} className="webchat-media-template-video" style={{ overflow: "visible" }}>
                    <Video>
                        <span className="sr-only">{altText || "Attachment Video"}</span>
                        <VideoPlayer url={url} controls width="100%" height="100%" onReady={handleFocus} />
                    </Video>
                </MessengerFrame>
            );
        }

        if (media_type === "audio") {
            return (
                <MessengerFrame {...divProps} className="webchat-media-template-audio" style={{ overflow: "visible" }}>
                    <span className="sr-only">{altText || "Attachment Audio"}</span>
                    <ReactPlayer url={url} controls width="100%" height="50px" onReady={handleFocus} />
                </MessengerFrame>
            );
        }

        return null;
    };

    return MessengerMediaTemplate;
};
