import { registerRootComponent } from 'expo';
import './shim.js'
import App from './App';
import TrackPlayer from 'react-native-track-player';


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
TrackPlayer.registerPlaybackService(()=>require('./TrackPlayerService'));