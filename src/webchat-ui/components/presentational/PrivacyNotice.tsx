import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import PrimaryButton from "./PrimaryButton";
import TertiaryButton from "./TertiaryButton";

const PrivacyNoticeRoot = styled.div(({ theme }) => ({
	height: "100%",
	width: "100%",
	backgroundColor: theme.white,
	display: "flex",
	flex: "1 0 0",
	flexDirection: "column",
	justifyContent: "space-between",
	alignItems: "center",
	padding: 20,
}));

const PrivacyMessage = styled.div(() => ({
}));

const PrivacyActions = styled.div(() => ({
	display: "flex",
	alignItems: "center",
	flexDirection: "column",
	gap: 16,
}));

const AcceptButton = styled(PrimaryButton)(() => ({
	width: 303,
}));

const PolicyButton = styled(TertiaryButton)(() => ({

}));

interface IPrivacyNoticeProps {
	privacyMessage: string;
	privacyUrl: string;
	onAcceptTerms: () => void;
}

export const PrivacyNotice = (props: IPrivacyNoticeProps) => {
	const { privacyMessage, privacyUrl, onAcceptTerms } = props;

	const handleLinkClick = () => {
		window.open(privacyUrl, "_blank");
	};

	return (
		<PrivacyNoticeRoot className="webchat-privacy-notice-root">
			<PrivacyMessage className="webchat-privacy-notice-message">
				<Typography
					variant="body-regular"
					style={{ whiteSpace: "pre-wrap" }}
				>
					{privacyMessage}
				</Typography>
			</PrivacyMessage>
			<PrivacyActions className="webchat-privacy-notice-actions">
				<AcceptButton
					className="webchat-privacy-notice-accept-button"
					onClick={onAcceptTerms}
				>
					Submit
				</AcceptButton>
				<PolicyButton onClick={handleLinkClick}>
					Privacy policy
				</PolicyButton>
			</PrivacyActions>
		</PrivacyNoticeRoot>
	);
};
