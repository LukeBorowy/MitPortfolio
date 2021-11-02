

startGame = function () {

    if (state == "login" && ready) {
        gameStartHandlers();
        fadeGame(true);
        setTimeout(updateScreenSize, 5000);

    }
};
var lastYr=0;
var lastXr=0;
//var trigs=0;
function updateScreenSize() {
    screenxr = window.innerWidth / 1500;
    screenyr = window.innerHeight / 900;
    if(lastXr==screenxr && lastYr==screenyr){return;}
    lastXr=screenxr;
    lastYr=screenyr;
    if (state == "game") {
        if (isMobile) {
            /*trigs+=1;
            debText="trig:"+trigs;*/
            //alert(window.innerHeight);
            if(document.activeElement.id=="chat-input"){
            
                

            }else{
                document.getElementById("gameStuff").style.height = window.innerHeight + "px";
                window.scrollTo(0, 0);
            }
            

        }
        
    }
    updateBoostCanvasWidth(boostBar.offsetWidth);
}

setInterval(updateScreenSize, 1000);

//http://stikk.localtunnel.me/
function start(e) {
    if (!e) { e = window.event; }
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        window.scrollTo(0, 0);
        updateScreenSize();
        startGame();
        
    }
}

state = "loading";
lstate = "loading";
posRecieved = false;
var fadeOutConnecting = function () {
    elem = document.getElementById("loading");
    elem.style.opacity = 0;

};
var fadeGame = function (visible) {
    var gameOp = visible ? 1 : 0;
    var gameZ = visible ? 99 : -1;
    var startZ = visible ? -1 : 99;
    var startOp = visible ? 0 : 1;
    posRecieved = false;
    var elem = document.getElementById("name");
    elem.disabled = visible;
    elem.blur();
    elem.style.caretColor = visible ? "transparent" : "auto";
    state = visible ? "game" : "login";
    elem = document.getElementById("gameStuff");
    elem.style.opacity = gameOp;
    elem.style.zIndex = gameZ;

    elem = document.getElementById("starts");
    elem.style.opacity = startOp;
    elem.style.zIndex = startZ;

    if (visible) {
        requestAnimationFrame(drawViewport);
    }
};
function cancelDrag(e){
    if(e.target.id=="chat-messages"){

    }else{
        return false;
    }
}
var lastWid = 1000;
function updateBoostCanvasWidth(width) {
    if (lastWid == width) { return; }
    lastWid = width;
    boostCanvas.width = width;
    boostMaxWidth = width;
    boostCtx.fillStyle = "#00e1ff";
    lastDrawn = -1;//must redraw next frame
}
document.getElementById("name").onkeydown = start;
document.getElementsByTagName("body")[0].ondragstart = cancelDrag;