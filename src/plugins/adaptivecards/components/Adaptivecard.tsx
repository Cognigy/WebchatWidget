import React, { memo, useState } from 'react';

import { FC, useEffect, useRef } from "react";
import { AdaptiveCard as MSAdaptiveCard, HostConfig } from 'adaptivecards';

interface IAdaptiveCardProps {
    payload: any;
    hostConfig?: any;
}

const AdaptiveCard: FC<IAdaptiveCardProps> = (props) => {
    const { payload } = props;

    const [adaptiveCardInstance] = useState(() => new MSAdaptiveCard());
    const wrapperRef = useRef<HTMLDivElement | null>();

    useEffect(() => {
        adaptiveCardInstance.parse(payload);

        if (wrapperRef.current) {
            const cardDOM = adaptiveCardInstance.render();

            if (cardDOM) {
                wrapperRef.current.replaceChildren(cardDOM);
            }
        }
    }, [payload]);

    return <div ref={ref => wrapperRef.current = ref} />;
}

export default memo(AdaptiveCard);