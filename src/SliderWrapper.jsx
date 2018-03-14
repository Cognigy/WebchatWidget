/* Node modules */
import { Component, render, h } from "preact";
import { Carousel as Slider } from 'react-responsive-carousel';
import styles from './carousel.css';
styles.use();

/* Custom modules */
import { Avatar } from "./Avatar.jsx";

class SliderWrapper extends Component {
	constructor() {
		super();

		this.state = {
			currentSlide: 0
		};
    }
    
    handleSlideChange = (galleryElements, currentSlide) => {
        console.log(currentSlide)
        /* Set the currentSlide value to the slide we are switching to */
        if (currentSlide !== (galleryElements.length - 1)) {
            this.setState({
                currentSlide
            }, () => console.log(this.state.currentSlide));
        } else if (currentSlide === (galleryElements.length - 1)) {
            this.setState({
                currentSlide: currentSlide - 1
            });
        }
	}
	
	render() {
		return (
			<div 
                className="cognigy-chat-bot-message-container"
                style={{
                    marginLeft: this.state.currentSlide !== 0 ? "0px" : "10px"
                }}
            >
			{ this.props.children }
			</div>
		)
	}
}

export default SliderWrapper;