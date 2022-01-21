// Message notification imports
import UIfx from "uifx";

const notificationSoundDataUrl = require("../assets/notification-sound.mp3")
  .default as string;
const notificationSound = new UIfx(notificationSoundDataUrl);

export default notificationSound;
