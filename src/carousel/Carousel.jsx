/* Node modules */
import { Component, render, h } from "preact";
import { Carousel as Slider } from 'react-responsive-carousel';
import ClampLines from "react-clamp-lines";

import styles from './carousel.css';
styles.use();

/* Custom modules */
import { Avatar } from "../Avatar.jsx";

class Carousel extends Component {
    constructor() {
        super();

        this.state = {
            currentSlide: 0,
            imageUrl: null
        };

        this.handleSlideChange = this.handleSlideChange.bind(this);

    }

    handleSlideChange = (galleryElements, currentSlide) => {
        /* Set the currentSlide value to the slide we are switching to */
        if (currentSlide !== (galleryElements.length - 1)) {
            this.setState({
                currentSlide
            });
        }

        /* If we are at the last slide (minus the clone slide), we don't slide further */
        else if (currentSlide === (galleryElements.length - 1)) {
            this.setState({
                currentSlide: currentSlide - 1
            });
        }
    }

    componentWillMount() {
        /* If we can load the logo image, then we use it. Otherwise we use the Cognigy logo */
        const img = new Image();

        img.onload = () => {
            this.setState({ imageUrl: this.props.messageLogoUrl });
        }

        img.onerror = () => {
            this.setState({ imageUrl: "https://s3.eu-central-1.amazonaws.com/cognigydev/CognigyWebchat/images/cognigy_logo.svg" });
        }

        img.src = this.props.messageLogoUrl;
    }

    componentDidMount() {
        /* Set the slider width to 100% for IE support */
        if (this.slider && this.slider.base && this.slider.base.style) {
            this.slider.base.style.width = "100%";
            this.slider.base.style.maxWidth = "100%";
        }
    }

    render() {
        const sliderSettings = {
            showArrows: false,
            showStatus: false,
            showThumbs: false,
            showIndicators: false,
            transitionTime: 300,
            centerMode: true,
            centerSlidePercentage: this.state.currenSlide === 0 ? (this.state.currentSlide === 2) ? 85 : 80 : 90,
            onClickItem: (index) => {
                /* Update the currentSlide so the state of this component is up to date with the internal state of the Carousel */
                this.setState({ currentSlide: index });
            }
        };

        /* Create array of gallery elements with extra clone at the end */
        let galleryElements;
        if (this.props.galleryElements && this.props.galleryElements.length > 0) {
            galleryElements = [...this.props.galleryElements, this.props.galleryElements[0]];
        }

        return (
            <div
                // className="cognigy-chat-bot-message-container cognigy-chat-bot-gallery-container"
                style={{
                    // Enable if logos are enabled
                    // marginLeft: this.state.currentSlide !== 0 ? "0px" : "10px"
                }}
            >
                <Slider
                    {...sliderSettings}
                    style={{ background: "white" }}
                    onChange={(currentSlide) => this.handleSlideChange(galleryElements, currentSlide)}
                    selectedItem={this.state.currentSlide}
                    ref={(slider) => { this.slider = slider }}
                >
                    {this.state.imageUrl && galleryElements && galleryElements.map((element, index) => (
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",

                            // Used when logos are disabled
                            marginLeft: "10px",
                            marginRight: "10px",
                        }}>
                            <Avatar
                                style={{
                                    visibility: index !== 0 ? "hidden" : "visible",
                                    minWidth: index !== 0 ? "10px" : "20px",
                                    maxWidth: index !== 0 ? "10px" : "20px",
                                    marginBottom: "1px"
                                }}
                                className={index === 0 ? "cognigy-chat-bot-gallery-avatar__first" : "cognigy-chat-bot-gallery-avatar"}
                                imageUrl={this.state.imageUrl}
                            />
                            <div
                                key={index + element.title}
                                className="generic_template_element_container"
                                style={{
                                    /* Don't display the last element since it is a cloned element only there for styling purposes */
                                    display: index === (galleryElements.length - 1) ? "none" : "auto",
                                    marginBottom: "5px",
                                    width: "100%"
                                }}
                            >
                                <div
                                    style={{
                                        height: "200px",
                                        borderRadius: "10px 10px 0 0",
                                        backgroundImage: `url(${element.image_url})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}
                                />

                                <div className="generic_template_carousel_buttons_container">
                                    <div
                                        className="generic_template_decrement"
                                        onClick={() => {
                                            /* Set cancelClik state on the slider to avoid default behavoir */
                                            this.setState.bind(this.slider)({ cancelClick: true }, () => {
                                                this.slider.decrement();
                                            });
                                        }}
                                        style={{
                                            visibility: this.state.currentSlide !== index || this.state.currentSlide === 0
                                                ? "hidden"
                                                : "visible"
                                        }}
                                    />

                                    <div
                                        className="generic_template_increment"
                                        onClick={() => {
                                            /* Set cancelClik state on the slider to avoid default behavoir */
                                            this.setState.bind(this.slider)({ cancelClick: true }, () => {
                                                this.slider.increment();
                                            });
                                        }}
                                        style={{
                                            visibility: this.state.currentSlide !== index || this.state.currentSlide === (this.props.galleryElements.length - 1)
                                                ? "hidden"
                                                : "visible"
                                        }}
                                    />
                                </div>
                                <div className="generic_template_text_container">
                                    {element.title &&
                                        <p className="text_title">
                                            {element.title}
                                        </p>
                                    }

                                    { element.subtitle &&
                                        <ClampLines
                                            text={element.subtitle}
                                            buttons={false}
                                            lines="5"
                                            className="text_subtitle"
                                        />
                                    }
                                </div>

                                {element.buttons && element.buttons.map(button => (
                                    <div
                                        className="button"
                                        onClick={() => {
                                            if (button.type === "postback") {
                                                return this.props.handleButtonPostback(button.title, button.payload);
                                            } else if (button.type === "web_url") {
                                                return this.props.handleButtonWebUrl(button.url);
                                            };
                                        }}
                                    >
                                        {button.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Slider>

            </div>
        );
    }
};

export default Carousel;