const VOLUME_ICON_ON = "./Ressources/Speaker_Icon.png";
const VOLUME_ICON_OFF = "./Ressources/Speaker_Icon_Off.png";
const HEPTAGON_SVG = "./Ressources/Heptagon.svg"

class Menu {

    constructor(div_id, palette){
        this.state = 1;
        
        //this.animation1;
        //this.animation2;
        //this.animationIni;

        this.button,
        this.volumeButton;
        this.heptagonSvg;
        this.inputContainer;
        this.inputArea;
        this.menuDiv;

        this.palette = palette;

        this._mute = true;
        this._visible = true;

        this.create_html (document.getElementById (div_id));
    }

    set visible (val) {
        this._visible = val;
        if (val) {
            this.show ();
        }else {
            this.hide (); 
        }
    }

    get visible () {
        return this._visible;
    }

    get mute () {
        return this._mute;
    }
    set mute (val) {
        this._mute = val;
        if (val==true) {
            this.volumeImg.src = VOLUME_ICON_OFF;
        }else {
            this.volumeImg.src = VOLUME_ICON_ON;
        }
        this.onMuteChange (val);
    }
    
    get text () {
        return this.inputArea.value;
    }

    set text (val) {
        this.inputArea.value = val;
    }

    hide () {
        if (this.menuDiv) {
            this.menuDiv.style.display = "none";
        }
        this._visible = false;
    }

    show () {
        if (this.menuDiv) {
            this.menuDiv.style.display = "inherit";
        }
        this._visible = true;
    }

    create_html (div) {
        this.create_inputdiv_html (div);
        this.menuDiv = document.createElement ("div");
        this.menuDiv.id = "menuDiv";
        if (!this._visible) {this.hide ()};
        div.appendChild (this.menuDiv);
        this.create_button_html (this.menuDiv);
        this.create_volumebutton_html (this.menuDiv);
    }

    create_button_html (div) {
        this.button = document.createElement ("button");
        this.button.id = "inputButton";
        var svg = this.create_button_svg();
        this.button.appendChild (svg);
        this.button.addEventListener ("click", this.toggle_input.bind(this));
        div.appendChild (this.button);
        return this.button;
    }

    create_button_svg() {
        var svg = document.createElementNS(SVG_NAMESPACE, "svg");
        svg.id = "inputButtonSvg";
        svg.setAttribute ("width", 50); svg.setAttribute ("height", 50);
        svg.setAttribute ("viewBox", "-15 -15 80 80");
        var circle = document.createElementNS(SVG_NAMESPACE, "circle");
        circle.setAttribute("cx", "25"); circle.setAttribute("cy", "25");
        circle.setAttribute("r", "25"); circle.setAttribute("fill", "grey");
        var triangle = document.createElementNS (SVG_NAMESPACE, "polygon")
        triangle.setAttribute ("fill", "white"); triangle.setAttribute ("points", "10 19, 25 38, 40 19");
        svg.appendChild (circle);
        svg.appendChild (triangle);
        return svg;
    }

    create_volumebutton_html (div) {
        this.volumeButton = document.createElement ("button");
        this.volumeButton.id = "volumeButton";
        this.volumeImg = document.createElement ("img");
        this.volumeImg.id = "volumeImg";
        this.volumeImg.src = VOLUME_ICON_OFF;
        this.volumeButton.appendChild (this.volumeImg);
        this.volumeButton.addEventListener ("click", this.toggle_mute.bind(this));
        div.appendChild (this.volumeButton);
        return this.volumeButton;
    }

    create_inputdiv_html (div) {
        this.inputContainer = document.createElement ("div");
        this.inputContainer.id = "inputContainer";
        this.inputArea = document.createElement ("textarea");
        this.inputArea.id = "input";
        this.inputArea.style.overflow = "scroll";
        this.inputArea.style.textAlign = "center";
        this.inputArea.style.backgroundColor = "transparent";
        this.inputContainer.appendChild (this.inputArea);
        div.appendChild (this.inputContainer);
    }

    load_heptagon_svg_into_div (div) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET",HEPTAGON_SVG,false);
        xhr.overrideMimeType("image/svg+xml");
        xhr.onload = function(e) {
            this.heptagonSvg = xhr.responseXML.documentElement
            div.appendChild(this.heptagonSvg);
        }.bind (this);
        xhr.send("");
    }

    toggle_mute () {
        this.mute = !this.mute;
    }

    toggle_input(){
        if(this.state == 1){
            this.showInput ();
        }else{
            this.hideInput ();
        }
    }

    hideInput () {
        this.state = 1;
        this.onSubmitClick (this.text);
        this.inputContainer.style.display = "none";
        anime({
            targets: '#inputButtonSvg polygon',
            points: '10 19, 25 38, 40 19',
        });
        /* if (this.animation1.completed == true && this.animation2.completed == true) {
            this.state = 1;
            anime({
                targets: '#inputContainer',
                opacity: '0',
                easing: 'linear',
                duration: '200',
                delay: '500',
            });
            anime({
                targets: '#heptpolygon',
                points: [
                    { value: '50 100, 50 50, 98.746 38.874, 50 50, 50 50, 1.254 38.874, 50 50' },
                ],
                opacity: {
                    value: 0,
                    delay: 300
                },
                duration: 800,
                easing: 'easeInElastic(1, 1)',
                complete: function () {
                    this.inputDiv.style.display = 'none';
                }.bind (this),
            })
            */
            /*
            this.inputDiv.style.display = "none";
        }
        else {
            this.animation1.seek(this.animation1.duration);
            this.animation2.seek(this.animation2.duration);
            this.toggle_input();
        } */
    }

    showInput () {
        this.state = 0;
        this.inputContainer.style.display = "flex";
        anime({
            targets: '#inputButtonSvg polygon',
            points: '10 31, 25 12, 40 31',
        });
        /* this.state = 0;
        this.animation1 = anime({
            targets: '#inputContainer',
            opacity: '100%',
            direction: 'normal',
            delay: '300',
        });
        this.animation2 = anime({
            targets: '#heptpolygon',
            opacity: {
                value: '100%',
                duration: 100
            },
            points: [
                {
                    value: '50 100, 89.092 81.174, 98.746 38.874, 71.694 4.952, 28.306 4.952, 1.254 38.874, 10.908 81.174',
                    delay: 100
                },
            ],
            duration: 1400,
            easing: 'easeOutElastic(1, 1)',
            begin: function () {
                this.inputDiv.style.display = 'flex';
                this.heptagonSvg.style.display = 'flex';
            }.bind (this),
        });
        */
        /*this.animationIni = new BackgroundAnimation(this.palette[Math.floor(Math.random() * this.palette.length)], 
        this.palette[Math.floor(Math.random() * this.palette.length)], 3000);
        this.animationIni.open(); */
    }

    get_entry_text () {
        var text = this.inputArea.innerText;
        return text;
    }   

    onMuteChange () {

    }

    onSubmitClick(text){
        console.log(text);
    }


};
    
class BackgroundAnimation{
        constructor(gradient1, gradient2, duration, id1, id2){
            this.ani;
            this.duration = duration;
            this.d = 0;
            this.target1 = document.getElementsByClassName ("stop") [0];
            this.target2 = document.getElementsByClassName ("stop") [1];
    
            this.gradients = [
                gradient1,
                gradient2
            ]
        }
    
        open(){
            this.ani = anime({
                targets: {
                    start: this.gradients[0],
                    end: this.gradients[1]
                },
                start: this.gradients[1],
                end: this.gradients[0],
                duration: this.duration,
                easing: 'easeOutQuad',
                round: 1,
                loop: true,
                direction: 'alternate',
                update: this.animation.bind(this),            
              });
        }
    
        animation(){
            var value1 = this.ani.animations[0].currentValue;
            var value2 = this.ani.animations[1].currentValue;
    
            //this.target1.setAttribute('style', 'stop-color:'+value1+';stop-opacity:.6');
            //this.target2.setAttribute('style', 'stop-color:'+value2+';stop-opacity:.6');
        }
        
}

class ZoomContainer {
    constructor(){
        this.zoomEnabled = true;
        this.mobile = false;
        var string =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/;
        if(string.test(navigator.userAgent) ) {
            this.mobile = true;
        }
        
        this.html_element = document.getElementById('graphContainer');
        this.html_element.style.cursor = "move";

        this._drag_offset_x = 0;
        this._drag_offset_y = 0;
        this.last_drag_offset_x;
        this.last_drag_offset_y;

        this.animation;
        this._zoom_percentage = 0;
        this.max_zoom_factor = 30;
        this.initialWidth = this.html_element.offsetWidth;
        this.initialHeight = this.html_element.offsetHeight;
        this.callbacks = [];

        this.mouseX = 0;
        this.mouseY = 0;


        $(document).ready = function (){
            //this.scrollToBottom();
        }

        window.onscroll = this.zoom.bind (this);
        this.html_element.onmousemove  = this.setMousePosition.bind(this);
        this.html_element.onmousedown = this.dragMouseDown.bind(this);

        this.init_animation();
    }

    set drag_offset_x (val) {
        this._drag_offset_x = val;
        this.html_element.style.left = (this.html_element.offsetLeft - this._drag_offset_x) + "px";
    }

    set drag_offset_y (val) {
        this._drag_offset_y = val;
        this.html_element.style.top = (this.html_element.offsetTop - this._drag_offset_y) + "px";

    }

    get drag_offset_x () {
        return this._drag_offset_x;
    }

    get drag_offset_y () {
        return this._drag_offset_y;
    }

    set zoomPercentage (val) {
        this.delta_zoom_percentage = val - this._zoom_percentage;
        this._zoom_percentage = val;
        this.animation.seek(this._zoom_percentage*this.animation.duration);

        var factor = this.delta_zoom_percentage * (this.max_zoom_factor - 1);

        var dx = (this.mouseX) * factor;
        var dy = (this.mouseY) * factor;
        this.left = this.left - dx;
        this.top = this.top - dy;
        this.callbacks.forEach(c => {
            c(this._zoom_percentage);
        })
    }

    get zoomPercentage () {
        return this._zoom_percentage;
    }

    get left () {
        return this.html_element.offsetLeft;
    }

    set left (val) {
        this.html_element.style.left = val + "px";
    }

    get top () {
        return this.html_element.offsetTop;
    }

    set top (val) {
        this.html_element.style.top = val + "px";
    }

    reset_zoom () {
        window.scrollTo(0,0); 
        this.zoomPercentage = 0;
        this.drag_offset_x = 0;
        this.drag_offset_y = 0;
        this.last_drag_offset_x = 0;
        this.last_drag_offset_y = 0;
        this.left = 0;
        this.top = 0;
    }

    dragMouseDown(e){
        e = e ||  window.event;
        e.preventDefault();
        this.last_drag_offset_x = e.clientX;
        this.last_drag_offset_y = e.clientY;
        document.onmouseup = this.closeDragElement;
        document.onmousemove = this.elementDrag.bind(this);
    }

    elementDrag(e){
        e = e || window.event;
        e.preventDefault();
        this.drag_offset_x = this.last_drag_offset_x - e.clientX;
        this.drag_offset_y = this.last_drag_offset_y - e.clientY;
        this.last_drag_offset_x = e.clientX;
        this.last_drag_offset_y = e.clientY;
    }

    closeDragElement(){
        document.onmouseup = null;
        document.onmousemove = null;
    }

    init_animation() {
        this.animation = anime({
            targets: this.html_element,
            width: {
                value: '*=' + this.max_zoom_factor,
            },
            height: {
                value: '*=' + this.max_zoom_factor,
            },

            easing: 'linear',
            autoplay: false,
        });
    }

    zoom(){
        if (this.mobile == false && this.zoomEnabled) {
            this.zoomPercentage= this.getScrollPercentage ();
        }
    }

    getWindowHeight(){
        return window.innerHeight || 
        document.documentElement.clientHeight ||
        document.body.clientHeight || 0;
    }

    getWindowWidth(){
        return window.innerWidth || 
        document.documentElement.clientWidth ||
        document.body.clientWidth || 0;
    }


    getWindowYScroll() {
        return window.pageYOffset || 
               document.body.scrollTop ||
               document.documentElement.scrollTop || 0;
    }

    getDocHeight() {
        return Math.max(
            document.body.scrollHeight || 0, 
            document.documentElement.scrollHeight || 0,
            document.body.offsetHeight || 0, 
            document.documentElement.offsetHeight || 0,
            document.body.clientHeight || 0, 
            document.documentElement.clientHeight || 0
        );
    }

    getDocWidth() {
        return Math.max(
            document.body.scrollWidth || 0, 
            document.documentElement.scrollWidth || 0,
            document.body.offsetHeightWidth || 0, 
            document.documentElement.offsetWidth || 0,
            document.body.clientWidth || 0, 
            document.documentElement.clientWidth || 0
        );
    }

    getScrollPercentage() {
        var doc_height = this.getDocHeight()
        var scroll_pos = this.getWindowYScroll(); 
        var window_height = this.getWindowHeight()
        return  (scroll_pos  / (doc_height - window_height));
    }

    setMousePosition(event){
        this.mouseX = (event.clientX - this.left) / (1 + this._zoom_percentage * (this.max_zoom_factor-1)); 
        this.mouseY = (event.clientY - this.top) / (1 + this._zoom_percentage * (this.max_zoom_factor-1));
    }

    scrollToBottom(){
        document.body.scrollTop = document.body.scrollHeight;
    }
}

class HeaderInput {
    constructor (container_div_id) {
        this.div;
        this.input;
        this._visible = true;
        this._shines = false;
        this.create_html (document.getElementById (container_div_id));
    }

    set visible (val) {
        this._visible = val;
        if (val) {
            this.show ();
        }else {
            this.hide (); 
        }
    }

    set shines (val) {
        this._shines = val;
        if (val == false) {
            this.div.style.opacity = "30%";
        }else {
            this.div.style.opacity = "80%";
        }
    }   

    get shines () {
        return this._shines;
    }

    get value () {
        return this.input.value;
    }

    set value (val) {
        this.input.value = val;
    }

    hide () {
        if (this.div) {
            this.div.style.display = "none";
        }
        this._visible = false;
    }

    show () {
        if (this.div) {
            this.div.style.display = "inherit";
        }
        this._visible = true;
    }

    create_html (container_div) {
        this.div = document.createElement ("div");
        this.div.id = "headerInputDiv";
        this.input = document.createElement ("input");
        this.input.id = "headerInput";
        this.div.appendChild (this.input);
        if (!this._visible) {this.hide ()}
        container_div.appendChild (this.div);
        this.create_callbacks ();
    }

    create_callbacks () {
            this.input.onkeydown = function (e) {
                if (e.key === 'Enter') {
                    this.onEnter ();
                }
            }.bind(this);
            this.input.oninput = function (e) {
                this.onInput ();
            }.bind(this);
    }

    onInput () {

    };

    onEnter () {

    }

}