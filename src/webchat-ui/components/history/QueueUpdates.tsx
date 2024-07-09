import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { Typography } from "@cognigy/chat-components";
import { useSelector } from "../../../webchat/helper/useSelector";
import { formatWaitTime } from "../../utils/formatWaitTime";

const QueueUpdatesWrapper = styled(Typography)(({ theme }) => ({
	marginBottom: "var(--webchat-message-margin-block, 24px)",
	marginInline: "var(--webchat-message-margin-inline, 20px)",
	padding: "12px",
	textAlign: "center",
	color: theme.black40,
	"& span": {
		display: "block",
	},
}));

interface IQueueUpdatesProps {
	handleScroll?: (position?: number, instant?: boolean) => void;
}

const QueueUpdates: FC<IQueueUpdatesProps> = props => {
  const queueUpdates = useSelector(state => state.queueUpdates ?? {});
  const { handleScroll } = props;
  
  useEffect(() => {
    if (queueUpdates?.isQueueActive) {
      handleScroll?.(undefined, true);
    }
  }, [queueUpdates?.isQueueActive]);

  if (!queueUpdates?.isQueueActive) return null;

	return (
		<QueueUpdatesWrapper
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
		</QueueUpdatesWrapper>
	);
};

export default QueueUpdates;
