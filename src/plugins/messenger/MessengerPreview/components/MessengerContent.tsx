import { MessagePluginFactoryProps } from '../../../../common/interfaces/message-plugin';

export const getMessengerContent = ({ styled }: MessagePluginFactoryProps) => {
    const MessengerContent = styled.div({
        padding: 10,
        wordWrap: 'break-word'
    });

    return MessengerContent;
}