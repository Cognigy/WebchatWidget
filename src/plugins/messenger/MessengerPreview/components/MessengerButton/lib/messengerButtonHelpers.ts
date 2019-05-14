import { IFBMButton, IFBMPostbackButton } from "../../../interfaces/Button.interface";

export const getButtonLabel = (button: IFBMButton): string => {
    let { title } = button as IFBMPostbackButton;

    if (!title) {
        switch (button.type) {
            case 'account_link':
                return 'Login';

            case 'account_unlink':
                return 'Logout';

            case 'element_share':
                return 'Share';

            case 'phone_number':
                return 'Call';
        }
    }

    return title;
}