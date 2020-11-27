import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";

export const getMessengerListButton = ({ React, styled }: MessagePluginFactoryProps) => {
    const Button = styled.button(({ theme }) => ({
        backgroundColor: 'transparent',
        borderRadius: theme.unitSize,
        padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
        marginTop: theme.unitSize,
        color: theme.primaryColor,
        border: `1px solid ${theme.primaryColor}`,
        cursor: 'pointer',
        outline: 'none',

        '&:hover': {
            backgroundColor: 'hsl(0, 0%, 97%)'
		},
		
		'&:focus': {
            backgroundColor: 'hsl(0, 0%, 92%)'
        },

        '&:active': {
            backgroundColor: 'hsl(0, 0%, 92%)'
        }
    }));

    return Button;
}