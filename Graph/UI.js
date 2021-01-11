class UiInputContainer{

    constructor(){
        this.state = 0;
        this.animation1;
        this.button = document.getElementById('inputButton');
        this.button.addEventListener('click', this.toggleInput.bind(this));
        this.textarea = document.getElementById('input')
        this.textarea.value = "input";


    }

    onSubmitClick(text){
        console.log(text);
    }

    toggleInput(){
        if (this.state==0){
                this.animation1 = anime({
                targets:'#input',
                backgroundColor: '#ffffff',
                height: '50%',
                opacity: '50%',
                direction: 'normal',
            })
            anime({
                targets:'#inputSvg polygon',
                points: '10 31, 25 12, 40 31',
            })
            this.state++;
        }
        else{
            if(this.animation1.completed == true){
            anime({
                targets:'#input',
                height: '0',
                opacity: '0',
                easing: 'linear',
                duration: '200',
            })
            anime({
                targets:'#inputSvg polygon',
                points: '10 19, 25 38, 40 19',
            })
            this.state=0
            this.onSubmitClick(this.textarea.value);
            }
            else{
                this.animation1.seek(this.animation1.duration);
                this.toggleInput();
            }
        }
    }

}

class DragAndDrop{
    constructor(dragElement){
        
    }

   
}

class Zoom{
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
            var delta_percentage = val - this._zoom_percentage;
            this._zoom_percentage = val;
            this.animation.seek(this._zoom_percentage*this.animation.duration);

            var factor = delta_percentage * (this.max_zoom_factor-1);
            var dx = (this.mouseX)  * factor;
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
            //translateX: '-1000vw',
            //translateY: '-1000vh',

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
        this.mouseX = event.clientX
        this.mouseY = event.clientY;
        //console.log ("X: " + this.mouseX + "Y: " + this.mouseY);
    }

    scrollToBottom(){
        document.body.scrollTop = document.body.scrollHeight;
    }
}
