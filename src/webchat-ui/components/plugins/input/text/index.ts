import { TextInput } from "./TextInput";
import { InputPlugin } from "../../../../../common/interfaces/input-plugin";
import KeyboardIcon from "./baseline-keyboard-24px.svg";

const textInputPlugin: InputPlugin = {
  name: "text-input",
  type: "select",
  id: "text",
  component: TextInput,
  icon: KeyboardIcon,
};

export default textInputPlugin;
