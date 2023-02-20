import { useState } from 'react';
import { MessagePluginFactoryProps } from "../../../../../common/interfaces/message-plugin";
import { getImagePreview } from '../MessengerImage/components/ImagePreview';
import { getLightbox } from '../MessengerImage/components/Lightbox';
import { IFBMImage } from '../../interfaces/Image.interface';
import { MessangerImageContext } from './MessangerImageContext';

export const getMessengerImage = ({ React, styled }: MessagePluginFactoryProps) => {

    const ImagePreview = getImagePreview({ React, styled });
    const LightBox = getLightbox({ React, styled });

    const MessengerImage = (props: IFBMImage & React.HTMLProps<HTMLDivElement>) => {
        const [showLightbox, setShowLightbox] = useState(false);

        return (
            <MessangerImageContext.Provider value={{
                onExpand: () => setShowLightbox(true),
                onClose: () => setShowLightbox(false),
                ...props
            }}>
                <ImagePreview />
                {showLightbox && <LightBox />}
            </MessangerImageContext.Provider>
        );
    };

    return MessengerImage;
};
