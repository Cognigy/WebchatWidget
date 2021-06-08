import * as React from 'react';
import MessageBubble from "./MessageBubble";

const Thumbs = (props: any) => {

  const { text } = props;

  const [clickedUp, setClickedUp] = React.useState(false);
  const [clickedDown, setClickedDown] = React.useState(false);

  const handleClickThumbsUp = () => {
    try {
      // @ts-ignore
      window.cognigyWebchat.sendMessage('', {
        thumb: "up",
        text
      });

      setClickedUp(true);
    } catch (error) { }
  }

  const handleClickThumbsDown = () => {
    try {
      // @ts-ignore
      window.cognigyWebchat.sendMessage('', {
        thumb: "down",
        text
      });
      setClickedDown(true);
    } catch (error) { }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "-7px",
        marginRight: "10px"
      }}
    >
      <div
        onClick={handleClickThumbsUp}
        style={{
          cursor: "pointer"
        }}
        hidden={clickedUp || clickedDown}
      >👍</div>
      <div
        onClick={handleClickThumbsDown}
        style={{
          cursor: "pointer"
        }}
        hidden={clickedUp || clickedDown}
      >👎</div>
    </div>
  );
};

export default function MessageBubbleThumbs(props) {
  if (props?.className?.includes('bot') && !props.dangerouslySetInnerHTML?.__html.toLowerCase().startsWith('feedback')) {
    // This is a bot message. And it doesn't start with "feedback". Add thumbs buttons
    return (
      <div
        style={{
        }}
      >
        <Thumbs text={props.dangerouslySetInnerHTML.__html} />
        <MessageBubble dangerouslySetInnerHTML={props.dangerouslySetInnerHTML} />
      </div>
    );
  }
  // Otherwise, this is a message from the user. No need to add thumbs buttons
  return <MessageBubble dangerouslySetInnerHTML={props.dangerouslySetInnerHTML} />
};