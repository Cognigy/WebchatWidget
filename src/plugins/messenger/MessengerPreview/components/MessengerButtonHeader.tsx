import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';

export const getMessengerButtonHeader = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerFrame = styled.div(({ theme }) => ({
        width: 250,
        borderRadius: theme.unitSize * 2,
        overflow: 'hidden',
        background: theme.primaryGradient,
        color: theme.primaryContrastColor,
        boxShadow: theme.messageShadow
    }));

    return MessengerFrame;
}