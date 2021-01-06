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
        var string =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/;
        this.zoomElement = document.getElementById('graphContainer');
        this.animation;
        this.percentage;
        this.callbacks = [];
        window.addEventListener('scroll', this.zoom.bind(this));


        this.animation = anime({
            targets: this.zoomElement,
            width: {
                value: '*=10',
            },
            height: {
                value: '*=10',
            },
            translateX: '-500vw',
            translateY: '-500vh',
    
            easing: 'linear',
            autoplay: false
        
        });
        this.mobile = false;
        if(string.test(navigator.userAgent) ) {
            this.mobile = true;
        }
    }


        zoom(){
            if (this.mobile == false) {
            this.percentage=this.getScrollPercentage ();
            this.animation.seek(this.animation.duration * (this.percentage * 0.01));
            this.callbacks.forEach(c => {
                c(this.percentage);
            })
        }
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
        ) * 100;
    }

}
