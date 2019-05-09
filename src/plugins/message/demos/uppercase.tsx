import * as React from 'react';
import { registerMessagePlugin } from "../../helper";

const Uppercase = ({ message }) => (
    <span>
        {message.text.toUpperCase()}
    </span>
)

const reversePlugin = {
    match: 'uppercase',
    component: Uppercase
}

registerMessagePlugin(reversePlugin);