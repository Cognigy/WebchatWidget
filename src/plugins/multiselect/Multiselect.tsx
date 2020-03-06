import React, { FC } from 'react';
import { MessageProps } from '../../webchat-ui/components/plugins/MessagePluginRenderer';
import MultiselectDialog from './components/MultiselectDialog';
import ToolbarSecondaryButton from '../../webchat-ui/components/presentational/ToolbarSecondaryButton';

const Multiselect: FC<MessageProps> = props => {
    if (!props.isFullscreen) {
        return (
            <ToolbarSecondaryButton onClick={props.onSetFullscreen}>open selection</ToolbarSecondaryButton>
        )
    }

    return <MultiselectDialog {...props as any} />
}

export default Multiselect;