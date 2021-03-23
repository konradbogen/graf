//graf.graph
var hptgn1 = new HPTGN ("noui", {
    hasUi: false,
    hasUiHeader: false,
    hasUiMenu: false,
    hasFileSystem: false,
    clickToOpenEnabled: false,
    zoomEnabled: false,
    dragEnabled: false,
    mouseOverEnabled: false,
    passStartNodeInUrl: false,
    lightTheme: false, 
    audioEnabled: false,      
    fileSystemDirectory: "/TestGraph/Ship/FileSystem", 
    frameEnabled: false
});
hptgn1.update_input ("Hallo\nWelt.Berlin");

//graf.filesystem
var hptgn2 = new HPTGN ("noui_filesystem", {
    hasUi: false,
    hasUiHeader: false,
    hasUiMenu: false,
    hasFileSystem: true,
    clickToOpenEnabled: false,
    zoomEnabled: false,
    mouseOverEnabled: false,
    passStartNodeInUrl: false,
    dragEnabled: false,
    lightTheme: false, 
    audioEnabled: false,      
    fileSystemDirectory: "/TestGraph/Ship/FileSystem", 
    frameEnabled: false
});
hptgn2.load_files ("TestDark");

//graf.visual.clicktoenter
var hptgn3 = new HPTGN ("noui_clicktoopen", {
    hasUi: false,
    hasUiHeader: false,
    hasUiMenu: false,
    hasFileSystem: true,
    clickToOpenEnabled: true,
    zoomEnabled: false,
    dragEnabled: false,
    mouseOverEnabled: false,
    passStartNodeInUrl: false,
    lightTheme: false,   
    audioEnabled: false,    
    fileSystemDirectory: "/TestGraph/Ship/FileSystem", 
    frameEnabled: false
});
hptgn3.load_files ("TestDark");

//graf.visual.clicktoenter
var hptgn4 = new HPTGN ("noui_zoom", {
    hasUi: true,
    hasUiHeader: false,
    hasUiMenu: false,
    hasFileSystem: true,
    clickToOpenEnabled: true,
    zoomEnabled: false,
    dragEnabled: true,
    mouseOverEnabled: false,
    passStartNodeInUrl: false,
    lightTheme: false, 
    audioEnabled: false,     
    fileSystemDirectory: "/TestGraph/Ship/FileSystem", 
    frameEnabled: false
});
hptgn4.load_files ("TestDark");

//graf.frame
var hptgn5 = new HPTGN ("noui_filesystem_frame", {
    hasUi: true,
    hasUiHeader: false,
    hasUiMenu: false,
    hasFileSystem: true,
    clickToOpenEnabled: true,
    zoomEnabled: false,
    dragEnabled: true,
    mouseOverEnabled: false,
    passStartNodeInUrl: false,
    lightTheme: false,
    audioEnabled: true,   
    fileSystemDirectory: "/TestGraph/Ship/FileSystem", 
    frameEnabled: true
});
hptgn5.load_files ("/");
hptgn5.start_node = "Fotos";

//graf.frame
var hptgn6 = new HPTGN ("noui_filesystem_audiomousehover", {
    hasUi: true,
    hasUiHeader: false,
    hasUiMenu: false,
    hasFileSystem: true,
    clickToOpenEnabled: true,
    zoomEnabled: false,
    dragEnabled: true,
    mouseOverEnabled: true,
    lightTheme: false,
    passStartNodeInUrl: false,
    audioEnabled: true,   
    fileSystemDirectory: "/TestGraph/Ship/FileSystem", 
    frameEnabled: true
});
hptgn6.load_files ("/");
