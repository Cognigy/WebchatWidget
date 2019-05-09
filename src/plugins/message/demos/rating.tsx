import * as React from 'react';
import { registerMessagePlugin } from "../../helper";

const Rating = ({ onSendMessage }) => {
    const sendRating = rate => () => onSendMessage('', { rate });

    return (
        <div>
            <button onClick={sendRating(1)}>★</button>
            <button onClick={sendRating(2)}>★</button>
            <button onClick={sendRating(3)}>★</button>
            <button onClick={sendRating(4)}>★</button>
            <button onClick={sendRating(5)}>★</button>
        </div>
    )
}

const ratingPlugin = {
    match: 'rating',
    component: Rating
}

registerMessagePlugin(ratingPlugin);