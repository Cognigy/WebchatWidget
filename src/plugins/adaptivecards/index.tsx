import React, { useCallback, useEffect, useMemo } from 'react';
import AdaptiveCard from './components/Adaptivecard'
import { registerMessagePlugin } from '../helper';
import { IMessage } from "../../common/interfaces/message";
import { IWebchatConfig } from "../../common/interfaces/webchat-config";
import { updateAdaptiveCardCSSCheaply } from './styles';


const isAdaptiveCard = (message: IMessage, config: IWebchatConfig) => {

    // configurations that should use adaptive cards plugin 
    const _webchat = message.data?._cognigy?._webchat?.adaptiveCard;
    const _defaultPreview = message.data?._cognigy?._defaultPreview?.adaptiveCard;
    const _plugin = message.data?._plugin?.type === "adaptivecards";
    const defaultPreviewEnabled = config.settings.enableDefaultPreview;

    if (message.data?._cognigy?._defaultPreview?.message && defaultPreviewEnabled){
        return false;
    }

    if (_defaultPreview && defaultPreviewEnabled ||
        _webchat && _defaultPreview && !defaultPreviewEnabled || 
        _webchat || 
        _plugin){
        return true;
    }
    
    return false;
}

const AdaptiveCards = (props) => {

    const { theme, onSendMessage, message, config } = props;

    const getCardPayload = (message: IMessage) => {

        const _webchat = message.data?._cognigy?._webchat?.adaptiveCard;
        const _defaultPreview = message.data?._cognigy?._defaultPreview?.adaptiveCard;
        const _plugin = message.data?._plugin?.payload;
        const defaultPreviewEnabled = config.settings.enableDefaultPreview;

        if (_webchat && _defaultPreview  && !defaultPreviewEnabled){
            return _webchat
        }
        if (_defaultPreview && defaultPreviewEnabled){
            return _defaultPreview
        }
        return _plugin || _webchat
    }
    

    useEffect(() => {
        updateAdaptiveCardCSSCheaply(theme);
    }, []);

    const cardPayload = getCardPayload(message);

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
