import { registerInputPlugin } from "../helper";
import { getSpeechInput } from "./SpeechInput";
import { InputPlugin, InputPluginFactory } from "../../common/interfaces/input-plugin";
import Button from "./Button";

export const speechInputPlugin: InputPluginFactory = ({ React, styled }) => {
    const icon = require('./baseline-keyboard_voice-24px.svg');

    const Input = getSpeechInput({ React, styled })

    return {
        type: 'select',
        id: 'speech',
        component: Input,
        icon
    }
}

registerInputPlugin(speechInputPlugin);

export default speechInputPlugin