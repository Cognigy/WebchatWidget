import React from 'react';
import { MessageComponentProps } from '../../common/interfaces/message-plugin';
import tinycolor from 'tinycolor2';
import styled from '@emotion/styled';
import ThumbIcon from '../../webchat-ui/assets/thumb-up-24dp.svg';
import { getRating } from '.';

const StyledThumbIcon = styled(ThumbIcon)(({ theme }) => ({
	fill: tinycolor(theme.greyContrastColor).setAlpha(.4).toHslString(),
	verticalAlign: "bottom",
}));

const StyledThumbDownIcon = styled(StyledThumbIcon)({
	transform: "rotate(180deg)",
	verticalAlign: "top",
});

const TextIconWrapper = styled.div(({ theme, addedSpacing }) => ({
	marginBottom: addedSpacing && 6,
}));

const RatingCommentText = styled.div(({ theme }) => ({
	paddingLeft: theme.unitSize * 2,
	paddingRight: theme.unitSize * 2,
}));

const RatingHistoryEntry = styled.div(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	fontStyle: "italic",
	alignItems: "center",
	fontFamily: theme.fontFamily,
	color: tinycolor(theme.greyContrastColor).setAlpha(.6).toHslString(),
}));

const RatingHistoryEntryWithProps = ({ message, config }: MessageComponentProps) => {
	const rating = getRating(message);

	const ratingText = config.settings.ratingMessageHistoryRatingText;
	const commentText = config.settings.ratingMessageHistoryCommentText;

	if (!rating) return null;

	const getRatingIcon = (rating: number) => {
		if (rating === 1) return <StyledThumbIcon style={{ marginLeft: 6 }} />;
		if (rating === -1) return <StyledThumbDownIcon style={{ marginLeft: 6 }} />;

		return rating;
	};

	const getRatingLabel = (rating: number) => {
		if (rating === 1) return "Thumbs Up.";
		if (rating === -1) return "Thumbs Down.";

		return rating;
	};

	return (
		<RatingHistoryEntry>
			<TextIconWrapper addedSpacing={rating.rating === 1}>
				<span>{ratingText}</span>
				<span className="sr-only">{getRatingLabel(rating.rating)}</span>
				{getRatingIcon(rating.rating)}
			</TextIconWrapper>

			{
				rating.comment &&
				<RatingCommentText>
					{commentText} {rating.comment}
				</RatingCommentText>
			}
		</RatingHistoryEntry>
	)
};

export default RatingHistoryEntryWithProps;