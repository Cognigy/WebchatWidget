import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';
import { IWithMessageColor } from '../interfaces/MessageColor.interface';

export const getMessengerBubble = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerBubble = styled.div<IWithMessageColor>(({ theme, messageColor }) => ({
        padding: `${theme.unitSize * 2}px ${theme.unitSize * 3}px`,
    
        // prevent horizontal overflow
        minWidth: 0,
        wordBreak: 'break-word',
    
        // render line breaks in text
        whiteSpace: 'pre-wrap',
    
        borderRadius: theme.unitSize * 2,
        borderBottomLeftRadius: 0,
        boxShadow: theme.messageShadow,
    
    
        background: messageColor === 'neutral' ? 'white' :  theme.primaryGradient,
        color: messageColor === 'neutral' ? theme.greyContrastColor :  theme.primaryContrastColor
    }));

    return MessengerBubble;
}