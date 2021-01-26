
    window.addEventListener ('DOMContentLoaded', load.bind (this));

    function load () {
        var parameter = get_url_parameter ("");
        if (parameter) {
            var type = parameter.substr (parameter.lastIndexOf ("."))
            type = type.replace (".", "");
            var url_without_type = parameter.substr (0, parameter.lastIndexOf ("."))
            set_title (url_without_type);
            url_without_type = url_without_type.replaceAll (".", "/");
            var url = "Content/" + url_without_type + "." + type;
            console.log ("Url: " + url);
            console.log ("Type: " + type);

            if (type == "txt") {
                create_from_text_file (url);
            }else if (type == "jpg" || type == "gif" || type=="png" || type=="jpeg") {
                create_from_image_file (url);
            }else if (type == "mp4") {
                create_from_video_file (url);
            }
        }

       
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
