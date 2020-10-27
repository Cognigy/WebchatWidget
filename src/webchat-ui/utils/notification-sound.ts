// Message notification imports
import UIfx from 'uifx';

const notificationSoundDataUrl = require('../assets/notification-sound.wav').default as string;
const notificationSound = new UIfx(notificationSoundDataUrl);

export default notificationSound;