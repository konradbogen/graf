class UI {
    constructor () {
        this.entry_position;
        this.font; 
        this.background_color;
        this.mainDiv;
        this.inputDiv;
        this.textArea;
        this.submitButton;
        this.menuButton;
    }

    createMainDiv () {
        this.mainDiv = document.createElement ("div")
        this.mainDiv.class = "mainDiv"
        this.mainDiv.style.display = "flex";
        this.mainDiv.style.justifyContent = "flexStart";
        this.mainDiv.style.fontFamily = "Courier New"
        this.mainDiv.style.backgroundColor = this.background_color;
    }


}