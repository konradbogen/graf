var FADE_OUT_TIME = 0.3;

class NodePoint extends Point {
    constructor (x, y, node, visual) {
        super (x, y, node, visual);
        this.type = "node";
        if (this.visual.clickToOpen == false) {
            this.html.style.cursor = "default";
        }
    }

    on_click = function() {
        if (this.visual.clickToOpen) {
            if (this.visual.start_node && this.node.id == this.visual.start_node.id) {
                this.visual.create_from_graph (this.visual.graph, this.node.parent);
            }else {
                this.visual.create_from_graph (this.visual.graph, this.node);
            }
        }
    }

    on_mouse_over = function () {
        if (this.visual.clickToOpen) {
            this.play ();
        }
    }
}

class AudioPoint extends Point {
    constructor (x, y, node, visual, url) {
        super (x, y, node, visual);
        this.type = "audio";
        this.audio_node = null;
        this.gain_node = null;
        this.audio_buffer = null;
        this.is_playing = false;
        this.start_time; this.end_time; this.playing_duration;
        this.mouse_over_enabled = true;
        this.url = url;
        this.is_toggle = false;
        this.visual.callbacks_init_audio.push (this.load_audio_buffer.bind (this));
        this.loaded = false;
    }

    on_click = function () {
        this.prevent_mouse_over_flag = true;
        if (this.is_playing == false) {
            this.play();
        } else {
            this.on_stop();
        }
    }

    on_mouse_over = function () {
        if (this.is_active) {
            this.play ();
        }
    }

    on_mouse_leave = function () {
        this.is_active = true;
    }

    on_play  = function () {
        if (this.visual.audioContext && !this.is_playing && this.loaded) {
            this.is_playing = true;
            this.arm_audio_node();
            this.audio_node.onended = this.stop.bind(this);
            setTimeout (this.fade_out.bind (this), (this.audio_node.buffer.duration-FADE_OUT_TIME)*1000);
            this.audio_node.start();
            this.gain_node.gain.setTargetAtTime (0.01, this.visual.audioContext.currentTime, 0.015);
            this.gain_node.gain.linearRampToValueAtTime(1.0, this.visual.audioContext.currentTime + FADE_OUT_TIME);
            this.is_active = true;
        }
    }

    fade_out () {
        this.gain_node.gain.linearRampToValueAtTime(0.01, this.visual.audioContext.currentTime + FADE_OUT_TIME);
    }

    on_stop = function () {
        this.audio_node.stop();
        this.is_active = false;
        this.is_playing = false;
        this.playing_duration = this.end_time - this.start_time;
        this.visual.fire_callbacks_point_stop (this, this.playing_duration);
    }


    arm_audio_node() {
        this.audio_node = this.visual.audioContext.createBufferSource();
        this.audio_node.buffer = this.audio_buffer;
        this.gain_node = this.visual.audioContext.createGain ();
        this.audio_node.connect(this.gain_node);
        this.gain_node.connect (this.visual.audioContext.destination);
    }

    on_load_state_change (state) {
        if (state == 1) {
            this.backgroundColor = get_random_rgb_color (); //loaded;
            this.loaded = true;

        }
    } 

    load_audio_buffer () {
        if (!this.audio_buffer) {
            var audioCtx = this.visual.audioContext;
            var request = new XMLHttpRequest();
            console.log ("path: " + this.path);
            request.open('GET', this.relative_path, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                var audioData = request.response;  
                audioCtx.decodeAudioData(audioData, function(buffer) {
                    this.audio_buffer = buffer;
                    this.on_load_state_change (1);
                }.bind (this),        
                function(e){ console.log("Error with decoding audio data" + e.err); });
            }.bind (this);
      
            request.send();
        }
    }

}


class ControlPoint extends Point {
    constructor (x, y, node, visual, color) {
        super (x, y, node, visual, color);
        this.type = "control";
        this.sequences = [];
        this.pacs = [];

        if (this.control_type == "play" || this.control_type == "seqr") {
            this.mouse_over_enabled = true;
        }
        else {
            if (this.control_type != "reset" && this.control_type != "perm" && this.control_type != "perm") {
                this.is_toggle = true;
            };
            this.mouse_over_enabled = false;
        }
    }

    get control_type () {
        return this.name_arguments [1];
    }

    get control_target () {
        return this.name_arguments [2];
    }

    stop_all_pacs () {
        this.pacs.forEach (p => {
            p.active = false;
        })
    }

    start_all_pacs () {
        this.pacs.forEach (p => {
            p.active = true;
        })
    }

    on_mouse_over = function () {
        if (this.mouse_over_enabled) {
            this.play ();
        }
    }

    on_click = function () {
        this.play ();
    }
}

class AuctionPoint extends Point {
    constructor (x, y, node, visual, color) {
        super(x, y, node, visual, color);
        this.type = "auction";
    }
}

class StreamPoint extends Point {
    constructor (x, y, node, visual) {
        super (x, y, node, visual);
        this.is_toggle = true;
        this.audio;
        this.peer;
    }

    get type_argument () {
        return this.name_arguments [1];
    }

    get id_argument () {
        return this.name_arguments [2];
    }

    create_audio (id) {
        this.audio = new Audio ();
        document.body.appendChild (this.audio)
        this.audio.play ();
    }

    on_click = function () {
        this.play ();
    }

    on_play = function () {
        if (this.is_active) {
            this.start ();
        }else {
            this.stop ();
        }
    }

    start () {  
        console.log ("start " + this.type_argument + " as " + this.id_argument)  
        if (this.type_argument == "sing") {
            this.peer = answerCallsToIdWithMic (this.id_argument)
        }else if (this.type_argument == "listen") {
            this.create_audio ();
            this.audio.muted = false;
            this.peer = feedStreamFromIdIntoAudio (this.id_argument, this.audio, this.peer);
        }
    }

    stop () {
        console.log ("stop " + this.type_argument + " as " + this.id_argument)
        if (this.type_argument == "sing") {
            this.peer.destroy ();
        }else if (this.type_argument == "listen") {
            if (this.audio) {
                this.audio.muted = true;
            }
        }
    }

}


class FilePoint extends Point {
    constructor (x, y, node, visual, file_extension) {
        super (x, y, node, visual);
        this.type = "file";
        this.file_extension = file_extension;
    }

    on_click = function () {
        this.open_content_page();
    }

    open_content_page () {
        if (this.visual.frameEnabled == true){
            var id_parameter = this.visual.content_directory.replaceAll ("/", ".") + this.id + this.file_extension
            id_parameter = id_parameter.substring (1);
            window.open(this.get_own_url_location () + "c/?=" + id_parameter, "_self");
        }else {
            window.open (this.relative_path);
        }
       
    }

    get_own_url_location () {
        var pn = window.location.pathname;
        if (pn.includes ("?")) {
            var loc = pn.split (pn.indexOf ("?/")) [0];
        }else {
            var loc = pn.split (pn.lastIndexOf ("/")) [0];
        }
        return loc;
    }

}




