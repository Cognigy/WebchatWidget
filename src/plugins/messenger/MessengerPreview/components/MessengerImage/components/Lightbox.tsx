import { useMessangerImageContext } from '../MessangerImageContext';
import { MessagePluginFactoryProps } from "../../../../../../common/interfaces/message-plugin";
import { getLightBoxHeader } from '../../MessengerImage/components/LightBoxHeader';

export const getLightbox = ({ React, styled }: MessagePluginFactoryProps) => {

    const LightBoxHeader = getLightBoxHeader({ React, styled });

    const Wrapper = styled.div({
        position: 'fixed',
        zIndex: 5000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        touchAction: 'none',
        overflow: 'hidden',
    })

    const Content = styled.div({
        position: 'relative',
        height: '100%',
        width: '100%',
    })

    const FullImage = styled.img({
        position: 'absolute',
        top: '50%',
        left: '50%',
        maxWidth: '100%',
        maxHeight: '100%',
        height: 'auto',
        transform: 'translate3d(-50%, -50%, 0)',
        overflow: 'hidden',
    })

    const LightBox = () => {
        const { url, altText, onClose } = useMessangerImageContext();

        const handleOnClickBackdrop = (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            onClose();
        }

        const handleOnClickImage = (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
        }

        const handleOnSwipeImage = (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            onClose();
        }

        return (
            <Wrapper>
                <Content onClick={handleOnClickBackdrop}>
                    <FullImage
                        alt={altText || "Attachment Full"}
                        src={url}
                        onClick={handleOnClickImage}
                        onTouchMove={handleOnSwipeImage}
                    />
                </Content>
                <LightBoxHeader />
            </Wrapper>
        );
    };

    return LightBox;
};
