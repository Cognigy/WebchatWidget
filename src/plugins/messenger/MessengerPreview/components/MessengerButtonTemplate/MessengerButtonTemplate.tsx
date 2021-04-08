import { IFBMButtonTemplatePayload } from '../../interfaces/ButtonTemplatePayload.interface';
import { IWithFBMActionEventHandler } from '../../MessengerPreview.interface';
import { getDivider } from '../Divider';
import { MessagePluginFactoryProps } from '../../../../../common/interfaces/message-plugin';
import { getMessengerButton } from '../MessengerButton/MessengerButton';
import { getMessengerButtonHeader } from '../MessengerButtonHeader';
import uuid from "uuid";

interface IMessengerButtonTemplateProps extends IWithFBMActionEventHandler {
    payload: IFBMButtonTemplatePayload;
}

export const getMessengerButtonTemplate = ({
    React,
    styled
}: MessagePluginFactoryProps) => {
    const MessengerButtonHeader = getMessengerButtonHeader({ React, styled });
    const MessengerButton = getMessengerButton({ React, styled });
    const Divider = getDivider({ React, styled });

    const Text = styled.div(({ theme }) => ({
        padding: `${theme.unitSize * 2}px ${theme.unitSize * 3}px`,
        whiteSpace: "pre-line"
    }));

    const MessengerButtonTemplate = ({
        payload,
        onAction,
        ...divProps
    }: IMessengerButtonTemplateProps & React.HTMLProps<HTMLDivElement>) => {
        const { text, buttons } = payload;
        const webchatButtonTemplateTextId = `webchatButtonTemplateHeader-${uuid.v4()}`;
        const buttonGroupAriaLabelledby = text ? webchatButtonTemplateTextId : undefined;
        const a11yProps = buttons?.length > 1 ? {role: "group", "aria-labelledby": buttonGroupAriaLabelledby} : {};

        return (
            <MessengerButtonHeader {...divProps} className="webchat-buttons-template-root">
                {text && <Text className="webchat-buttons-template-header" dangerouslySetInnerHTML={{__html: text}} id={webchatButtonTemplateTextId} />}
                <div {...a11yProps}>
					{buttons.map((button, index) => (
						<React.Fragment key={index}>
							<Divider />
							<MessengerButton
								button={button}
								onClick={e => onAction(e, button)}
								className="webchat-buttons-template-button"
							/>
						</React.Fragment>
					))}
				</div>
            </MessengerButtonHeader>
        );
    };

    return MessengerButtonTemplate;
};
