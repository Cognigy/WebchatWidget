import { IFBMListTemplateElement } from '../../../interfaces/ListTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../../MessengerPreview.interface';
import { MessagePluginFactoryProps } from '../../../../../../../common/interfaces/message-plugin';
import { getMessengerSubtitle } from '../../MessengerSubtitle';
import { getMessengerTitle } from '../../MessengerTitle';

interface IMessengerListTemplateHeaderElementProps extends IWithFBMActionEventHandler {
    element: IFBMListTemplateElement;
}

export const getMessengerListTemplateHeaderElement = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const Root = styled.div<{ url: string }>(({ url }) => ({
        position: 'relative',
        paddingTop: '50%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
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

    const MessengerListTemplateHeaderElement = ({ element, onAction }: IMessengerListTemplateHeaderElementProps) => {
        const { title, subtitle, image_url, default_action } = element;
        // TODO buttons, default_action

        const styles: React.CSSProperties = {
            backgroundImage: `url('${image_url}')`
        }

        return (
            <Root
                url={image_url}
                onClick={default_action && (e => onAction(e, default_action))}
                style={styles}
            >
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