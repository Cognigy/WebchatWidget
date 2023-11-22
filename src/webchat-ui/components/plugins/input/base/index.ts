import { BaseInput } from "./BaseInput";
import { InputPlugin } from "../../../../../common/interfaces/input-plugin";
import KeyboardIcon from './baseline-keyboard-24px.svg';

const baseInputPlugin: InputPlugin = {
    name: 'text-input',
    type: 'select',
    id: 'text',
	component: BaseInput,
    icon: KeyboardIcon
};

export default baseInputPlugin;