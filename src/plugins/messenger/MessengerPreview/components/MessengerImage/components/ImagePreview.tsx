import { useMessangerImageContext } from '../MessangerImageContext';
import { MessagePluginFactoryProps } from "../../../../../../common/interfaces/message-plugin";
import { getBackgroundImage } from '../../../lib/css';

export const getImagePreview = ({ React, styled }: MessagePluginFactoryProps) => {

    const templateStyle = ({ template = 'media' }) => ({
        media: {
            paddingTop: "75%"
        },
        list: {
            paddingTop: "50%"
        },
        generic: {
            paddingTop: "50%",
            display: "table",
            width: "100%"
        }
    })[template];

    const FixedImage = styled.div({
        backgroundSize: "cover",
        backgroundPosition: "center center",
        cursor: 'pointer'
    }, templateStyle)

    const FlexImage = styled.img({
        display: 'block',
        width: '100%',
        cursor: 'pointer'
    })

    const ImagePreview = () => {
        const { config, url, altText, template, onExpand } = useMessangerImageContext();

        return config.settings.dynamicImageAspectRatio ? (
                <FlexImage
                    src={url}
                    alt={altText || "Attachment"}
                    onClick={() => onExpand()}
                    data-test="image-preview"
                />
            ) : (
                <FixedImage
                    style={{ backgroundImage: getBackgroundImage(url) }}
                    onClick={() => onExpand()}
                    template={template}
                    data-test="image-preview"
                >   
                    <span role="img" aria-label={altText || "Attachment Image"} />
                </FixedImage>
            )
    };

    return ImagePreview;
};
