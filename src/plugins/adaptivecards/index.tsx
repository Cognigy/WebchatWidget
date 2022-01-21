import React, { useCallback, useEffect, useMemo } from 'react';
import AdaptiveCard from './components/Adaptivecard'
import { registerMessagePlugin } from '../helper';

import { updateAdaptiveCardCSSCheaply } from './styles';
import { MessageComponentProps } from '../../common/interfaces/message-plugin';

const AdaptiveCards = (props: MessageComponentProps) => {
    const { theme, onSendMessage, message } = props;

    useEffect(() => {
        updateAdaptiveCardCSSCheaply(theme);
    }, []);

    const cardPayload = message.data._plugin.payload;

    const onExecuteAction = useCallback((action) => {
        switch (action.type) {
            case "Action.Submit": {
                onSendMessage("", {
                    adaptivecards: action.data
                });

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
        <div className='adaptivecard-wrapper'>
            {card}
        </div>
    )
}

const adaptivecardsPlugin = {
    match: 'adaptivecards',
    component: AdaptiveCards,
    options: {
        fullwidth: true
    }
}

registerMessagePlugin(adaptivecardsPlugin);
