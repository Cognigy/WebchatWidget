import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';

const componentStyles = (({ theme }) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${theme.primaryColor}`,
    borderRadius: theme.unitSize * 5,
    padding: `${theme.unitSize / 2}px ${theme.unitSize * 2}px`,
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

export const getMessengerQuickReply = ({ React, styled }: MessagePluginFactoryProps) => {

    const MessengerQuickReply = styled.button(componentStyles, {
        minHeight: 40,
    });

    return MessengerQuickReply;
}

export const getMessengerPhoneNumberQuickReply = ({ React, styled }: MessagePluginFactoryProps) => {

    const MessengerPhoneNumberQuickReply = styled.a(componentStyles, {
        minHeight: 30,
        display: 'inline-flex',
        textDecoration: 'none',
        justifyContent: 'center',
        alignItems: 'center'
    });

    return MessengerPhoneNumberQuickReply;
}