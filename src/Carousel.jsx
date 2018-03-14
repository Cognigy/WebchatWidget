/* Node modules */
import { Component, render, h } from "preact";
import Slider from "react-slick";

/* Custom modules */
import { Avatar } from "./Avatar.jsx";

class Carousel extends Component {
	constructor() {
		super();

		this.state = {
			currentSlide: 0
		};
    }
    
    handleBeforeChange = (currentSlide, nextSlide) => {
        /* Set the currentSlide value to the slide we are switching to (e.g. nextSlide) */
        this.setState({
            currentSlide: nextSlide
        });
    }

	render() {
		const sliderSettings = {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false,
            //  centerPadding: "50px",
            arrows: false,
            infinite: false,
            mobileFirst: true,
            speed: 200
        };

        return (
            <div 
                className="cognigy-chat-bot-message-container"
                style={{
                    marginLeft: this.state.currentSlide !== 0 ? "0px" : "10px"
                }}
            >
				<Avatar 
					style={{ display: this.state.currentSlide !== 0 ? "none" : "blcck" }}
					messageLogoUrl={ this.props.messageLogoUrl }
				/>

                { /* Add overflow__hidden to Slider in order to have a flex container around it */ }
                <Slider 
                    className="overflow__hidden" 
                    {...sliderSettings}
                    beforeChange={this.handleBeforeChange}
                    ref={(slider) => { this.slider = slider }}
                >
                    { this.props.galleryElements && this.props.galleryElements.map((element, index) => (
                        <div
                            key={index + element.title}
                            /* Add special styling for selected element unless it is the first one */
                            className={this.state.currentSlide === index && this.state.currentSlide !== 0
                                ? "generic_template_element_container_selected" 
                                : "generic_template_element_container"
                            }
                            style={{
                                // margin: "0 7px",
                                marginLeft: index !== 0
                                    ? "7px" 
                                    : "0px",
                                marginRight: index !== (this.props.galleryElements.length -1)
                                    ? "7px"
                                    : "0px",
                               // maxWidth: this.state.currentSlide === index ? "25rem" : "unset",
                            }}
                        >
                            <img
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    borderRadius: "10px 10px 0 0"
                                }}
                                src={element.image_url} />

                            <div className="generic_template_carousel_buttons_container">
                                <div 
                                    className="generic_template_decrement"
                                    onClick={() => this.slider.slickPrev()}
                                    style={{
                                        visibility: this.state.currentSlide !== index || this.state.currentSlide === 0
                                            ? "hidden"
                                            : "visible"
                                    }}
                                />

                                <div 
                                    className="generic_template_increment"
                                    onClick={() => this.slider.slickNext()}
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
                                            return this.handleButtonPostback(button.payload);
                                        } else if (button.type === "url") {
                                            return this.handleButtonWebUrl(button.web_url);
                                        };
                                    }}
                                >
                                    { button.title }
                                </div>
                            ))}
                        </div>                    
                    ))}
                </Slider>
            </div>
		);
	}
};

export default Carousel;