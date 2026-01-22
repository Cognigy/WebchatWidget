import React, { useState, useRef } from "react";
import RatingDown from "../../assets/rating-down-16px.svg";
import RatingUp from "../../assets/rating-up-16px.svg";
import IconButton from "../../webchat-ui/components/presentational/IconButton";
import Textarea from "../../webchat-ui/components/presentational/Textarea";
import { styled } from "../../webchat-ui/style";
import Button from "../../webchat-ui/components/presentational/Button";

const PrimaryButton = styled(Button)(({ theme }) => ({
    background: theme.primaryGradient,
    color: theme.primaryContrastColor,
  }));

const RatingWidgetRoot = styled.div({
	width: "100%",
	display: "flex",
	flexDirection: "column",
	padding: "20px 0",
	gap: 24,
});

const RatingButtonContainer = styled.div({
	width: "100%",
	display: "flex",
	alignItems: "flex-start",
	gap: 8,
});

const RatingButton = styled(IconButton)(({ theme, selected }: any) => {
	return {
		background: selected ? theme.primaryColor : theme.black95 || "#f5f5f5",
		color: selected ? theme.primaryContrastColor : theme.black10 || "#1a1a1a",
		display: "flex",
		padding: "12px 16px",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
		borderRadius: 15,
		svg: {
			width: 16,
			height: 16,
		},
		"&:focus-visible": {
			outline: `2px solid ${theme.primaryColorFocus || theme.primaryColor || "#3f51b5"}`,
			outlineOffset: 2,
		},
	};
});

const RatingUpIcon = styled(RatingUp)(({ theme, selected }: any) => ({
	path: {
		fill: selected ? theme.primaryContrastColor : theme.black10 || "#1a1a1a",
	},
}));

const RatingDownIcon = styled(RatingDown)(({ theme, selected }: any) => ({
	path: {
		fill: selected ? theme.primaryContrastColor : theme.black10 || "#1a1a1a",
	},
}));

const RatingTextContainer = styled.div({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "flex-start",
	gap: 16,
	alignSelf: "stretch",
	width: "100%",
});

const RatingTitle = styled.h3(({ theme }) => ({
	fontFamily: theme.fontFamily || "Figtree, sans-serif",
	fontSize: "1rem", // 16px
	fontWeight: 600,
	lineHeight: "1.4rem", // 22.4px
	margin: 0,
}));

const RatingInput = styled(Textarea)(({ theme }) => ({
    border: `1px solid ${theme.greyColor}`,
	width: "100%",
    borderRadius: 8,
    boxShadow: "0 2px 5px 2px rgba(151, 124, 156, 0.1), 0 4px 5px 4px rgba(203, 195, 212, 0.1), 0 5px 5px 1px rgba(216, 212, 221, 0.1), 0 5px 5px 0 rgba(151, 124, 156, 0.10), 0 8px 5px 0 rgba(203, 195, 212, 0.1), 0 12px 5px 0 rgba(216, 212, 221, 0.10)",
    padding: 8,
    backgroundColor: "#f8f8f8",

    "&:focus": {
        boxShadow: `0 0 0 2px ${theme.primaryWeakColor}`,
    },
}));

const SendButton = styled(PrimaryButton)(({ theme }: any) => ({
	width: "100%",
	maxWidth: "none !important",
	boxSizing: "border-box",
	borderRadius: 10,
	fontSize: 14,
	textTransform: "none",
	fontWeight: 600,
	color: "#ffffff",
	"&:disabled": {
		background: "#E6E6E6",
		opacity: 1,

	},
	"&:focus-visible": {
		outline: `2px solid ${theme.primaryColorFocus || theme.primaryColor || "#3f51b5"}`,
		outlineOffset: 2,
	},
}));

type TRatingValue = 1 | -1 | null;

interface IRatingWidgetProps {
	ratingTitleText: string;
	ratingCommentText: string;
	/** When true, a feedback status pill is displayed in the chat history */
	showRatingStatus: boolean;
	buttonText?: string;
	ratingEventBannerText?: string;
	onSendRating: (props: { rating: number | null; comment: string; showRatingStatus: boolean }) => void;
	selectedRating?: number;
	selectedRatingComment?: string;
	isSimulation?: boolean;
}

// This component is used only for the simulator transcript!!!
const RatingWidget = (props: IRatingWidgetProps) => {
	const {
		ratingTitleText,
		ratingCommentText,
		showRatingStatus,
		buttonText,
		onSendRating,
		selectedRating,
		selectedRatingComment,
		isSimulation,
	} = props;
	// Initialize with selectedRating if provided (convert to TRatingValue: 1 | -1 | null)
	const initialRating: TRatingValue = selectedRating === 1 || selectedRating === -1 ? selectedRating : null;
	const [ratingValue, setRatingValue] = useState<TRatingValue>(initialRating);
	const [ratingText, setRatingText] = useState(selectedRatingComment || "");

	//if the rating is already selected, we're in the simulation mode and the widget should be disabled
	const isDisabled = isSimulation;
	const disableSendButton = (ratingValue !== -1 && ratingValue !== 1) || isDisabled;

	const handleSubmitFeedback = () => {
		onSendRating({ rating: ratingValue, comment: ratingText, showRatingStatus });
		setRatingValue(null);
		setRatingText("");
	};

	return (
		<RatingWidgetRoot className="webchat-rating-widget-root">
			<RatingTitle className="webchat-rating-widget-title">
				{ratingTitleText}
			</RatingTitle>
			<RatingButtonContainer className="webchat-rating-widget-content-container">
				<RatingButton
					onClick={() => setRatingValue(ratingValue === 1 ? null : 1)}
					className="webchat-rating-widget-thumbs-up-button"
					aria-pressed={ratingValue === 1}
					aria-label={"Like"}
					selected={ratingValue === 1}
					disabled={isDisabled}
				>
					<RatingUpIcon selected={ratingValue === 1} />
				</RatingButton>
				<RatingButton
					onClick={() => setRatingValue(ratingValue === -1 ? null : -1)}
					className="webchat-rating-widget-thumbs-down-button"
					aria-pressed={ratingValue === -1}
					aria-label={"Dislike"}
					selected={ratingValue === -1}
					disabled={isDisabled}
				>
					<RatingDownIcon selected={ratingValue === -1} />
				</RatingButton>
			</RatingButtonContainer>
			<RatingTextContainer>
				  <RatingInput
                            data-test="rating-input"
                            type="text"
                            value={ratingText}
							onChange={e => setRatingText(e.target.value)}
                            className="webchat-rating-dialog-comment-input-field"
                            autoFocus
                            maxlength={500}
                            rows={3}
							label={ratingCommentText}
							disabled={isDisabled}
                        />
				<SendButton
					className={`webchat-rating-widget-send-button ${
						disableSendButton ? "disabled" : "active"
					}`}
					disabled={disableSendButton}
					onClick={handleSubmitFeedback}
				>
					{buttonText || "Send feedback"}
				</SendButton>
			</RatingTextContainer>
		</RatingWidgetRoot>
	);
};

export default RatingWidget;