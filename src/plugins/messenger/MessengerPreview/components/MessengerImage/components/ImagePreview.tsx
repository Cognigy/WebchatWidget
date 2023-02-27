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

    const FlexImageDiv = styled.div(({ isDownloadable }) => ({
        cursor: isDownloadable ? 'pointer' : 'default',
        "&:hover": {
            opacity: isDownloadable ? '.8' : '1',
        },
        "&:focus": {
            opacity: isDownloadable ? '.8' : '1',
            outline: 'none'
        },
    }));

    const FixedImage = styled(FlexImageDiv)({
        backgroundSize: "cover",
        backgroundPosition: "center center",
    }, templateStyle);

    const FlexImage = styled.img({ 
        display: 'block',
        width: '100%',
        cursor: 'pointer'
    })

    const ImagePreview = () => {
        const { config, url, altText, template, isDownloadable, onExpand } = useMessangerImageContext();

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            event.key === "Enter" && onExpand && onExpand();
        }

        return config.settings.dynamicImageAspectRatio ? (
                <FlexImageDiv
                    tabIndex="0"
                    role="button"
                    aria-label="View Image in fullsize"
                    onClick={() => onExpand()}
                    onKeyDown={handleKeyDown}
                    isDownloadable={isDownloadable}
                >
                    <FlexImage
                        src={url}
                        alt={altText || "Attachment"}
                        data-test="image-preview"
                    />
                </FlexImageDiv>
            ) : (
                <FixedImage
                    style={{ backgroundImage: getBackgroundImage(url) }}
                    onClick={() => onExpand()}
                    template={template}
                    isDownloadable={isDownloadable}
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
