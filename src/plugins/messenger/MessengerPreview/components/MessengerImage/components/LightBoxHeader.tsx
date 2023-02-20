import { useMessangerImageContext } from '../MessangerImageContext';
import { MessagePluginFactoryProps } from "../../../../../../common/interfaces/message-plugin";
import CloseIcon from '../../../../../../webchat-ui/assets/baseline-close-24px.svg';
import DownloadIcon from '../../../../../../webchat-ui/assets/baseline-download-24px.svg';

export const getLightBoxHeader = ({ React, styled }: MessagePluginFactoryProps) => {

    const Header = styled.div({
        position: 'absolute',
        top: 0,
        height: '56px',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between'
    })

    const Caption = styled.div({
        display: 'flex',
        alignItems: 'center',
        marginLeft: '15px',
        color: 'white'
    })

    const IconsGroup = styled.div({
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px'
    })

    const Icon = styled.a({
        display: 'inline-block',
        fontSize: '40px',
        cursor: 'pointer',
        lineHeight: '40px',
        boxSizing: 'border-box',
        border: 'none',
        padding: '0px 5px 0px 5px',
        marginLeft: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        "& svg": {
           fill: 'white'
        },
    })

    const LightBoxHeader = () => {
        const { url, altText, onClose } = useMessangerImageContext();

        const handleDownload = () => {
            const isSameDomain = document.location.hostname === new URL(url, document.location.toString()).hostname;
            if (!isSameDomain) {
                window.open(url, '_blank');
            }
        }

        return (
            <Header>
                <Caption>{altText}</Caption>
                <IconsGroup>
                    <Icon onClick={handleDownload} download>
                        <DownloadIcon />
                    </Icon>
                    <Icon onClick={onClose}>
                        <CloseIcon />
                    </Icon>
                </IconsGroup>
            </Header>
        )
    };

    return LightBoxHeader;
};
