import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { TypingIndicator as ComponentsTypingIndicator } from "@cognigy/chat-components";

import { useIsMounted } from "../../utils/is-mounted";
import { TSourceDirection } from "../../../common/interfaces/webchat-config";

interface ITypingIndicatorProps {
	active: boolean;
	delay?: number;
	direction?: TSourceDirection;
}

const ChatTypingIndicator = styled(ComponentsTypingIndicator)({
	marginBlock: 0,
});

const HiddenChatTypingIndicator = styled(ChatTypingIndicator)({
	visibility: "hidden",
});

const TypingIndicator: FC<ITypingIndicatorProps> = props => {
	const { active, delay, direction } = props;

	const isMounted = useIsMounted();

	/**
	 * "isVisible" is a debounced copy of "active",
	 * which will switch to "true" immediately, but only
	 * switch to "false" after a certain "debounce time"
	 *
	 * Example Timeline: (- is false, + is true)
	 * -----+++--++++++---++++------------++++-----
	 * would become
	 * -----++++++++++++++++++++++--------++++++++-
	 */
	const [isVisible, setIsVisible] = useState(active);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;

		if (active) {
			setIsVisible(active);
		} else {
			timeout = setTimeout(() => {
				if (isMounted.current) setIsVisible(false);
			}, delay || 500);
		}

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [active]);

	if (!isVisible) return <HiddenChatTypingIndicator />;

	return <ChatTypingIndicator direction={direction} />;
};

export default TypingIndicator;
