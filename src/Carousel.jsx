/* Node modules */
import { Component, render, h } from "preact";
import { Carousel as Slider } from 'react-responsive-carousel';
import styles from './carousel.css';
styles.use();

/* Custom modules */
import { Avatar } from "./Avatar.jsx";

class Carousel extends Component {
	constructor() {
		super();

		this.state = {
			currentSlide: 0
        };

        this.handleSlideChange = this.handleSlideChange.bind(this);
        
    }
    
    handleSlideChange = (galleryElements, currentSlide) => {
        /* Set the currentSlide value to the slide we are switching to */
        if (currentSlide !== (galleryElements.length - 1)) {
            this.setState({
                currentSlide
            });
        } else if (currentSlide === (galleryElements.length - 1)) {
            this.setState({
                currentSlide: currentSlide - 1
            });
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
            centerSlidePercentage: this.state.currenSlide === 0 ? (this.state.currentSlide === 2) ? 85 : 80: 90,
        };

        /* Create array of gallery elements with extra clone at the end */
        let galleryElements;
        if (this.props.galleryElements && this.props.galleryElements.length > 0) {
            galleryElements = [...this.props.galleryElements, this.props.galleryElements[0]];
        }

        return (
            <div 
                className="cognigy-chat-bot-message-container"
                style={{
                    marginLeft: this.state.currentSlide !== 0 ? "0px" : "10px"
                }}
            >
                { /* Add overflow__hidden to Slider in order to have a flex container around it */ }
                <Slider 
                    // className="overflow__hidden" 
                    {...sliderSettings}
                    style={{ background: "white" }}
                    onChange={(currentSlide) => this.handleSlideChange(galleryElements, currentSlide)}
                    selectedItem={this.state.currentSlide}
                    ref={(slider) => { this.slider = slider }}
                >
                    { galleryElements && galleryElements.map((element, index) => (
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end",
                        }}>
                            <Avatar 
                                style={{ 
                                    visibility: index !== 0 ? "hidden" : "visible",
                                    minWidth: index !== 0 ? "8px" : "20px",
                                    maxWidth: index !== 0 ? "8px" : "20px",
                                    marginBottom: "1px"
                                }}
                                messageLogoUrl={ this.props.messageLogoUrl }
                            />
                            <div
                                key={index + element.title}
                                className="generic_template_element_container"
                                style={{
                                        /* Don't display the last element since it is a cloned element only there for styling purposes */
                                        display: index === (galleryElements.length - 1) ? "none": "auto",
                                        marginBottom: "5px",
                                        width: "100%"
                                }}
                            >
                                <img
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        borderRadius: "10px 10px 0 0"
                                    }}
                                    src={element.image_url}
                                />

                                <div className="generic_template_carousel_buttons_container">
                                    <div 
                                        className="generic_template_decrement"
                                        onClick={() => {
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
                                    { element.title && 
                                        <p className="text_title">
                                            { element.title }
                                        </p>
                                    }

                                    { element.subtitle &&
                                        <p className="text_subtitle">
                                            { element.subtitle }
                                        </p>
                                    }
                                </div>

                                { element.buttons && element.buttons.map(button => (
                                    <div 
                                        className="button"
                                        onClick={() => {
                                            if (button.type === "postback") {
                                                return this.props.handleButtonPostback(button.payload);
                                            } else if (button.type === "web_url") {
                                                return this.props.handleButtonWebUrl(button.url);
                                            };
                                        }}
                                    >
                                        { button.title }
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