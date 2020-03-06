import React, { FC } from 'react';
import { MessageProps } from '../../webchat-ui/components/plugins/MessagePluginRenderer';
import MultiselectDialog from './components/MultiselectDialog';
import ToolbarSecondaryButton from '../../webchat-ui/components/presentational/ToolbarSecondaryButton';
import { MessageComponentProps } from '../../common/interfaces/message-plugin';
import { IBotMessage } from '../../common/interfaces/message';


interface IMultiselectMessage extends IBotMessage {
    data: {
        _plugin: {
            type: 'multiselect',
            options: string[];
            openButtonLabel: string;
            cancelButtonLabel: string;
            submitButtonLabel: string;
        }
    }
}

export interface IMultiselectProps extends MessageComponentProps {
    message: IMultiselectMessage;
}

const Multiselect: FC<IMultiselectProps> = props => {
    if (!props.isFullscreen) {
        return (
            <ToolbarSecondaryButton onClick={props.onSetFullscreen}>
                {props.message.data._plugin.openButtonLabel}
            </ToolbarSecondaryButton>
        )
    }

    return <MultiselectDialog {...props} />
}

export default Multiselect;