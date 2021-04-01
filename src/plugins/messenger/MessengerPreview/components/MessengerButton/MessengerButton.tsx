
import { IFBMButton } from '../../interfaces/Button.interface';
import { getButtonLabel } from './lib/messengerButtonHelpers';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';

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
		
		'&:focus': {
            backgroundColor: 'hsl(0, 0%, 92%)'
        },

        '&:active': {
            backgroundColor: 'hsl(0, 0%, 92%)'
        }
    }));

    const MessengerButton = ({ button, ...props }: IMessengerButtonProps & React.ComponentProps<typeof Button>) => {		
        const buttonType = button.type;
        const isWebURL = buttonType === "web_url";
        const ariaLabel = isWebURL ? button.title + " .Opens in new tab" : undefined;

        return (
            <Button 
                {...props} 
                dangerouslySetInnerHTML={{__html: getButtonLabel(button)}} 
                role={isWebURL ? "link" : undefined} 
                aria-label={ariaLabel}
            />
        )
    }

    return MessengerButton;
}