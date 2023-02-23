import { useRef } from "react";
import { useMessangerImageContext } from '../MessangerImageContext';
import { MessagePluginFactoryProps } from "../../../../../../common/interfaces/message-plugin";
import CloseIcon from '../../../../../../webchat-ui/assets/baseline-close-24px.svg';
import DownloadIcon from '../../../../../../webchat-ui/assets/baseline-download-24px.svg';

export const getLightBoxHeader = ({ React, styled }: MessagePluginFactoryProps) => {

    const Header = styled.div(({ theme }) => ({
        position: 'absolute',
        top: 0,
        height: '56px',
        width: '100%',
        backgroundColor: theme.primaryColor,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between'
    }))

    const Caption = styled.div({
        display: 'flex',
        alignItems: 'center',
        marginLeft: '15px',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px'
    })

    const IconsGroup = styled.div({
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px'
    })

    const Icon = styled.button({
        padding: '8px',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        margin: 0,
        transition: 'background-color .1s ease-out,color .1s ease-out,fill .1s ease-out',
        color: 'white',
        borderRadius: '50%',
        cursor: 'pointer',
        "& svg": {
            fill: 'white',
        },
        "&:hover, &:focus": {
            backgroundColor: 'hsl(211,60%,33%)',
            opacity: '0.85'
        }
    })

    const LightBoxHeader = () => {
        const { url, altText, onClose } = useMessangerImageContext();

        const firstButton = useRef<HTMLElement>(null);

        const handleDownload = () => {
            const isSameDomain = document.location.hostname === new URL(url, document.location.toString()).hostname;
            if (!isSameDomain) {
                window.open(url, '_blank');
            }
        }

        const handleKeyDownload = (event: KeyboardEvent) => {
            event.code === "Enter" && handleDownload();
        }

        const handleKeyClose = (event: KeyboardEvent) => {
            if (event.key === "Tab" || event.shiftKey) {
                firstButton.current?.focus();
                event.preventDefault();
            }   
            event.code === "Enter" && onClose && onClose();
        }

        return (
            <Header>
                <Caption>{altText}</Caption>
                <IconsGroup>
                    <Icon
                        ref={firstButton}
                        onClick={handleDownload}
                        onKeyDown={handleKeyDownload}
                        download
                        tabIndex="0"
                        aria-label="Download fullsize image"
                    >
                        <DownloadIcon />
                    </Icon>
                    <Icon
                        onClick={onClose}
                        onKeyDown={handleKeyClose}
                        tabIndex="0"
                        aria-label="Close fullsize image modal"
                    >
                        <CloseIcon data-test="lightbox-close" />
                    </Icon>
                </IconsGroup>
            </Header>
        )
    };

    return LightBoxHeader;
};
