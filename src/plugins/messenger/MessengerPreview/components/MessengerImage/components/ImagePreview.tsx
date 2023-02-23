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
        cursor: 'pointer',
        "&:hover": {
            opacity: '.8'
        },
        "&:focus": {
            opacity: '.8',
            outline: 'none'
        },
    }, templateStyle);

    const FlexImage = styled.img({
        display: 'block',
        width: '100%',
        cursor: 'pointer'
    })

    const ImagePreview = () => {
        const { config, url, altText, template, onExpand } = useMessangerImageContext();

        const handleKeyDown = (event: KeyboardEvent) => {
            event.code === "Enter" && onExpand && onExpand();
        }

        return config.settings.dynamicImageAspectRatio ? (
                <div tabIndex={0} role="button" aria-label="View Image in fullsize" onClick={() => onExpand()}>
                    <FlexImage
                    src={url}
                    alt={altText || "Attachment"}
                    data-test="image-preview"
                    onKeyDown={handleKeyDown}
                    />
                </div>
            ) : (
                <FixedImage
                    style={{ backgroundImage: getBackgroundImage(url) }}
                    onClick={() => onExpand()}
                    template={template}
                    data-test="image-preview"
                    tabIndex="0"
                    onKeyDown={handleKeyDown}
                    role="button"
                    aria-label="View Image in fullsize"
                >   
                    <span role="img" aria-label={altText || "Attachment Image"} />
                </FixedImage>
            )
    };

    return ImagePreview;
};
