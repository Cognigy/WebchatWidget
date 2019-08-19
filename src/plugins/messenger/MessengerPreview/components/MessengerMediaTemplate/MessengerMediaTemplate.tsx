import ReactPlayer from 'react-player';
import { getMessengerFrame } from '../MessengerFrame';
import { IFBMMediaTemplatePayload, IFBMMediaTemplateUrlElement } from '../../interfaces/MediaTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { IWebchatConfig } from '@cognigy/webchat-client/lib/interfaces/webchat-config';
import { getFlexImage } from '../FlexImage';

interface IProps extends IWithFBMActionEventHandler {
    payload: IFBMMediaTemplatePayload;
    config: IWebchatConfig;
}

export const getMessengerMediaTemplate = ({ React, styled }: MessagePluginFactoryProps) => {

    const MessengerFrame = getMessengerFrame({ React, styled });
    const FlexImage = getFlexImage({ React, styled });

    const FourThirds = styled.div({
        paddingTop: '75%'
    });

    const FixedImage = styled(FourThirds)(() => ({
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
    }));

    const Video = styled(FourThirds)({
        position: 'relative'
    })

    const VideoPlayer = styled(ReactPlayer)({
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: 'black'
    })

    const MessengerMediaTemplate = ({ payload, onAction, config, ...divProps }: IProps & React.HTMLProps<HTMLDivElement>) => {
        const { elements } = payload;
        const element = elements && elements[0];

        if (!element)
            return null;

        const { media_type, url } = element as IFBMMediaTemplateUrlElement;
        // TODO add buttons

        if (media_type === 'image') {
            const image = config.settings.dynamicImageAspectRatio
                    ? <FlexImage src={url} />
                    : <FixedImage style={{ backgroundImage: `url("${encodeURI(url)}")` }} />

            return (
                <MessengerFrame {...divProps}>
                    {image}
                </MessengerFrame>
            )
        }

        if (media_type === 'video') {
            return (
                <MessengerFrame {...divProps}>
                    <Video>
                        <VideoPlayer
                            url={url}
                            controls
                            width="100%"
                            height="100%"
                        />
                    </Video>
                </MessengerFrame>
            )
        }

        if (media_type === 'audio') {
            return (
                <MessengerFrame {...divProps}>
                    <ReactPlayer
                        url={url}
                        controls
                        width="100%"
                        height="50px"
                    />
                </MessengerFrame>
            )
        }

        return null;
    }

    return MessengerMediaTemplate;
}