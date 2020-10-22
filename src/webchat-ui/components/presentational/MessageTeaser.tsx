import { styled } from "../../style";

const MessageTeaser = styled.div(() => ({
    maxWidth: '200px',
    backgroundColor: 'white',
    padding: '16px 24px',
    position: 'fixed',
    borderRadius: '16px 16px 0px',
    right: '80px',
    bottom: '100px',
    boxShadow: 'rgba(151, 124, 156, 0.1) 0px 5px 9px 0px, rgba(203, 195, 212, 0.1) 0px 5px 16px 0px, rgba(216, 212, 221, 0.1) 0px 8px 20px 0px',
    color: '#45454',
    fontSize: '14px',
    fontFamily: "sans-serif",
}));

export default MessageTeaser;