import * as React from 'react';

import { MessageComponentProps, MessageMatcher } from '../../../../common/interfaces/message-plugin';

const processedMessageIds = new Set<string>();

// only read out incoming messages with text
const match: MessageMatcher = ({ text, source }) => source === 'bot' || source === 'engagement' && !!text;

const SpeechOutput = (props: MessageComponentProps) => {
    

    if (processedMessageIds.has(props?.message?.traceId)) {
        return null;
    }

    processedMessageIds.add(props?.message?.traceId);

    // check whether text to speech is available in client
    if (!speechSynthesis)
        return null;

    // we already checked that text exists in the match function
    const text = props.message.text as string;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    speechSynthesis.speak(utterance);

    return null;
}

// make sure to read out messages only once
const MemoizedSpeechOutput = React.memo(SpeechOutput);

const speechOutput = {
    match,
    component: MemoizedSpeechOutput,
    options: {
        passthrough: true,
        fullwidth: true
    }
}

// no need to register the plugin, it's conditionally registered in the WebchatUI.tsx

export default speechOutput;