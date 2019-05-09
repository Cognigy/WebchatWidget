
import { IFBMButton } from '../../interfaces/Button.interface';
import { getButtonLabel } from './lib/messengerButtonHelpers';
import { MessagePluginFactoryProps } from '../../../../../../common/interfaces/message-plugin';

interface IMessengerButtonProps {
    button: IFBMButton;
}

export const getMessengerButton = ({ React, styled }: MessagePluginFactoryProps) => {

    const Button = styled.button(({ theme }) => ({
        display: 'block',
        color: theme.primaryColor,
        border: 'none',
        backgroundColor: 'white',
        width: '100%',
        padding: `10px 20px`,
        fontSize: 15,
        cursor: 'pointer',
        outline: 'none',

        '&:hover': {
            backgroundColor: 'hsl(0, 0%, 97%)'
        },

        '&:active': {
            backgroundColor: 'hsl(0, 0%, 92%)'
        }
    }));

    const MessengerButton = ({ button, ...props }: IMessengerButtonProps & React.ComponentProps<typeof Button>) => (
        <Button {...props}>
            {getButtonLabel(button)}
        </Button>
    )

    return MessengerButton;
}