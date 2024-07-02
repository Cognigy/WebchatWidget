// Message notification imports
import UIfx from 'uifx';

const fileUrl = require('../assets/bell-sound.mp3').default as string;
const bellSound = new UIfx(fileUrl);

export default bellSound;