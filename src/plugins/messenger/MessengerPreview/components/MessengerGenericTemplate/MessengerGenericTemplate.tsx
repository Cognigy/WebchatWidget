import { IFBMGenericTemplatePayload, IFBMGenericTemplateElement } from '../../interfaces/GenericTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerContent } from '../MessengerContent';
import { getMessengerFrame } from '../MessengerFrame';
import { getMessengerTitle } from '../MessengerTitle';
import { getMessengerSubtitle } from '../MessengerSubtitle';
import { Carousel } from 'react-responsive-carousel';

import './carousel.css';
import { element } from 'prop-types';
import { IWebchatConfig } from '@cognigy/webchat-client/lib/interfaces/webchat-config';

export interface IMessengerGenericTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMGenericTemplatePayload;
    config: IWebchatConfig;
}

export interface IMessengerGenericTemplateState {
    index: number;
}

export const getMessengerGenericTemplate = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled });
    const MessengerTitle = getMessengerTitle({ React, styled });
    const MessengerFrame = getMessengerFrame({ React, styled });
    const MessengerContent = getMessengerContent({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const CarouselRoot = styled(Carousel)(({ theme }) => ({
        marginBottom: -32,

        '.slide': {
            paddingLeft: theme.unitSize * 2,
            paddingRight: theme.unitSize * 2,
            paddingBottom: 32,
            display: 'flex',

            '&>*': {
                flexGrow: 1
            }
        }
    }))

    const ElementRoot = styled.div(({ theme }) => ({
        display: 'flex',
    }));

    const Frame = styled(MessengerFrame)({
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',

        '&.wide': {
            width: 320
        }
    });

    const Image = styled.div(() => ({
        paddingTop: '50%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    }));

    const GenericContent = styled(MessengerContent)({
        flexGrow: 1
    });

    const MessengerGenericTemplate = class MessengerGenericTemplate extends React.Component<IMessengerGenericTemplateProps & React.HTMLProps<HTMLDivElement>, IMessengerGenericTemplateState> {
        getImageStyles = (element: IFBMGenericTemplateElement) => {
            const backgroundImage = `url("${encodeURI(element.image_url)}")`;

            const styles: React.CSSProperties = {
                backgroundImage
            }

            return styles;
        }

        renderElement = (element: IFBMGenericTemplateElement, index?: number) => {

            const { onAction, ...divProps } = this.props;
            const { image_url, title, subtitle, buttons, default_action } = element;

            const isCentered = this.props.config.settings.designTemplate === 2

            return (
                <ElementRoot key={index}>
                    <Frame className={isCentered ? 'wide' : ''}>
                        {image_url && (
                            <>
                                <Image
                                    onClick={e => default_action && onAction(e, default_action)}
                                    style={this.getImageStyles(element)}
                                />
                                <Divider />
                            </>
                        )}
                        <GenericContent
                            onClick={e => default_action && onAction(e, default_action)}
                        >
                            <MessengerTitle>{title}</MessengerTitle>
                            <MessengerSubtitle>{subtitle}</MessengerSubtitle>
                        </GenericContent>
                        {buttons && buttons.map((button, index) => (
                            <React.Fragment key={index}>
                                <Divider />
                                <MessengerButton
                                    button={button}
                                    onClick={e => onAction(e, button)}
                                />
                            </React.Fragment>
                        ))}
                    </Frame>
                </ElementRoot>
            );
        }

        render() {
            const elements = this.props.payload.elements;

            if (elements.length === 0)
                return null;

            if (elements.length === 1)
                return this.renderElement(elements[0])

            return (
                <CarouselRoot
                    showThumbs={false}
                    showIndicators={false}
                    showStatus={false}
                    centerMode={true}
                >
                    {elements.map(this.renderElement)}
                </CarouselRoot>
            )
        }
    }

    return MessengerGenericTemplate;
}