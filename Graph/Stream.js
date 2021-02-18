var peer;
var peerId;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var audio;

function createPeer (id) {

    peerId = id;
    peer = new Peer (peerId)
    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });

    peer.on('call', function(call) {
        console.log ("CAAAAAAALLL")
        getUserMedia({video: false, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
                //addAudio (remoteStream);
            });
        }, function(err) {console.log('Failed to get local stream' ,err);});
    });
}



function call (id, audio) {
    createPeer (peerId);
    getUserMedia({video: false, audio: true}, function(stream) {
        var call = peer.call(id, stream);
        call.on('stream', function(remoteStream) {
            audio.srcObject = remoteStream;
        });
    }, function(err) {console.log('Failed to get local stream' ,err);});
}


function stopStreaming () {
    peer.destroy ();
}



