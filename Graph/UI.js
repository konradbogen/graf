class UI {
    constructor () {
        this.entry_position;
        this.font; 
        this.background_color;
        this.flexContainer;
        this.graphContainer = new UIGraphContainer ("graphContainer");
        this.inputContainer = new UIInputContainer ("inputContainer");
        this.create_html ();
        this.menuButtonSvg;
    }

    load_page () {

    }
    
    create_html () {
        this.flexContainer = document.createElement ("div");
        this.flexContainer.className = "flexContainer"
        this.create_menu_button ();
        this.flexContainer.appendChild (this.inputContainer.div);
        this.flexContainer.appendChild (this.graphContainer.div)
        document.body.appendChild (this.flexContainer);
    }


    create_menu_button () {
        /* this.menuButtonSvg = document.createElementNS (SVG_NAMESPACE, "svg")
        this.menuButtonSvg.setAttributeNS (SVG_NAMESPACE, "className", "menu")
        this.menuButtonSvg.setAttributeNS (SVG_NAMESPACE, "style", "menu {viewBox: 0 0 75 75;}");
        //var path = document.createElement ("path");
        for (var i = 0;  i<3; i++) {
            var line = document.createElement ("line");
            line.class = "button";
            line.stroke="black";
            line.strokeWidth = "5px";
            line.x1 = 20; line.x2 = 80;
            line.y1 = line.y2 = 30+20*i;
            this.menuButtonSvg.append (line);
        }
        document.body.append (this.menuButtonSvg); */
    }

}

class UIGraphContainer {
    constructor (name) {
        this.div;
        this.name = name;
        this.create_html ();
        this.backgroundColor = "white";
        this.font = "Courier New";
    }

    create_html () {
        this.div = document.createElement ("div");
        this.div.className = "graphContainer";
    }

    set backgroundColor (val) {
        this.div.style.backgroundColor = val;
    }

    set font (val) {
        this.div.style.fontFamily = val;
    }


}

class UIInputContainer {
    constructor (name) {
        this.name = name;
        this.div;
        this.textArea;
        this.header;
        this.submitButton;
        this._is_visible;
        this.create_div ();
        this.create_header ();
        this.create_textArea ();
        this.create_submitButton ();
    }

    get is_visible () {
        return this._is_visible;
    }

    set is_visible (val) {
        this._is_visible = val;
        if (val) {
            this.div.className = "inputContainer faderight";
        }else {
            this.div.className = "inputContainer";
        }
    }

    toggle_visible () {
        console.log ("toggle");
        this.is_visible = !this.is_visible;
    }
    create_header () {
        this.header = document.createElement ("h2");
        this.header.innerHTML = "input"
        this.div.appendChild (this.header);
    }

    create_div () {
        this.div = document.createElement ("div");
        this.div.className = "inputContainer";
    }

    create_textArea () {
        this.textArea = document.createElement ("textarea");
        this.textArea.id = "input";
        this.textArea.className = "textarea";
        this.div.append (this.textArea);
    }

    create_submitButton () {
        this.submitButton = document.createElement ("button");
        this.submitButton.id = "submit";
        this.submitButton.innerHTML = "submit"
        this.submitButton.className = "submitButton"
        this.div.append (this.submitButton);
    }

    set_textArea_style () {
   /*      var style_text = "textarea:focus{border-top:solid white; border-bottom:solid white; outline:0px !important; -webkit-appearance:none; box-shadow: none !important;}";
        this.textArea.styleSheet = styles;
        this.textArea.style.position = "relative";
        this.textArea.style.width = "100%";
        this.textArea.style.height = "80%";
        this.textArea.style.overflow-y = "scroll";
        this.textArea.style.background = "inherit";
        this.textArea.style.borderTop = "solid black";
        this.textArea.style.borderBottom = "solid black";
        this.textArea.style.fontFamily = "'Oswald', sans-serif";
        this.textArea.style.resize = "none";
        this.textArea.style.border = "none"; */
    }

    set_submitButton_style () {

    }

}