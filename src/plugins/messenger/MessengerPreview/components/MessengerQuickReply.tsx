import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';

export const getMessengerQuickReply = ({ React, styled }: MessagePluginFactoryProps) => {

    const MessengerQuickReply = styled.button(({ theme }) => ({
        backgroundColor: 'transparent',
        border: `1px solid ${theme.primaryColor}`,
        borderRadius: theme.unitSize * 5,
        padding: `${theme.unitSize / 2}px ${theme.unitSize * 2}px`,
        minHeight: theme.unitSize * 5,
        minWidth: theme.unitSize * 5,
        fontSize: 15,
        color: theme.primaryColor,
        cursor: 'pointer',
        outline: 'none',
        transition: 'transform .1s ease-out',

        '&:hover': {
            borderColor: theme.primaryStrongColor,
            color: theme.primaryStrongColor,
            transform: 'translate(0px, -1px)'
		},
		
		'&:focus': {
			outline: 'none',
			boxShadow: `0 0 3px 1px ${theme.primaryWeakColor}`,
        },

        '&:active': {
            transform: 'translate(0px, 0px)'
        }
    }));

    return MessengerQuickReply;
}