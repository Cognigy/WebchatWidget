import { styled } from '../../style';
import { ChatScroller } from './ChatScroller';

export const History = styled(ChatScroller)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    "::after": {
        content: "''",
        paddingBottom: theme.unitSize * 2,
    },
}));    
