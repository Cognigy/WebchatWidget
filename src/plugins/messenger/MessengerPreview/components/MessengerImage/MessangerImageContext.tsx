import { createContext, useContext } from 'react';
import { IFBMImage } from '../../interfaces/Image.interface';

interface IMessangerImageContext extends IFBMImage {
    onExpand: () => void,
    onClose: () => void,
}

export const MessangerImageContext = createContext<IMessangerImageContext | null>(null);

export const useMessangerImageContext = () => useContext(MessangerImageContext) as IMessangerImageContext;