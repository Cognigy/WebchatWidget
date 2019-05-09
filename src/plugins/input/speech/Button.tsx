import * as React from 'react';
import { InputButtonProps } from '../../../common/interfaces/input-plugin';
import VoiceIcon from './baseline-keyboard_voice-24px.svg';
import IconButton from '../../../webchat-ui/components/presentational/IconButton';

export default ({ active, ...props }: InputButtonProps) => (
    <IconButton
        {...props}
        type='button'
        disabled={active}
        color='primary'
    >
        <VoiceIcon />
    </IconButton>
);