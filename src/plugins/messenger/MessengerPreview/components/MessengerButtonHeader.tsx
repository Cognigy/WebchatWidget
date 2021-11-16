import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';
import { IWithMessageColor } from '../interfaces/MessageColor.interface';

export const getMessengerButtonHeader = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerFrame = styled.div<IWithMessageColor>(({ theme, messageColor }) => ({
        width: 250,
        borderRadius: theme.unitSize * 2,
        overflow: 'hidden',
        background: messageColor === 'neutral' ? 'white' : theme.primaryGradient,
        color: messageColor === 'neutral' ? theme.greyContrastColor :  theme.primaryContrastColor,
        boxShadow: theme.messageShadow
    }));

    return MessengerFrame;
}