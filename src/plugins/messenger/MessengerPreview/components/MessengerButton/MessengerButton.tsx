
import { IFBMButton } from '../../interfaces/Button.interface';
import { getButtonLabel } from './lib/messengerButtonHelpers';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { IWebchatConfig } from '../../../../../common/interfaces/webchat-config';
import { sanitizeHTML } from '../../../../../webchat/helper/sanitize';

interface IMessengerButtonProps {
    button: IFBMButton;
    config: IWebchatConfig;
    position?: number;
    total?: number
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

    const MessengerButton = ({ button, position, total, ...props }: IMessengerButtonProps & React.ComponentProps<typeof Button>) => {		
        const buttonType = button.type;
        const isWebURL = buttonType === "web_url";
        const buttonTitle = button.title ? button.title + ". " : "";
        const isWebURLButtonTargetBlank = button.target !== "_self";
        const buttonTitleWithTarget = isWebURL && isWebURLButtonTargetBlank ? buttonTitle + "Opens in new tab" : button.title;
        const ariaLabel = total > 1 ? `Item ${position} of ${total}: ${buttonTitleWithTarget}` : buttonTitleWithTarget;
    
        const buttonLabel = getButtonLabel(button);
        const __html = props.config.settings.disableHtmlContentSanitization ? buttonLabel : sanitizeHTML(buttonLabel)

        return (
            <Button 
                {...props} 
                dangerouslySetInnerHTML={{__html}} 
                role={isWebURL ? "link" : undefined} 
                aria-label={ariaLabel}
            />
        )
    }

    return MessengerButton;
}