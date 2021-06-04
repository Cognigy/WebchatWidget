import * as React from 'react';
import { styled, IColorProps } from '../../style';
import MessageBubble from "./MessageBubble";

const Thumbs = () => {

  const [clickedUp, setClickedUp] = React.useState(false);
  const [clickedDown, setClickedDown] = React.useState(false);
  const handleClickThumbsUp = () => {
    try {
      // @ts-ignore
      window.cognigyWebchat.sendMessage("", {
        thumb: "up"
      });

      setClickedUp(true);
    } catch (error) { }
  }

  const handleClickThumbsDown = () => {
    try {
      // @ts-ignore
      window.cognigyWebcaht.sendMessage("", {
        thumb: "down"
      });
      setClickedDown(true);
    } catch (error) { }
  }

  return (
    <div
      style={{

      }}
    >
      <div
        onClick={handleClickThumbsUp}
        style={{
          cursor: "pointer"
        }}
        hidden={clickedDown}
      >👍</div>
      <div
        onClick={handleClickThumbsDown}
        style={{
          cursor: "pointer"
        }}
        hidden={clickedUp}
      >👎</div>
    </div>
  );
};

export default function MessageBubbleThumbs(props) {

  console.log(props)
  return (
    <div
      style={{

      }}
    >
      <Thumbs />
      <MessageBubble dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}/>
    </div>
  );
};