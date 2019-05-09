import { registerMessagePlugin } from "../../helper";


const createRatingPlugin = ({ React }) => {

	const Rating = ({ onSendMessage }) => {
		const sendRating = rate => () => onSendMessage('', { rate });

		return (
			<div>
				<button onClick={sendRating(1)}>★</button>
				<button onClick={sendRating(2)}>★</button>
				<button onClick={sendRating(3)}>★</button>
				<button onClick={sendRating(4)}>★</button>
				<button onClick={sendRating(5)}>★</button>
			</div>
		)
	}

	const ratingPlugin = {
		match: 'rating-react',
		component: Rating
	}

	return ratingPlugin;
}

registerMessagePlugin(createRatingPlugin)