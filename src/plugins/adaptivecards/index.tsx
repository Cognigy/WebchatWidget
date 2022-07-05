import React, { useCallback, useEffect, useMemo } from 'react';
import AdaptiveCard from './components/Adaptivecard'
import { registerMessagePlugin } from '../helper';

import { updateAdaptiveCardCSSCheaply } from './styles';

const isAdaptiveCard = (message) => {
    if (message.data?._cognigy?._webchat?.adaptiveCard || message.data?._plugin?.type === "adaptivecards") {
        return true;
    }
    return false;
}

const AdaptiveCards = (props) => {

    const { theme, onSendMessage, message } = props;

    useEffect(() => {
        updateAdaptiveCardCSSCheaply(theme);
    }, []);

    const cardPayload = message.data?._plugin?.payload || message.data?._cognigy?._webchat?.adaptiveCard;

    const onExecuteAction = useCallback((action) => {
        switch (action._propertyBag?.type) {
            case "Action.Submit": {
                onSendMessage("", {
                    adaptivecards: action._processedData
                });

                return;
            }

            case "Action.OpenUrl": {
                const url = action._propertyBag?.url;
                window.open(url, "_blank");

                return;
            }
        }
    }, [onSendMessage]);

    const card = useMemo(() => {
        const hostConfig = {
            "fontFamily": theme.fontFamily
        }

        return (
            <AdaptiveCard
                payload={cardPayload}
                onExecuteAction={onExecuteAction}
                hostConfig={hostConfig}
            />
        );
    }, [cardPayload]);

    return (
        <div className='adaptivecard-wrapper internal'>
            {card}
        </div>
    )
}

const adaptivecardsPlugin = {
    match: isAdaptiveCard,
    component: AdaptiveCards,
    options: {
        fullwidth: true
    }
}

registerMessagePlugin(adaptivecardsPlugin);
