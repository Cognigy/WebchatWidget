import * as React from 'react';

import { MessageComponentProps, MessagePluginFactory, MessageMatcher } from '../../common/interfaces/message-plugin';
import { registerMessagePlugin } from '../helper';

const processedMessageIds = new Set<string>();

// only read out incoming messages with text
const match: MessageMatcher = ({ text, source }) => source === 'bot' && !!text;

const SpeechOutput = (props: MessageComponentProps) => {
    if (props.message.source === 'bot' && processedMessageIds.has(props.message.traceId)) {
        return null;
    }

    props.message.source === 'bot' && processedMessageIds.add(props.message.traceId);

    // check whether text to speech is available in client
    if (!speechSynthesis)
        return null;

    // check whether text to speech is enabled in endpoint
    if (!props.config.settings.enableTTS)
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

registerMessagePlugin(speechOutput);