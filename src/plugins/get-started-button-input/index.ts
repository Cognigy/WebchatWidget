import GetStartedInput from "./GetStartedInput";
import { InputRule, InputPlugin } from "../../common/interfaces/input-plugin";
import { registerInputPlugin } from "../helper";

const rule: InputRule = ({ config: { settings: { startBehavior, getStartedButtonText, getStartedPayload, getStartedText } }, messages }) =>
    messages.length === 0
    && startBehavior === 'button'
    && !!getStartedPayload
    && (!!getStartedButtonText || !!getStartedText)

const getStartedInputPlugin: InputPlugin = {
    type: 'rule',
    rule,
    component: GetStartedInput
};

registerInputPlugin(getStartedInputPlugin);

export default getStartedInputPlugin;