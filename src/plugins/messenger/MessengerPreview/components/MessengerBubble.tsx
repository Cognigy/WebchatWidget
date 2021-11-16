import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';
import { IWithMessageColor } from '../interfaces/MessageColor.interface';
import { IWithMessageDirection } from '../interfaces/MessageDirection.interface';

export const getMessengerBubble = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerBubble = styled.div<IWithMessageColor & IWithMessageDirection>(({ theme, messageColor, messageDirection }) => ({
        padding: `${theme.unitSize * 2}px ${theme.unitSize * 3}px`,
    
        // prevent horizontal overflow
        minWidth: 0,
        wordBreak: 'break-word',
    
        // render line breaks in text
        whiteSpace: 'pre-wrap',
    
        borderRadius: theme.unitSize * 2,
        borderBottomLeftRadius: messageDirection === 'outgoing' ? undefined :  0,
        borderBottomRightRadius: messageDirection === 'outgoing' ? 0 : undefined,
        boxShadow: theme.messageShadow,
    
    
        background: messageColor === 'neutral' ? 'white' :  theme.primaryGradient,
        color: messageColor === 'neutral' ? theme.greyContrastColor :  theme.primaryContrastColor
    }));

    return MessengerBubble;
}