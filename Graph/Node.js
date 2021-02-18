class NodePoint extends Point {
    constructor (x, y, node, visual) {
        super (x, y, node, visual);
        this.type = "node";
    }

    on_click = function() {
        if (this.visual.start_node && this.node.id == this.visual.start_node.id) {
            this.visual.create_from_graph (this.visual.graph, this.node.parent);
        }else {
            this.visual.create_from_graph (this.visual.graph, this.node);
        }
    }

    on_mouse_over = function () {
        this.play ();
    }
}

class AudioPoint extends Point {
    constructor (x, y, node, visual, url) {
        super (x, y, node, visual);
        this.type = "audio";
        this.audio_node = null;
        this.audio_buffer = null;
        this.start_time; this.end_time; this.playing_duration;
        
        this.url = url;
        this.is_toggle = false;
        this.visual.callbacks_init_audio.push (this.load_audio_buffer.bind (this));
    }

    on_load_state_change (state) {
        if (state == 1) {
            this.backgroundColor = get_random_rgb_color (); //loaded;
        }
    } 

    on_click = function () {
        this.prevent_mouse_over_flag = true;
        if (this.is_active == true) {
            this.stop();
        } else {
            this.play();
        }
    }

    on_mouse_over = function () {
        if (!this.is_active) {
            this.play ();
        }
    }

    on_play  = function () {
        if (this.visual.audioContext) {
            this.arm_audio_node();
            this.audio_node.onended = this.stop.bind(this);
            this.audio_node.start();
            this.is_active = true;
        }
    }

    on_stop = function () {
        if (this.audio_node) {
            this.audio_node.stop();
            this.is_active = false;
        } 
        this.playing_duration = this.end_time - this.start_time;
        this.visual.fire_callbacks_point_stop (this, this.playing_duration);
    }


    arm_audio_node() {
        this.audio_node = this.visual.audioContext.createBufferSource();
        this.audio_node.buffer = this.audio_buffer;
        this.audio_node.connect(this.visual.audioGainNode);
    }

    on_load_state_change (state) {
        if (state == 1) {
            this.backgroundColor = get_random_rgb_color (); //loaded;
        }
    } 

    load_audio_buffer () {
        if (!this.audio_buffer) {
            var audioCtx = this.visual.audioContext;
            var request = new XMLHttpRequest();
            console.log ("path: " + this.relative_path);
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
        if (this.control_type == "play") {
            this.mouse_over_enabled = true;
        }
        else {
            if (this.control_type != "reset") {this.is_toggle = true;};
            this.mouse_over_enabled = false;
        }
    }

    get control_type () {
        return this.name_arguments [1];
    }

    get control_target () {
        return this.name_arguments [2];
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
    }

    get stream_type () {
        return this.name_arguments [1];
    }

    get stream_id () {
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
        console.log ("start " + this.stream_type + " as " + this.stream_id)  
        if (this.stream_type == "sing") {
            createPeer (this.stream_id);
        }else if (this.stream_type == "listen") {
            this.create_audio ();
            this.audio.muted = false;
            call (this.stream_id, this.audio);
        }
    }

    stop () {
        console.log ("stop " + this.stream_type + " as " + this.stream_id)
        if (this.stream_type == "sing") {
            stopStreaming ();
        }else if (this.stream_type == "listen") {
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
        var frame_parameter = this.id + this.file_extension;
        window.open("https://www.heptagon.network/Graph/c?=" + frame_parameter, "_self");
    }
}


