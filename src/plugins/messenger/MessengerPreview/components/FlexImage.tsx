import { MessagePluginFactoryProps } from "../../../../common/interfaces/message-plugin";

export const getFlexImage = ({ styled }: MessagePluginFactoryProps) => {
    const FlexImage = styled.img({
        display: 'block',
        width: '100%'
    })

    return FlexImage;
}