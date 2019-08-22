import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';
import { getFlexImage } from '../../FlexImage';
import { IWebchatConfig } from '@cognigy/webchat-client/lib/interfaces/webchat-config';

interface IMessengerListTemplateHeaderElementProps extends IWithFBMActionEventHandler {
    element: IFBMListTemplateElement;
    config: IWebchatConfig;
}

export const getMessengerListTemplateHeaderElement = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const FlexImage = getFlexImage({ React, styled });

    const Root = styled.div(() => ({
        position: 'relative',
    }));

    const DarkLayer = styled.div({
        display: 'block',
        content: '" "',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'hsla(0, 0%, 0%, .6)'
    });

    const Content = styled.div({
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        padding: 10,
    });

    const Title = styled(MessengerTitle)({
        color: 'hsla(0, 0%, 100%, .9)'
    });

    const Subtitle = styled(MessengerSubtitle)({
        color: 'hsla(0, 0%, 100%, .9)'
    });

    const FixedImage = styled.div(() => ({
        paddingTop: '50%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
    }));

    const MessengerListTemplateHeaderElement = ({ element, onAction, config }: IMessengerListTemplateHeaderElementProps) => {
        const { title, subtitle, image_url, default_action } = element;
        // TODO buttons, default_action

        const image = config.settings.dynamicImageAspectRatio
            ? <FlexImage src={image_url} />
            : <FixedImage style={{ backgroundImage: image_url ? `url("${encodeURI(image_url)}")` : undefined }} />

        return (
            <Root
                onClick={default_action && (e => onAction(e, default_action))}
            >
                {image}
                <DarkLayer />
                <Content>
                    <Title>{title}</Title>
                    <Subtitle>{subtitle}</Subtitle>
                </Content>
            </Root>
        )
    };

    return MessengerListTemplateHeaderElement;
}