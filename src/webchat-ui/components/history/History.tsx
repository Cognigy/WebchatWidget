import { styled } from '../../style';
import { ChatScroller } from './ChatScroller';

export const History = styled(ChatScroller)(({ theme }) => ({
    paddingTop: theme.unitSize * 2,
    paddingBottom: theme.unitSize * 2
}));