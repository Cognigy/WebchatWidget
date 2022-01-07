import * as React from 'react';
import AdaptiveCard from './components/Adaptivecard'
import { registerMessagePlugin } from '../helper';

import { updateAdaptiveCardCSSCheaply } from './styles';

const AdaptiveCards = (props) => {
    const { theme, onSendMessage, message } = props;

    React.useEffect(() => {
        updateAdaptiveCardCSSCheaply(theme);
    }, []);

    const cardPayload = message.data._plugin.payload;

    const card = React.useMemo(() => {
        // const onActionSubmit = (params) => {
        //     onSendMessage("", { "adaptivecards": params && params.data });
        // }

        // const hostConfig = {
        //     "fontFamily": theme.fontFamily
        // }

        return (
            <AdaptiveCard
                payload={cardPayload}
                // onActionSubmit={onActionSubmit}
                // hostConfig={hostConfig}
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
