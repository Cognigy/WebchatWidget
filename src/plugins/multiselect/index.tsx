import { MessagePlugin } from "../../common/interfaces/message-plugin";
import Multiselect from "./Multiselect";
import { registerMessagePlugin } from "../helper";

import './styles.css';


const multiselectPlugin: MessagePlugin = {
    match: 'multiselect',
    component: Multiselect
};

registerMessagePlugin(multiselectPlugin);

// MAKE IT A DIALOG!