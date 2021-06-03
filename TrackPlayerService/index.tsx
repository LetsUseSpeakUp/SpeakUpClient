import TrackPlayer from 'react-native-track-player';

module.exports = async function(){
    TrackPlayer.addEventListener('remote-play', () =>{
        console.log("TrackPlayerService. remote-play. Play.");
        TrackPlayer.play();
    });
    TrackPlayer.addEventListener('remote-pause', () => {
        console.log("TrackPlayerService. remote-pause. Pause.");
        TrackPlayer.pause()
    });    
}

TrackPlayer.setupPlayer().then(()=>{
    console.log("TrackPlayerService. TrackPlayer setup");
    TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_PLAY,
        ],
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE
        ]
    })
});    