import * as React from 'react';
import { registerMessagePlugin } from "../../helper";

const Rating = ({ onSendMessage, attributes = {} }) => {
    const sendRating = rate => () => onSendMessage('', { rate });

    return (
        <div {...attributes}>
            <button onClick={sendRating(1)}>★</button>
            <button onClick={sendRating(2)}>★</button>
            <button onClick={sendRating(3)}>★</button>
            <button onClick={sendRating(4)}>★</button>
            <button onClick={sendRating(5)}>★</button>
        </div>
    )
}

const ratingPlugin = {
    match: 'rating-fullscreen',
    component: Rating,
    options: {
        fullscreen: true
    }
}

registerMessagePlugin(ratingPlugin);