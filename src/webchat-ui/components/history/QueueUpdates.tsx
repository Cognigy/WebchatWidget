import React, { FC } from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import { useSelector } from "../../../webchat/helper/useSelector";
import { formatWaitTime } from "../../utils/formatWaitTime";

const StyledQueueUpdates = styled.div(({ theme }) => ({
	marginBottom: "var(--webchat-message-margin-block, 24px)",
	marginInline: "var(--webchat-message-margin-inline, 20px)",
	padding: "12px",
	textAlign: "center",
	color: theme.black40,
	"& span": {
		display: "block",
	},
}));

const QueueUpdates: FC = () => {
	const queueUpdates = useSelector(state => state.queueUpdates ?? {});

	if (!queueUpdates?.isQueueActive) return null;

	return (
		<StyledQueueUpdates>
			<Typography
				variant="body-regular"
				id="webchatQueueUpdates"
				className="webchat-queue-updates"
				component="div"
			>
				{queueUpdates?.alternativeText ? (
					<span>{queueUpdates.alternativeText}</span>
				) : (
					<>
						<span>
							Current queue position: <strong>{queueUpdates?.position || ""}</strong>
						</span>
						<span>
							Estimated waiting time:{" "}
							<strong>{formatWaitTime(queueUpdates?.estimatedWaitTime)}</strong>
						</span>
					</>
				)}
			</Typography>
		</StyledQueueUpdates>
	);
};

export default QueueUpdates;
