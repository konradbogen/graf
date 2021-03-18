var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var audio;
var stream_peers = [];

function initPeer(id) {
    peer = new Peer(id, {host: 'peer.heptagon.network', port: 12343, path: '/', debug: 3, config: {'iceServers': [{ url: 'stun:stun.heptagon.network:5349', username: 'heptagonpeer', credential: 'fhwFElj4kwJä-r2g"e' },{ url: 'turn:turn.heptagon.network:5349', username: 'heptagonpeer', credential: 'fhwFElj4kwJä-r2g"e' }]}});
    stream_peers.push (peer);
    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });
    return peer;
}

//sing
function answerCallsToIdWithMic (id) {
    var peer = initPeer (id);

    peer.on('call', function(call) {
        console.log ("Incoming Listening Request")
        getUserMedia({video: false, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
                
            });
        }, function(err) {console.log('Failed to get local stream' ,err);});
    });
    return peer;
}

//listen
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

