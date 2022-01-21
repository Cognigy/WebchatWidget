import GetStartedInput from "./GetStartedInput";
import { InputRule, InputPlugin } from "../../common/interfaces/input-plugin";
import { registerInputPlugin } from "../helper";

const rule: InputRule = ({ config: { settings: { startBehavior, getStartedButtonText, getStartedData, getStartedPayload, getStartedText } }, messages }) =>
    (messages.length === 0 || messages.length === 1 && messages[0].source === 'engagement')
    && startBehavior === 'button'
    && !!getStartedPayload
    && (!!getStartedButtonText || !!getStartedText || !!getStartedData)

const getStartedInputPlugin: InputPlugin = {
    type: 'rule',
    rule,
    component: GetStartedInput
};

registerInputPlugin(getStartedInputPlugin);

export default getStartedInputPlugin;