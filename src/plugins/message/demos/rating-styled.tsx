import { registerMessagePlugin } from "../../helper";


const createRatingPlugin = ({ React, styled }) => {

    const RedButton = styled.button({
        color: 'red'
	})
	
	const ThemedButton = styled.button(({ theme }) => ({
		color: theme.primaryColor
	}))

	const Rating = ({ onSendMessage }) => {
		const sendRating = rate => () => onSendMessage('', { rate });

		return (
			<div>
				<RedButton onClick={sendRating(1)}>★</RedButton>
				<RedButton onClick={sendRating(2)}>★</RedButton>
				<RedButton onClick={sendRating(3)}>★</RedButton>
				<RedButton onClick={sendRating(4)}>★</RedButton>
				<ThemedButton onClick={sendRating(5)}>★</ThemedButton>
			</div>
		)
	}

	const ratingPlugin = {
		match: 'rating-styled',
		component: Rating
	}

	return ratingPlugin;
}

registerMessagePlugin(createRatingPlugin)