const VOLUME_ICON_ON = "../Graph/Ressources/Speaker_Icon.png";
const VOLUME_ICON_OFF = "../Graph/Ressources/Speaker_Icon_Off.png";

class InputContainer{

    constructor(palette){
        this.state = 1;
        this.animation1;
        this.animation2;
        this.button = document.getElementById('inputButton');
        this.button.addEventListener('click', this.toggleInput.bind(this));

        this.palette = palette;
        this.animationIni;

        this.volumeButton = document.getElementById('volumeButton');
        this.volumeButton.addEventListener('click', this.toggleMute.bind(this));
        this.volumeImg = document.getElementById('volumeImg');

        this.textarea = document.getElementById('input')
        this.textarea.style.cursor = "pointer";
        this.textarea.value = "input";

        this._mute = true;
        this.mute = true;
    }

    get mute () {
        return this._mute;
    }
    set mute (val) {
        this._mute = val;
        if (val==true) {
            this.volumeImg.src = VOLUME_ICON_OFF;
        }else {
            this.volumeImg.src = VOLUME_ICON_ON;
        }
        this.onMuteChange (val);
    }

    onSubmitClick(text){
        console.log(text);
    }

    toggleMute () {
        this.mute = !this.mute;
    }

    onMuteChange () {

    }

    // toggleInput2(){
    //     if (this.state==0){
    //             this.animation1 = anime({
    //             targets:'#input',
    //             backgroundColor: '#ffffff',
    //             height: '50%',
    //             opacity: '50%',
    //             direction: 'normal',
    //         })
    //         anime({
    //             targets:'#inputSvg polygon',
    //             points: '10 31, 25 12, 40 31',
    //         })
    //         this.state++;
    //     }
    //     else{
    //         if(this.animation1.completed == true){
    //         anime({
    //             targets:'#input',
    //             height: '0',
    //             opacity: '0',
    //             easing: 'linear',
    //             duration: '200',
    //         })
    //         anime({
    //             targets:'#inputSvg polygon',
    //             points: '10 19, 25 38, 40 19',
    //         })
    //         this.state=0
    //         this.onSubmitClick(this.textarea.value);
    //         }
    //         else{
    //             this.animation1.seek(this.animation1.duration);
    //             this.toggleInput();
    //         }
    //     }
    // }

    toggleInput(){
    if(this.state == 1){
            //show
            this.state = 0;
            this.animation1 = anime({
                targets:'#input',
                opacity: '100%',
                direction: 'normal',
                delay:'300',
            })
            this.animation2 = anime({
                targets: '#heptpolygon',
                opacity: {value: '100%',
                duration:100},
                points: [
                    {value: '50 100, 89.092 81.174, 98.746 38.874, 71.694 4.952, 28.306 4.952, 1.254 38.874, 10.908 81.174',
                    delay:100},
                ],
                duration: 1400,
                easing: 'easeOutElastic(1, 1)',
                begin: function() {
                    document.querySelector('#input').style.display = 'flex';
                    document.querySelector('#fixedcontainer').style.display = 'flex';
                  },
            });
            anime({
                targets:'#inputSvg polygon',
                points: '10 31, 25 12, 40 31',
            })
            this.animationIni = new BackgroundAnimation(this.palette[Math.floor(Math.random() * this.palette.length)], this.palette[Math.floor(Math.random() * this.palette.length)], 3000, 'stop1', 'stop2');
            this.animationIni.open();
                
        }else{
        //hide
        if(this.animation1.completed == true && this.animation2.completed == true){
        this.state = 1;
        anime({
            targets:'#input',
            opacity: '0',
            easing: 'linear',
            duration: '200',
            delay:'500',
        })
        anime({
            targets: '#heptpolygon',
            points: [
                {value: '50 100, 50 50, 98.746 38.874, 50 50, 50 50, 1.254 38.874, 50 50' },
            ],
            opacity: {
                value: 0,
                delay:300},
            duration: 800,
            easing: 'easeInElastic(1, 1)',
            complete: function() {
                document.querySelector('#input').style.display = 'none';
                document.querySelector('#fixedcontainer').style.display = 'none';
              },
        })
        anime({
            targets:'#inputSvg polygon',
            points: '10 19, 25 38, 40 19',
        })
        this.onSubmitClick(this.textarea.value);
        document.getElementById("input").style.display="none";
        }
        else{
        this.animation1.seek(this.animation1.duration);
        this.animation2.seek(this.animation2.duration);
        this.toggleInput();
        }
    };
    };


};
    

    class BackgroundAnimation{
        constructor(gradient1, gradient2, duration, id1, id2){
            this.ani;
            this.duration = duration;
            this.d = 0;
            this.target1 = document.getElementById(id1);
            this.target2 = document.getElementById(id2);
    
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
    
            this.target1.setAttribute('style', 'stop-color:'+value1+';stop-opacity:.6');
            this.target2.setAttribute('style', 'stop-color:'+value2+';stop-opacity:.6');
        }
        
    }

class ZoomContainer {
    constructor(){
        this.mobile = false;
        var string =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/;
        if(string.test(navigator.userAgent) ) {
            this.mobile = true;
        }
        
        this.html_element = document.getElementById('graphContainer');
        
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

    /* set zoomPercentage (val) {
            var delta_percentage = val - this._zoom_percentage;
            this._zoom_percentage = val;
            this.animation.seek(this._zoom_percentage*this.animation.duration);

            var factor = delta_percentage * (this.max_zoom_factor-1*this.zoomPercentage);
            var dx = (this.mouseX)  * factor;
            var dy = (this.mouseY) * factor;
            this.left = this.left - dx;
            this.top = this.top - dy;
            this.callbacks.forEach(c => {
                c(this._zoom_percentage);
            })
    } */

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
        if (this.mobile == false) {
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
