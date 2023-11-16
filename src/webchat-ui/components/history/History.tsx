import styled from '@emotion/styled';
import { ChatScroller } from './ChatScroller';

export const History = styled(ChatScroller)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    "::after": {
        content: "''",
        paddingBottom: theme.unitSize * 2,
    },
}));    
