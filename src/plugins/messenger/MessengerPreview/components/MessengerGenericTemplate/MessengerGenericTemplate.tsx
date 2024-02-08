import {
    IFBMGenericTemplatePayload,
    IFBMGenericTemplateElement
} from '../../interfaces/GenericTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerImage } from '../MessengerImage/MessengerImage';
import { getMessengerContent } from '../MessengerContent';
import { getMessengerFrame } from '../MessengerFrame';
import { getMessengerTitle } from '../MessengerTitle';
import { getMessengerSubtitle } from '../MessengerSubtitle';
import { Carousel } from 'react-responsive-carousel';

import "./carousel.css";
import { IWebchatConfig } from "../../../../../common/interfaces/webchat-config";
import { v4 as uuidv4 } from "uuid"
import { sanitizeHTML } from '../../../../../webchat/helper/sanitize';

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
    const MessengerImage = getMessengerImage({ React, styled });
    const Divider = getDivider({ React, styled });

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

    const ElementRoot = styled.div({
        display: "flex"
    });

    const Frame = styled(MessengerFrame)({
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        "&:focus": {
            outline: "none",
        },
        "&.wide": {
            width: 320
        }
    });

    const GenericContent = styled(MessengerContent)({
        flexGrow: 1,
        "&.link": {
            cursor: "pointer",
            "&:focus": {
                backgroundColor: 'hsl(0, 0%, 92%)'
            }
        }
    });

    const MessengerGenericTemplate = class MessengerGenericTemplate extends React.Component<
        IMessengerGenericTemplateProps & React.HTMLProps<HTMLDivElement>,
        IMessengerGenericTemplateState
        > {
		carouselRootId = `webchatCarouselTemplateRoot-${uuidv4()}`;
		carouselContentId = `webchatCarouselContentButton-${uuidv4()}`;
		carouselButtonId = `webchatCarouselTemplateButton-${uuidv4()}`;

        /**
         * Controlling the selectedItem state causes unexpected scroll behavior in IE11 and Edge 15 to 18. 
         * Therefore, detect these legacy browsers and prevent updating selectedItem state.
         * Without proper selectedItem state, we will not be able to fix the accessibility issues in these browsers.
         * */
        isLegacyEdgeBrowser: boolean = window.navigator.userAgent.indexOf('Edge/') > 0; //to detect Edge 15 to 18
        isIE11Browser: boolean = window.navigator.userAgent.indexOf('Trident/') > 0; //to detect ie11

        constructor(props) {
            super(props);

            this.state = {
                selectedItem: 0,
            }
        }

        componentDidMount() {
            const chatHistory = document.getElementById("webchatChatHistoryWrapperLiveLogPanel");
            const firstCardContent = document.getElementById(`${this.carouselContentId}-0`);
            const firstButton = document.getElementById(`${this.carouselButtonId}-00`);

			if (!this.props.config.settings.widgetSettings.enableAutoFocus) return;

            if(!chatHistory?.contains(document.activeElement)) return;

            if(firstCardContent?.getAttribute("role") === "link") {
                setTimeout(() => {
                    firstCardContent?.focus();
                }, 200);
            } else if(firstButton) {
                setTimeout(() => {
                    firstButton?.focus();
                }, 200);
            }             
        }

        // Change the selectedItem state, in order to scroll the card with a focused element into view
        handleScrollToView = (index) => {
            if(!this.isIE11Browser && !this.isLegacyEdgeBrowser) {
                this.setState({selectedItem: index});
            }
        }

        /**
         * Move cards in carousel using arrow keys. 'useKeyboardArrows' prop of react-responsive-carousel
         * moves the carousel irrespective of it has a focused item or not. Therefore, it has to be handled this way.
         * 
         */
        handleArrowKeyDown = (event) => {
            if(!this.isIE11Browser && !this.isLegacyEdgeBrowser) {
                const { selectedItem } = this.state;
                const lastPosition = this.props.payload.elements.length - 1;
                if((event.key === "ArrowRight" || event.keyCode === "39") && selectedItem < lastPosition) {
                    this.setState({selectedItem: selectedItem + 1}, () => {
                        this.focusCardInView();
                    });
                } else if((event.key === "ArrowLeft"  || event.keyCode === "39") && selectedItem > 0) {
                    this.setState({selectedItem: selectedItem - 1}, () => {
                        this.focusCardInView();
                    })
                }
            }
        }

        focusCardInView = () => {
            const nextCardToFocus = document.getElementById(`${this.carouselRootId}-${this.state.selectedItem}`);
            nextCardToFocus?.focus();
        }

        renderElement = (element: IFBMGenericTemplateElement, index?: number) => {
            const { onAction, ...divProps } = this.props;
            const { image_url, image_alt_text, title, subtitle, default_action } = element;
            const buttons = element.buttons || [];

            const carouselListLength = this.props.payload.elements.length;
			const isCentered = this.props.config.settings.demoWebchat.position === 'centered';
			const carouselTitleId = `webchatCarouselTemplateTitle-${uuidv4()}`;
			const carouselSubtitleId = `webchatCarouselTemplateSubtitle-${uuidv4()}`;

            const buttonsCountLabel = buttons.length === 1 ? "1 button or link." : `${buttons.length} buttons or links.`;
            const buttonsInListItemAriaLabel = buttons.length > 0 ? `with ${buttonsCountLabel}` : undefined;
            // When gallery items count is one, refer the gallery card as 'slide' instead of 'list item', in aria-label
            const listItemCount = index !== undefined ? `${carouselListLength === 1 ? "slide" : ""} ${index + 1} of ${carouselListLength} ${buttonsInListItemAriaLabel || ""}` : undefined;
            const carouselAriaLabel = title ? `${listItemCount}: ${title}` : listItemCount;
            const carouselAriaLabelledby = title ? carouselTitleId : undefined;
            const carouselAriaDescribedby = subtitle ? carouselSubtitleId : undefined;
            const carouselRootA11yProps = {role: "group", "aria-labelledby": listItemCount ? undefined : carouselAriaLabelledby,
                "aria-label": listItemCount ? carouselAriaLabel : undefined, "aria-describedby": carouselAriaDescribedby};
            const carouselTitle = title ? title + ". " : "";
            const carouselHeaderA11yProps = default_action?.url ? {"aria-label": carouselTitle + "Opens in new tab"} :
                {"aria-labelledby": carouselAriaLabelledby}

            const handleKeyDown = (event, default_action) => {
                if(default_action && event.key === "Enter") {
                    onAction(event, default_action);
                }
            }

			const titleHtml = this.props.config.settings.layout.disableHtmlContentSanitization ? title : sanitizeHTML(title);
			const subtitleHtml = this.props.config.settings.layout.disableHtmlContentSanitization ? subtitle : sanitizeHTML(subtitle);

            return (
                <ElementRoot key={index} className="webchat-carousel-template-root">
                    <Frame
                        className={`webchat-carousel-template-frame ${isCentered ? "wide" : ""}`}
                        id={`${this.carouselRootId}-${index}`}
                        tabIndex={-1}
                        onFocus={() => this.handleScrollToView(index)}
                        {...carouselRootA11yProps}
                    >
                        <MessengerImage url={image_url} config={this.props.config} altText={image_alt_text} template="generic" />
                        <GenericContent
                            onClick={e => default_action && onAction(e, default_action)}
                            className={`webchat-carousel-template-content ${default_action?.url ? "link" : ""}`}
                            role={default_action?.url ? "link" : undefined}
                            aria-describedby={carouselAriaDescribedby}
                            tabIndex={default_action?.url ? 0 : -1}
                            onKeyDown = {e => handleKeyDown(e, default_action)}
                            id={`${this.carouselContentId}-${index}`}
                            {...carouselHeaderA11yProps}
                        >
                            <MessengerTitle className="webchat-carousel-template-title" dangerouslySetInnerHTML={{ __html: titleHtml }} id={carouselTitleId} />
                            <MessengerSubtitle className="webchat-carousel-template-title" dangerouslySetInnerHTML={{ __html: subtitleHtml }} config={this.props.config} id={carouselSubtitleId} />
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
                                            config={this.props.config}
                                            id={`${this.carouselButtonId}-${index}${i}`}
                                            position={i + 1}
                                            total={buttons.length}
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

            if (elements.length === 1) return this.renderElement(elements[0], 0);

            return (
                <div onKeyDown={this.handleArrowKeyDown}>
                    <CarouselRoot
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={false}
                        centerMode={true}
                        centerSlidePercentage={80}
                        labels={{leftArrow: "Previous Item", rightArrow: "Next Item"}}
                        selectedItem={selectedItem}
                    >
                        {elements.map(this.renderElement)}
                    </CarouselRoot>
                </div>
            );
        }
    };

    return MessengerGenericTemplate;
};
