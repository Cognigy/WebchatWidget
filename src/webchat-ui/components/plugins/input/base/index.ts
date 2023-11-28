import { InputPlugin } from "../../../../../common/interfaces/input-plugin";
import KeyboardIcon from './baseline-keyboard-24px.svg';
import { ConnectedBaseInput } from "./ConnectedBaseInput";

const baseInputPlugin: InputPlugin = {
    name: 'text-input',
    type: 'select',
    id: 'text',
	component: ConnectedBaseInput,
    icon: KeyboardIcon
};

export default baseInputPlugin;