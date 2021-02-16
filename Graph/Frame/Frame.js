
window.addEventListener ('DOMContentLoaded', load.bind (this));

function load () {
    var parameter = get_url_parameter ("");
    if (parameter) {
        var type = get_type_from_parameter(parameter);
        var id = get_id_from_parameter(parameter)
        var url = get_content_url(id, type);
        set_title (id);
        load_content(url, type);
    }
}    

function load_content(url, type) {
    if (type == "txt") {
        create_from_text_file(url);
    }
    else if (type == "html") {
        create_from_html_file (url);
    } else if (type == "jpg" || type == "gif" || type == "png" || type == "jpeg") {
        create_from_image_file(url);
    } else if (type == "mp4") {
        create_from_video_file(url);
    }
}

function get_content_url (id, type) {
    var content_path = id.replaceAll(".", "/");
    var url = "Content/" + content_path + "." + type;
    return url;
}

function get_id_from_parameter(parameter) {
    return parameter.substr(0, parameter.lastIndexOf("."));
}

function get_type_from_parameter(parameter) {
    var type = parameter.substr(parameter.lastIndexOf("."));
    type = type.replace(".", "");
    return type;
}

function set_title (title) {
    var title_parts = title.split (".");
    var sub_id = "";
    var html_title = "";
    var pre_url = "https://www.heptagon.network/Graph/?sub=";
    title_parts.forEach (title_part => {
        if (sub_id == "") {
            sub_id = sub_id + title_part;
            html_title = html_title + "<a href=" + pre_url + sub_id + ">" + title_part + "</a>";
        }else {
            sub_id = sub_id + "." + title_part;
            html_title = html_title + "." + "<a href=" + pre_url + sub_id + ">" + title_part + "</a>";
        }
    })
    document.getElementById("title").innerHTML = "<h1>" + html_title + "</h1>";
    document.title = "heptagon." + title;
}

function get_url_parameter (name, w){
    w = w || window;
    var rx = new RegExp('[\&|\?]'+name+'=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? null:val[1];
}

function create_from_text_file (url) {
    fetch(url)
        .then(response => response.text()) 
        .then(textString => {
            document.getElementById("content").innerHTML = textString;
        }
    );

}

function create_from_html_file (url) {
    fetch(url)
        .then(response => response.text()) 
        .then(textString => {
            var container = document.getElementById("content");
            container.innerHTML = textString;
            var scripts = container.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src) {
                    console.log ("Angehängtes Script geladen: ", i, scripts[i].src)
                    var script = document.createElement("script");
                    script.src = scripts[i].src;
                    document.head.appendChild(script);
                }
                else {
                    console.log ("Angehängtes Script nicht geladen: ", i, scripts[i].innerHTML)
                }
            }
        }
    );
}

function create_from_video_file (url) {
    var video = document.createElement('video');
    video.src = url;
    video.autoplay = true;
    video.controls = true;
    document.getElementById ("content").appendChild (video);
}

function create_from_image_file (url) {
    document.getElementById ("content").innerHTML =  "<img src=\" " + url + "\">";
}    

const PALETTE =  [
    '#004F2D',
    '#247BA0',
    '#e6af2e',
    '#F76F8E',
    '#550C18',
    '#3B429F']; //in # and ' for anime.js compatibility; 

    

var backgroundAnimationINI = new BackgroundAnimation(PALETTE[Math.floor(Math.random() * PALETTE.length)], PALETTE[Math.floor(Math.random() * PALETTE.length)], 3000, 'stop1', 'stop2');
backgroundAnimationINI.open();