import {
    IFBMGenericTemplatePayload,
    IFBMGenericTemplateElement
} from '../../interfaces/GenericTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerContent } from '../MessengerContent';
import { getMessengerFrame } from '../MessengerFrame';
import { getMessengerTitle } from '../MessengerTitle';
import { getMessengerSubtitle } from '../MessengerSubtitle';
import { Carousel } from 'react-responsive-carousel';

import "./carousel.css";
import { IWebchatConfig } from "@cognigy/webchat-client/lib/interfaces/webchat-config";
import { getFlexImage } from "../FlexImage";
import { getBackgroundImage } from "../../lib/css";
import uuid from "uuid";

export interface IMessengerGenericTemplateProps
    extends IWithFBMActionEventHandler {
    payload: IFBMGenericTemplatePayload;
    config: IWebchatConfig;
}

export interface IMessengerGenericTemplateState {
    index?: number;
    selectedItem: number;
}

export const getMessengerGenericTemplate = ({
    React,
    styled,
}: MessagePluginFactoryProps) => {
    const MessengerSubtitle = getMessengerSubtitle({ React, styled});
    const MessengerTitle = getMessengerTitle({ React, styled });
    const MessengerFrame = getMessengerFrame({ React, styled });
    const MessengerContent = getMessengerContent({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });
    const FlexImage = getFlexImage({ React, styled });

    const CarouselRoot = styled(Carousel)(({ theme }) => ({
        marginBottom: -32,

        ".slide": {
            paddingLeft: theme.unitSize * 2,
            paddingRight: theme.unitSize * 2,
            paddingBottom: 32,
            display: "flex",

            "&>*": {
                flexGrow: 1
            }
        }
    }));

    const ElementRoot = styled.div(({ theme }) => ({
        display: "flex"
    }));

    const Frame = styled(MessengerFrame)({
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",

        "&.wide": {
            width: 320
        }
    });

    const FixedImage = styled.div({
        paddingTop: "50%",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        display: "table",
        width: "100%"
    });

    const GenericContent = styled(MessengerContent)({
        flexGrow: 1
    });

    const MessengerGenericTemplate = class MessengerGenericTemplate extends React.Component<
        IMessengerGenericTemplateProps & React.HTMLProps<HTMLDivElement>,
        IMessengerGenericTemplateState
        > {

        constructor(props) {
            super(props);

            this.state = {
                selectedItem: 0,
            }
        }

        // Change the selectedItem state, in order to scroll the card with a focused element into view
        handleScrollToView = (index) => {
            this.setState({selectedItem: index})
        }

        handleCardChange = (index) => {
            this.setState({selectedItem: index});
        }

        // Move cards in carousel using arrow keys
        handleArrowKeyDown = (event) => {
            if(event.key === "ArrowRight") {
                this.setState({selectedItem: this.state.selectedItem + 1})
            } else if(event.key === "ArrowLeft") {
                this.setState({selectedItem: this.state.selectedItem - 1})
            }
        }

        renderElement = (element: IFBMGenericTemplateElement, index?: number) => {
            const { onAction, ...divProps } = this.props;
            const { image_url, image_alt_text, title, subtitle, buttons, default_action } = element;

            const isCentered = this.props.config.settings.designTemplate === 2;
            const carouselRootId = `webchatCarouselTemplateRoot-${uuid.v4()}`;
            const carouselTitleId = `webchatCarouselTemplateTitle-${uuid.v4()}`;
            const carouselSubtitleId = `webchatCarouselTemplateSubtitle-${uuid.v4()}`;
            const carouselAriaLabelledby = title ? carouselTitleId : undefined;
            const carouselAriaDescribedby = subtitle ? carouselSubtitleId : undefined;
            const a11yProps = {role: "group", "aria-labelledby": carouselAriaLabelledby, "aria-describedby": carouselAriaDescribedby};
            const carouselTitle = title ? title + ". " : "";
            const ariaLabelForCarouselTitle = default_action?.url ? carouselTitle + "Opens in new tab" : title;
			

            const image = image_url ? (
                this.props.config.settings.dynamicImageAspectRatio ? (
                    <FlexImage
						style={{ backgroundImage: getBackgroundImage(image_url) }}
						alt={image_alt_text || ""}
                    />
                ) : (
                        <FixedImage
                            style={{ backgroundImage: getBackgroundImage(image_url) }}
                        > 
							<span role="img" aria-label={image_alt_text || "Attachment Image"}> </span>
						</FixedImage>
                    )
            ) : null;

            const handleKeyDown = (event, default_action) => {
                if(default_action && event.key === "Enter") {
                    onAction(event, default_action);
                }
            }

            return (
                <ElementRoot key={index} className="webchat-carousel-template-root" id={carouselRootId}>
                    <Frame className={`webchat-carousel-template-frame ${isCentered ? "wide" : ""}`} {...a11yProps}>
                        {image}
                        <GenericContent
                            onClick={e => default_action && onAction(e, default_action)}
                            className="webchat-carousel-template-content"
                            style={default_action?.url ? { cursor: "pointer" }:{}}
                            role={default_action?.url ? "link" : undefined}
                            aria-label={ariaLabelForCarouselTitle}
                            aria-describedby={carouselAriaDescribedby}
                            tabIndex={default_action?.url ? 0 : -1}
                            onKeyDown = {e => handleKeyDown(e, default_action)}
                        >
                            <MessengerTitle className="webchat-carousel-template-title" dangerouslySetInnerHTML={{__html: title}} id={carouselTitleId} />
                            <MessengerSubtitle className="webchat-carousel-template-title" dangerouslySetInnerHTML={{__html: subtitle}} config={this.props.config} id={carouselSubtitleId} />
                        </GenericContent>
						<div>
							{buttons &&
								buttons.map((button, i) => (
									<React.Fragment key={i}>
										<Divider />
										<MessengerButton
											button={button}
											onClick={e => onAction(e, button)}
											className="webchat-carousel-template-button"
											onFocus={() => this.handleScrollToView(index)}
										/>
									</React.Fragment>
								))}
						</div>
                    </Frame>
                </ElementRoot>
            );
        };

        render() {
            const elements = this.props.payload.elements;
            const { selectedItem } = this.state;

            if (elements.length === 0) return null;

            if (elements.length === 1) return this.renderElement(elements[0]);

            return (
                <div onKeyDown={this.handleArrowKeyDown}>
                    <CarouselRoot
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={true}
                        centerMode={true}
                        selectedItem={selectedItem}
                        onChange={this.handleCardChange}
                    >
                        {elements.map(this.renderElement)}
                    </CarouselRoot>
                </div>
            );
        }
    };

    return MessengerGenericTemplate;
};
