import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';

export const getMessengerFrame = ({ React, styled }: MessagePluginFactoryProps) => {
    const MessengerFrame = styled.div(({ theme }) => ({
        width: 250,
        borderRadius: theme.unitSize * 2,
        overflow: 'hidden',
        backgroundColor: 'hsl(0, 0%, 95%)',
        color: 'hsla(0, 0%, 0%, .8)',
        boxShadow: theme.messageShadow
    }));

    return MessengerFrame;
}