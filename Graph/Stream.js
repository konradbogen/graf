var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var audio;
var stream_peers = [];

function initPeer(id) {
    peer = new Peer(id);
    stream_peers.push (peer);
    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });
    return peer;
}


function answerCallsToIdWithMic (id) {
    var peer = initPeer (id);

    peer.on('call', function(call) {
        console.log ("Incoming Call")
        getUserMedia({video: false, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
                //addAudio (remoteStream);
            });
        }, function(err) {console.log('Failed to get local stream' ,err);});
    });
    return peer;
}

function feedStreamFromIdIntoAudio (id, audio, _peer) {
    var peer = _peer ? _peer : initPeer (null);
    getUserMedia({video: false, audio: true}, function(stream) {
        tryToCallPeer(peer, id, stream, audio);
    }, function(err) {console.log('Failed to get local stream' ,err);});
    return peer;
}


function tryToCallPeer(peer, id, stream, audio) {
    var call = peer.call(id, stream);
    var sucess = false;
    call.on('stream', function (remoteStream) {
        audio.srcObject = remoteStream;
        sucess = true;
    });
}

function destroyAllStreamPeers () {
    stream_peers.forEach (p => {
        p.destroy ();
    })
}

