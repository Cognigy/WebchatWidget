import ReactPlayer from 'react-player';
import { getMessengerFrame } from '../MessengerFrame';
import { IFBMMediaTemplatePayload, IFBMMediaTemplateUrlElement } from '../../interfaces/MediaTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';

interface IProps extends IWithFBMActionEventHandler {
    payload: IFBMMediaTemplatePayload;
}

export const getMessengerMediaTemplate = ({ React, styled }: MessagePluginFactoryProps) => {

    const MessengerFrame = getMessengerFrame({ React, styled });

    const FourThirds = styled.div({
        paddingTop: '75%'
    });

    const Image = styled(FourThirds)<{ url: string }>(({ url }) => ({
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundImage: `url('${url}')`
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

    const MessengerMediaTemplate = ({ payload, onAction, ...divProps }: IProps & React.HTMLProps<HTMLDivElement>) => {
        const { elements } = payload;
        const element = elements && elements[0];

        if (!element)
            return null;

        const { media_type, url } = element as IFBMMediaTemplateUrlElement;
        // TODO add buttons

        if (media_type === 'image') {
            return (
                <MessengerFrame {...divProps}>
                    <Image url={url} />
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