class NodePoint extends Point {
    constructor (x, y, node, visual) {
        super (x, y, node, visual);
    }

    on_click = function() {
        if (this.visual.start_node && this.node.id == this.visual.start_node.id) {
            this.visual.create_from_graph (this.visual.graph, this.node.parent);
        }else {
            this.visual.create_from_graph (this.visual.graph, this.node);
        }
    }
}

class AudioPoint extends Point {
    constructor (x, y, node, visual, url) {
        super (x, y, node, visual);
        this.audio_node = null;
        this.audio_buffer = null;
        this.start_time; this.end_time; this.playing_duration;
        
        this.url = url;
        this.is_toggle = true;
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
        this.play ();
    }

    on_play  = function () {
        if (this.visual.audioContext) {
            this.arm_audio_node();
            this.audio_node.onended = this.stop.bind(this);
            this.audio_node.start();
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
        if (this.node.name != "_play") {
            this.is_toggle = true;
            this.mouse_over_enabled = false;
        }else {
            this.mouse_over_enabled = true;
        }
    }

    on_mouse_over = function () {
        this.is_active = true;
        if (this.mouse_over_enabled) {
            this.on_click ();
        }
    }

    on_mouse_leave = function () {
        this.is_active = false;
    }

    on_click = function () {
        this.visual.fire_callbacks_point_play (this);
    }
}

class AuctionPoint extends Point {
    constructor (x, y, node, visual, color) {
        super(x, y, node, visual, color);
    }
}

class PlatformPoint extends Point {
    constructor (x, y, node, visual) {
        super (x, y, node, visual);
    }
}

class StreamIOPoint extends Point {
    constructor (x, y, node, visual) {
        super (x, y, node, visual);
    }
}

class FilePoint extends Point {
    constructor (x, y, node, visual, file_extension) {
        super (x, y, node, visual);
        this.file_extension = file_extension;
    }

    on_click = function () {
        this.open_content_page();
    }

    open_conten_page () {
        var frame_parameter = this.id + this.file_extension;
        window.open("https://www.heptagon.network/Graph/c?=" + frame_parameter, "_self");
    }
}

