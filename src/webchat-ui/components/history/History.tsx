import { styled } from '../../style';
import { ChatScroller } from './ChatScroller';

export const History = styled(ChatScroller)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.unitSize * 2,
    "& > *:last-child": {
        paddingBottom: theme.unitSize * 2,
    },
}));    
