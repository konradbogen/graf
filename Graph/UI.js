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
        this.dragElement = document.getElementById(dragElement);
        this.dragElement.onmousedown = this.dragMouseDown.bind(this);
        this.pos1;
        this.pos2;
        this.pos3;
        this.pos4;
    }

    dragMouseDown(e){
        e = e ||  window.event;
        e.preventDefault();
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement;
        document.onmousemove = this.elementDrag.bind(this);
    }

    elementDrag(e){
        e = e || window.event;
        e.preventDefault();
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        this.dragElement.style.top = (this.dragElement.offsetTop - this.pos2) + "px";
        this.dragElement.style.left = (this.dragElement.offsetLeft - this.pos1) + "px";
    }

    closeDragElement(){
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

class Zoom{
    constructor(){
        this.zoomElement = document.getElementById('graphContainer');
        this.animation;
        this._percentage;
        this.mouseX;
        this.mouseY;
        this._moveX = 0;
        this._moveY = 0;
        this.callbacks = [];
        this.MAXZOOMFACTOR = 10
        window.addEventListener('scroll', this.zoom.bind(this));
        window.addEventListener('mousemove', this.setMousePosition.bind(this));
    }

    get percentage () {
        return this._percentage;
    }

    set percentage (val) {
        this._percentage = val;
        var css_width_percentage = 100+100 * this.MAXZOOMFACTOR * val;
        var  css_height_percentage = 100+ 100 * this.MAXZOOMFACTOR * val;
        this.zoomElement.style.width = css_width_percentage + "%";
        this.zoomElement.style.height = css_height_percentage + "%";
    }

    get moveX () {
        return this._moveX;
    }

    get moveY () {
        return this._moveY;
    }

    set moveX (val) {
        this._moveX = val;
        this.zoomElement.style.transform = "translateX(" + this._moveX + "px)";
    }

    set moveY (val) {
        this._moveY = val;
        this.zoomElement.style.transform = "translateY(" + this._moveY + "px)";
    }
        
        // getMoveX () {
        //     return this.moveX;
        // }

        // getMoveY (){
        //     return this.moveY
        // }


        zoom(){

            this.moveX = (-1) * this.mouseX * this.percentage * (this.MAXZOOMFACTOR - 1) * 100;
            this.moveY = (-1) * this.mouseY * this.percentage * (this.MAXZOOMFACTOR - 1) * 100;
            this.percentage=this.getScrollPercentage ();
        }

        setMousePosition(e){
            e = e || window.event;
            e.preventDefault;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        }
      

    getWindowHeight(){
        return window.innerHeight || 
        document.documentElement.clientHeight ||
        document.body.clientHeight || 0;
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

    getScrollPercentage() {
        return (
            this.getWindowYScroll()  / (this.getDocHeight() - this.getWindowHeight())
        );
    }

}
