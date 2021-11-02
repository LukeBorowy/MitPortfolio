/*jshint esversion: 6 */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Baloo Paaji";

var campos = [0, 0];
var serverFrames=200.0;
var clientFrames=100.0;
var updateRatio = serverFrames/clientFrames;

function getAngle(p1, p2) {
    var angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
    return angleDeg - 180;
}
var TO_RADIANS = Math.PI / 180;
function cli_rotate_point(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
        y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
    };
}
function drawRotatedImage(image, x, y, angle) {

    // save the current co-ordinate system
    // before we screw with it
    ctx.save();

    // move to the middle of where we want to draw our image
    ctx.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    ctx.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image
    ctx.drawImage(image, - (image.width / 2), - (image.height / 2));

    // and restore the co-ords to how they were when we began
    ctx.restore();
}
function toTrueItem(itemType) {
    return "true"+itemType.charAt(0).toUpperCase() + itemType.slice(1);
}
function flipHorizontally(img, x, y, ctx, width, height) {
    // move to x + img's width

    width = width || img.width;
    height = height || img.height;
    ctx.translate(x + width, y);

    // scaleX by -1; this "trick" flips horizontally
    ctx.scale(-1, 1);

    // draw the img
    // no need for x,y since we've already translated
    ctx.drawImage(img, 0, 0, width, height);

    // always clean up -- reset transformations to default
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function intr(n) {
    return Math.round(n);
}
function int(n) {
    return Math.floor(n);
}
var boosting = false;
function gameStartHandlers() {
    socket.on('update', updateHandler);
    
    socket.on('all', allHandler);
    socket.on('shapechange', shapechangeHandler);
    socket.on('healthchange', healthchangeHandler);
    socket.on('echange', echangeHandler);
    socket.on('effect', effectHandler);
    socket.on('seffect', seffectHandler);
    socket.on('meffect', meffectHandler);
    socket.on('newshape', newshapeHandler);
    socket.on('delplayer', delplayerHandler);
    socket.on('delproj', delprojHandler);
    socket.on('newplayer', newplayerHandler);
    socket.on('newproj', newprojHandler);
    socket.on('dead', deadHandler);
    socket.on('maxboost', maxboostHandler);
    socket.on('boostchange', boostchangeHandler);
    socket.on('ammoAmount', ammoAmountHandler);

    socket.on("abilused",abilusedHandler);
    socket.on("newotherobject",newotherobjectHandler);
    socket.on("removeotherobject",removeotherobjectHandler);
    socket.on("otherobjectchange",otherobjectchangeHandler);
    socket.on("otherinfo",otherinfoHandler);
}
gameStartHandlers();

function drawGrid(ctx) {
    ctx.strokeStyle = '#000000';
    //ctx.beginPath();
    xx = -campos[0] % 1500
    yy = -campos[1] % 900

    ctx.drawImage(bgrid, xx, yy);
    if (campos[0] < mapw - 1500) {
        ctx.drawImage(bgrid, xx + 1500, yy);
    }
    if (campos[1] < maph - 900) {
        ctx.drawImage(bgrid, xx, yy + 900);
    }
    if (campos[1] < maph - 900 && campos[0] < mapw - 1500) {
        ctx.drawImage(bgrid, xx + 1500, yy + 900);
    }

    ctx.stroke();
}
var mx = 0;

var my = 0;
var ang = 0;
var cli_obs = {};
var cli_projs = {};
var cli_players = {};
var cli_otherObjects={};
var dt = [];
var odt = [];
var geffects = [];
var joyTouchId = false;
var attackTouchId = false;
var myPlayer;
var buyButtonY;
var screenxr = window.innerWidth / 1500;
var screenyr = window.innerHeight / 900;
var hover = 'none';
var mouseInShop = false;


function drawShapes() {
    var vals = Object.values(cli_obs);
    for (var shape of vals) {
        //if(shapeid=="remove"){continue}
        //if (!cli_obs.hasOwnProperty(shapeid)) { continue }//dont try to show "remove"
        ctx.fillStyle = "#00ff00";
        //shape = cli_obs[shapeid];
        var adjX = shape.pos[0] - campos[0];
        var adjY = shape.pos[1] - campos[1];
        
        if (shape.type == 1) {
            ctx.fillRect(adjX - 36, adjY - 60, (shape.health / 50) * 70, 10);
            ctx.drawImage(triangle, adjX - 39, adjY - 34);
        }
        if (shape.type == 2) {
            ctx.fillRect(adjX - 36, adjY - 60, (shape.health / 150) * 70, 10);
            ctx.drawImage(square, adjX - 33, adjY - 33);
        }
        if (shape.type == 3) {
            ctx.fillRect(adjX - 36, adjY - 60, (shape.health / 450) * 70, 10);
            ctx.drawImage(pentagon, adjX - 37, adjY - 34);
        }
        if (shape.type == 4) {
            ctx.fillRect(adjX - 36, adjY - 60, (shape.health / 1350) * 70, 10);
            ctx.drawImage(hexagon, adjX - 38, adjY - 32);
        }
        if (shape.dt.length > 0) {
            ctx.fillStyle = "#ff0000";
            ctx.textAlign = "right";
        }
        for (var t of shape.dt) {

            ctx.globalAlpha = t[1];
            y = adjY - 50 - (50 * (1 - t[1]));

            ctx.fillText("-" + t[0], adjX + 35, y);
        }
        donef = [];
        for (var ef of shape.effects) {
            ctx.globalAlpha = 1;
            if (ef[0] == 0) {
                ctx.globalAlpha = ef[1] / ef[2];
                ctx.drawImage(stunstars, adjX - 48, adjY - 110);
            }
            if (ef[0] == 1) {
                if (ef[3] - 0 != 0) {
                    r = (ef[3] + (ef[2] - ef[1])) % 200;
                } else {
                    r = ef[1] % 200;
                }

                r1 = r;
                if (r1 > 100) {
                    r1 = 200 - r1;
                }
                r1 = 40 + r1 * 0.25;
                r2 = 40 + (25 - (r1 - 40));

                ctx.drawImage(fireicon, adjX - 48, (50 - r1) + adjY - 30, 50, r1);
                ctx.drawImage(fireicon, adjX + 2, (50 - r2) + adjY - 30, 50, r2);
            }
        }
        ctx.globalAlpha = 1;
    }
}
function drawcli_otherObjects(){
    var vals = Object.values(cli_otherObjects);
    for (var object of vals) {
        var adjX = object.pos[0] - campos[0];
        var adjY = object.pos[1] - campos[1];
        if(object.type==0){//farmer crop
            var image=farmerCropSmallImage;
            if(object.health==5){
                image=farmerCropImage;
            }else{
                //health. only draw if it is growing 
                ctx.beginPath();
                ctx.fillRect(adjX - 35, adjY - 40, object.health * 14, 10);
            }
            ctx.drawImage(image,adjX-image.width/2,adjY-image.height/2);
            

        }

    }
}
function drawWeapon(player, adjX, adjY) {
    var usim;
    var it = weaponsD[player.weapon.withoutSpaces()];
    if (player.facing == "right") {
        usa = player.anim + 42;
        usim = it.ri;
        if (it.type == "Ranged" && player.reloading) {
            usim = it.reloadingImgRight;
        }
        offx = (it.offy != undefined ? -it.offy : 0);
    } else {
        usa = -(player.anim + 42);
        usim = it.pi;
        if (it.type == "Ranged" && player.reloading) {
            usim = it.reloadingImg;
        }
        offx = (it.offy != undefined ? it.offy : 0);
    }

    offy = (it.offx != undefined ? it.offx : 0);
    pos = cli_rotate_point(adjX - offx, (adjY - ((it.len / 2) + 40)) - offy, adjX, adjY, usa);
    drawRotatedImage(usim, pos.x, pos.y, usa);

}
function drawcli_players() {
    var vals = Object.values(cli_players);
    for (var player of vals) {
        //if(pid=="remove"){continue}
        //if (!cli_players.hasOwnProperty(pid)) { continue }
        //player = cli_players[pid];
        var adjX = player.pos[0] - campos[0];
        var adjY = player.pos[1] - campos[1];
        ctx.fillStyle = "#00ff00";
        ctx.strokeStlye = "#000000";
        ctx.lineWidth = 2;
        var boostLinesY = -50;
        var boostLinesX = 80;
        
        if (player.facing == "right") {
            if (player.boosting) {
                ctx.drawImage(boostlines, adjX - boostLinesX, adjY + boostLinesY);
            }
            if (player.chest) {
                it = chestD[player.chest.withoutSpaces()];
                if (it.backim) {
                    ctx.drawImage(it.backr, adjX - (it.back.width / 2), it.by + adjY - (it.back.height / 2));
                }
            }
            ctx.drawImage(stickmanr, adjX - 40, adjY - 96);
            ctx.beginPath();
            ctx.moveTo((2 + adjX), (-1 + adjY));
            ctx.lineTo(adjX + pp[player.anim][0], adjY + pp[player.anim][1]);
            ctx.stroke();
            if (player.weapon) {
                drawWeapon(player, adjX, adjY);
            }
            if (player.boots) {
                it = bootsD[player.boots.withoutSpaces()];
                ctx.drawImage(it.pi, adjX - (it.pi.width / 2), (adjY + 30) + it.rh + it.by);

            }
            if (player.chest) {
                it = chestD[player.chest.withoutSpaces()];
                ctx.drawImage(it.ri, adjX - (it.pi.width / 2), it.by + adjY - (it.pi.height / 2));

            }
            if (player.helmet) {
                it = helmetsD[player.helmet.withoutSpaces()];
                ctx.drawImage(it.ri, adjX - (it.pi.width / 2)+1, adjY - 40 - (it.pi.height * 2) + it.by);//+1 in X to make up for asymmetrical stickman image
            }

        } else {
            if (player.boosting) {
                ctx.drawImage(boostlines, adjX + (boostLinesX - 67), adjY + boostLinesY);
            }
            if (player.chest) {
                it = chestD[player.chest.withoutSpaces()];
                if (it.backim) {
                    ctx.drawImage(it.back, adjX - (it.back.width / 2), it.by + adjY - (it.back.height / 2));
                }
            }
            ctx.drawImage(stickmanl, adjX - 40, adjY - 96);
            ctx.beginPath();
            ctx.moveTo(adjX, (-1 + adjY));
            ctx.lineTo(adjX - pp[player.anim][0], adjY + pp[player.anim][1]);
            ctx.stroke();
            if (player.weapon) {
                drawWeapon(player, adjX, adjY);
            }
            if (player.boots) {
                it = bootsD[player.boots.withoutSpaces()];
                ctx.drawImage(it.pi, adjX - (it.pi.width / 2), (adjY + 30) + it.rh + it.by);
            }
            if (player.chest) {
                it = chestD[player.chest.withoutSpaces()];
                ctx.drawImage(it.pi, adjX - (it.pi.width / 2), it.by + adjY - (it.pi.height / 2));
            }
            if (player.helmet) {
                it = helmetsD[player.helmet.withoutSpaces()];
                ctx.drawImage(it.pi, adjX - (it.pi.width / 2), adjY - 40 - (it.pi.height * 2) + it.by);
            }

        }

        //health
        ctx.beginPath();
        ctx.fillRect(adjX - 36, adjY - 120, (player.chealth / player.mhealth) * 70, 10);
        //name
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(player.name, adjX, adjY - 125);
        //damagenotes
        ctx.textAlign = "right";

        for (var t of player.dt) {
            ctx.globalAlpha = t[1];
            y = adjY - 120 - (50 * (1 - t[1]));
            if (t[0] < 1) {
                ctx.fillStyle = "#ff0000";
                ctx.fillText(t[0], adjX + 35, y);
            } else {
                ctx.fillStyle = "#00ff00";
                ctx.fillText("+" + t[0], adjX + 35, y);
            }
        }
        ctx.globalAlpha = 1;
        for (var ef of player.effects) {

            if (ef[0] == 0) {
                ctx.globalAlpha = ef[1] / ef[2];
                ctx.drawImage(stunstars, adjX - 48, adjY - 110);
            }else if (ef[0] == 1) {
                if (ef[3] - 0 != 0) {
                    r = (ef[3] + (ef[2] - ef[1])) % 200;
                } else {
                    r = ef[1] % 200;
                }
                r1 = r;
                if (r1 > 100) {
                    r1 = 200 - r1;
                }
                r1 = 40 + r1 * 0.25;
                r2 = 40 + (25 - (r1 - 40));

                ctx.drawImage(fireicon, adjX - 48, (50 - r1) + adjY - 90, 50, r1);
                ctx.drawImage(fireicon, adjX + 2, (50 - r2) + adjY - 90, 50, r2);
            }else if (ef[0]==2){
                var loopedCycle=(Math.sin(ef[1]*0.01)+1)/2;
                
                var loopedCycle2=(Math.sin((ef[1]+50)*0.01)+1)/2;

                ctx.font="40px Baloo Paaji";
                ctx.fillStyle="#b70000";
                ctx.globalAlpha = 1-((Math.sin(ef[1]*0.05)+1)/2)*0.25;

                
                ctx.fillText("ᚠ",adjX+60+loopedCycle*10,adjY-40+loopedCycle2*10);
                ctx.fillText("ᚢ",adjX-40+loopedCycle2*10,adjY-30+loopedCycle*10);
                ctx.fillText("ᚦ",adjX+50+loopedCycle*10,adjY-110+loopedCycle2*10);

                ctx.globalAlpha = 1-((Math.sin((ef[1]+40)*0.05)+1)/2)*0.25;
                ctx.fillText("ᚨ",adjX-50+loopedCycle2*10,adjY-110+loopedCycle*10);
                ctx.fillText("ᚱ",adjX-60+loopedCycle*10,adjY-85+loopedCycle2*10);
                ctx.fillText("ᚲ",adjX+70+loopedCycle2*10,adjY-85+loopedCycle*10);
                ctx.font="30px Baloo Paaji";
            }

        }

        ctx.globalAlpha = 1;
        
        if(player.otherInfo.PhantomScare){
            ctx.drawImage(phantomScared, adjX-80, adjY-135);
        }

        //draw rect for collisions 
        //ctx.strokeRect(adjX-25,adjY-75,50,150)

    }
}
function drawcli_projs() {
    var vals = Object.values(cli_projs);
    for (var proj of vals) {//draw projectiles
        //if(pid=="remove"){continue}
        //if (!cli_projs.hasOwnProperty(pid)) { continue }
        //proj = cli_projs[pid];
        it = weaponsD[proj.type.withoutSpaces()];
        if (proj.displayDistance >= it.dispDist) {
            drawRotatedImage(it.ammo, (proj.pos[0] - campos[0]), (proj.pos[1] - campos[1]), proj.ang);
        }

    }
}
function drawGEffects() {//draw g(lobal) effects
    for (var ef of geffects) {

        if (ef[0] == 2) {//Tesla
            if(Math.random()>0.25){//for flickering effect
                ctx.strokeStyle = "#7df9ff";
                ctx.globalAlpha = ef[1] / 200;
                ctx.lineWidth = 5;
                ctx.beginPath();
                for (var bolt of ef[2]) {
                    ctx.moveTo(bolt[0][0] - campos[0], bolt[0][1] - campos[1]);
                    for (var p of bolt) {
                        ctx.lineTo(p[0] - campos[0], p[1] - campos[1]);
                    }

                }
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
            }

        }
        if(ef[0] == 4){//wizard poof
            var percentDone=ef[1] / 100;
            ctx.globalAlpha=percentDone;
            var amountOut=(ef[2][1] ? percentDone: (1- percentDone));
            ctx.fillStyle="#234b68";
            for(var ang=0;ang<360;ang+=72){
                ctx.beginPath();

                var xChange=Math.sin(TO_RADIANS*ang)*100*amountOut;
                var yChange=Math.cos(TO_RADIANS*ang)*100*amountOut;
                ctx.arc(ef[2][0][0]-campos[0]+xChange, ef[2][0][1]-campos[1]+yChange, 50, 0, 2 * Math.PI);
                ctx.fill();

            }
            
            ctx.beginPath();
            ctx.globalAlpha=1;


        }
        if(ef[0] == 5){//rpg boom
            var width, height;
            var percentDone=(1-ef[1] / 100);
            if(percentDone<=0.5){
                width=explosionImage.width*(percentDone*2);
                height=explosionImage.height*(percentDone*2);
            }else{
                ctx.globalAlpha=1-((percentDone-0.5)*2);
                width=explosionImage.width;
                height=explosionImage.height;	

            }
            
            ctx.drawImage(explosionImage,ef[2][0]-campos[0]-width/2,ef[2][1]-campos[1]-height/2,width,height);
            
            ctx.beginPath();
            ctx.globalAlpha=1;

        }
        if (ef[0] == "debug") {
            ctx.fillStyle = "red";
            ctx.fillRect(ef[2][0] - campos[0], ef[2][1] - campos[1], 50, 50);
        }
    }
}

function drawViewport() {
    if (posRecieved) {
        ctx.clearRect(0, 0, canv.width, canv.height);//maybe remove, if so fix borders
        drawGrid(ctx);
        drawShapes();
        drawcli_otherObjects();
        
        drawcli_projs();

        drawcli_players();

        
        drawGEffects();
        

    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);//reset
    requestAnimationFrame(drawViewport);
    

}



function updateHandler(info) {
    if(myPlayer===undefined){
        return; //don't do anything if we have not recieved the original initialization for player.
    }

    if(myPlayer.hasHelmetAbil && myPlayer.abilTimer < helmetsD[myPlayer.trueHelmet.withoutSpaces()].abilRecharge)
    myPlayer.abilTimer+=1*updateRatio;

    for (var newp of info[0]) {

        p = cli_players['o' + newp[0]];
        if (p) {
            p.pos = newp[1];
            p.facing = newp[2];
            p.anim = newp[3];
            p.boosting = newp[4];
        }

    }
    var vals = Object.values(cli_obs);
    var donef;
    for (var shape of vals) {
        //if(shapeid=="remove"){continue}
        //if (!cli_obs.hasOwnProperty(shapeid)) { continue }//dont try to show "remove"
        //shape = cli_obs[shapeid];
        donef = [];
        for (var t of shape.dt) {
            t[1] -= 0.005*updateRatio;
            if (t[1] <= 0.005) {
                donef.push(t);
            }
        }
        for (var d of donef) {
            arrRemove(shape.dt, d);

        }
        donef = [];
        for (var ef of shape.effects) {
            ef[1] -= 1*updateRatio;
            if (ef[1] < 1) {
                donef.push(ef);
            }
        }
        for (var f of donef) {
            arrRemove(shape.effects, f);

        }
    }


    for (var newp of info[1]) {
        p = cli_projs['o' + newp[0]];
        if (p) {
            p.pos = newp[1];
            if(newp.length==3){
                p.ang=newp[2];
            }
        }

    }
    var vals = Object.values(cli_players);
    for (var player of vals) {
        //if(pid=="remove"){continue}
        //if (!cli_players.hasOwnProperty(pid)) { continue }
        //player = cli_players[pid];
        donef = [];
        for (var t of player.dt) {
            t[1] -= 0.005*updateRatio;
            if (t[1] <= 0.005) {
                donef.push(t);

            }
        }
        for (var r of donef) {
            arrRemove(player.dt, r);

        }
        donef = [];
        for (var ef of player.effects) {
            ef[1] -= 1*updateRatio;
            if (ef[1] < 1) {
                donef.push(ef);
            }
        }
        for (var f of donef) {
            arrRemove(player.effects, f);

        }
        if (player.reloading) {
            player.reloadRemaining -= 1*updateRatio;
            if (player.reloadRemaining <= 0) {
                player.reloading = false;
                if (player.id == myId) {
                    hideReloadIcon();
                    ammoAmountHandler(weaponsD[player.trueWeapon.withoutSpaces()].maxAmmo);
                }
            }
        }
    }
    donef = [];
    for (var ef of geffects) {
        ef[1] -= 1*updateRatio;
        if (ef[1] < 1) {
            donef.push(ef);

        }
    }
    for (var f of donef) {
        arrRemove(geffects, f);
    }
    var vals = Object.values(cli_projs);
    for (var proj of vals) {
        //proj = cli_projs[pid];
        proj.displayDistance += 5*updateRatio;
    }

    var vals=Object.values(cli_otherObjects);
    for(var object of vals){
        if(object.type==0){
            if(object.age<clientFrames*5){
                object.age+=1;
                
                if(object.age%clientFrames==0){
                    //console.log("did");
                    object.health+=1;
                }
            }
            
        }
    }
    

}
var firstId=0;
var secondId=0;
var thirdId=0;
function leaderboardHandler(info) {
    if(!posRecieved){return;}
    leaders = info;
    myPlace=-1;
    for (var leaderInd = 0; leaderInd<info.length; leaderInd++) {
        var leader = info[leaderInd];
        if(leaderInd==0){
            firstId=leader[2];
        }else if(leaderInd==1){
            secondId=leader[2];
        }else if(leaderInd==2){
            thirdId=leader[2];
        }
        if(myId==leader[2]){
            myPlace=leaderInd;
        }
    }
    
        
    drawLeaderboard();
}

function moneyChangeHandler(info) {
    myPlayer.money = info;
    //document.getElementById("money-display").innerHTML=info; UI-FIX

}

function allHandler(info) {
    
    cli_players = {};
    for (var nop of info[0]) {
        nop.dt = [];
        nop.chatColor="";
        cli_players["o" + nop.id] = nop;
    }
    cli_obs = {};

    for (var nob of info[1]) {
        nob.dt = [];
        cli_obs["o" + nob.id] = nob;

    }
    cli_projs = {};
    for (var nob of info[2]) {

        cli_projs["o" + nob.id] = nob;
    }
    
    cli_otherObjects = {};
    for (nob of info[6]) {
        if(nob.type==0){
            nob.health=Math.floor(nob.age / serverFrames);//because server uses real time
            nob.age=Math.floor((nob.age / serverFrames)*clientFrames);//convert to our time
        }

        cli_otherObjects["o" + nob.id] = nob;
    }
    firstId=0;
    secondId=0;
    thirdId=0;
    myId = info[3];
    myPlace=-1;
    myPlayer = cli_players["o" + myId];
    myPlayer.helmet = false;
    myPlayer.chest = false;
    myPlayer.weapon = false;
    myPlayer.boots = false;

    myPlayer.trueHelmet = false;//for spy hat, some stuff might not be true equipment
    myPlayer.trueChest = false;
    myPlayer.trueWeapon = false;
    myPlayer.trueBoots = false;

    //moneyChangeHandler(info[4]);UI-FIX
    myPlayer.money = info[4];
    myPlayer.hasBought = [];
    myPlayer.maxBoost = info[5];
    myPlayer.availBoost = info[5];
    myPlayer.availAmmo = 0;
    myPlayer.hasHelmetAbil=false;
    myPlayer.abilTimer=0;

    posRecieved = true;
}
function boostchangeHandler(info) {
    myPlayer.availBoost = info;
}
function maxboostHandler(info) {
    myPlayer.maxBoost = info[0];

    myPlayer.availBoost = info[1];
}

function deadHandler(msg) {
    

}


function shapechangeHandler(info) {

    cli_obs['o' + info.shape].dt.push([cli_obs['o' + info.shape].health - info.newp, 1]);
    cli_obs['o' + info.shape].health = info.newp;

}

function healthchangeHandler(info) {
    p = cli_players["o" + info[0]];
    var oldHeath = p.chealth;
    p.chealth = info[1];
    p.dt.push([info[1] - oldHeath, 1]);
    updateHealthDisplay(p);
}

function echangeHandler(info) {
    p = cli_players["o" + info[0]];
    p[info[2]] = info[1];

    p.mhealth = info[3];
    p.chealth = info[3] - info[4];
    var isFakeSpy=info[5];
    if (info[0] == myId && !isFakeSpy) {
        p[toTrueItem(info[2])] = info[1];
        var itemName=info[1].withoutSpaces();
        myPlayer.hasBought.push(info[1]);
        if (info[2] == "weapon") {
            var item = weaponsD[itemName];
            
            
        } else if (info[2] == "helmet"){
            var item = helmetsD[itemName];
            
        }


    }

}

function effectHandler(info) {
    p = cli_players["o" + info[0]];
    st = false;
    var ind = "n";
    if (info[1] == 1) {
        for (var e of p.effects) {
            if (e[0] == info[1]) {
                ind = p.effects.indexOf(e);
            }
            break;
        }
    }

    if (ind == "n") {
        var extra = [];
        p.effects.push([info[1], info[2], info[2], extra]);
    } else {
        var extra = [];
        if (info[1] == 1) {
            existingExtra = p.effects[ind][3];
            if (existingExtra.constructor === Array) {//
                extra = p.effects[ind][1];//make the flame keep its height
            } else {//already a repeat
                extra = p.effects[ind][3] + (info[2] - p.effects[ind][1]);//make the flame keep its height
            }
        }
        p.effects[ind] = [info[1], info[2], info[2], extra];
    }
}

function seffectHandler(info) {

    p = cli_obs["o" + info[0]];
    st = false;
    var ind = "n";
    if (info[1] == 1) {
        for (var e of p.effects) {
            if (e[0] == info[1]) {
                ind = p.effects.indexOf(e);
            }
            break;
        }
    }

    if (ind == "n") {
        var extra = [];
        p.effects.push([info[1], info[2], info[2], extra]);
    } else {
        var extra = [];
        if (info[1] == 1) {
            existingExtra = p.effects[ind][3];
            if (existingExtra.constructor === Array) {//
                extra = p.effects[ind][1];//make the flame keep its height
            } else {//already a repeat
                extra = p.effects[ind][3] + (info[2] - p.effects[ind][1]);//make the flame keep its height
            }
        }
        p.effects[ind] = [info[1], info[2], info[2], extra];
    }
}

function meffectHandler(info) {

    geffects.push(info);

}

function newshapeHandler(info) {
    cli_obs["o" + info.news.id] = info.news;
    cli_obs["o" + info.news.id].dt = [];
    delete cli_obs['o' + info.rem];

}

function delplayerHandler(info) {
    delete cli_players["o" + info];
}

function delprojHandler(info) {
    delete cli_projs["o" + info];
}

function newplayerHandler(info) {
    if (!cli_players["o" + info[0]]) {
        cli_players["o" + info[0]] = {
            pos: info[1],
            id: info[0],
            effects: [],
            dt: [],
            facing: "right",
            name: info[2],
            boosting: false,
            mhealth: 100,
            chealth: 100,
            anim: 0,
            helmet: false,
            chest: false,
            boots: false,
            weapon: false,
            otherInfo:{},
            chatColor:"",
        };
    }

}
function newprojHandler(info) {
    cli_projs["o" + info.id] = info;
    cli_projs["o" + info.id].displayDistance = 0;
}
function ammoAmountHandler(newAmmo) {
    
    myPlayer.availAmmo = newAmmo;
}
function reloadHandler(info) {
    var player = cli_players["o" + info[0]];
    player.reloading = true;
    player.reloadRemaining = info[1];
    
}
function abilusedHandler(info){
    myPlayer.abilTimer=0;
}
function newotherobjectHandler(info){
    if(info.type==0){
        info.age=0;
        info.health=0;
    }
    cli_otherObjects["o" + info.id] = info;
}
function removeotherobjectHandler(info){
    delete cli_otherObjects["o" + info];
}
function otherobjectchangeHandler(info){

}
function otherinfoHandler(info){
    var player = cli_players["o" + info[0]];
    player.otherInfo[info[1]]=info[2];
}
function chatHandler(info){
    if(info[2]=="chat"){
        var player=cli_players["o" + info[0]];
        var string=info[1];
        addChatMessage(player,string);
    }else if(info[2]=="info"){
        addThingInChat(info[1], "#FFFFFF");
    }

}
function stopitHandler(info){
    alert("Please don't open more than one tab. It's cheating.");
    socket.close();
}
var pp = [[27, -32], [27, -32], [28, -31], [28, -31], [29, -30], [30, -30], [30, -29], [31, -28], [31, -28], [32, -27], [32, -27], [32, -26], [33, -26], [33, -25], [34, -24], [34, -24], [35, -23], [35, -23], [35, -22], [36, -21], [36, -21], [37, -20], [37, -19], [37, -19], [38, -18], [38, -17], [38, -17], [39, -16], [39, -15], [39, -15], [39, -14], [40, -13], [40, -13], [40, -12], [40, -11], [40, -10], [41, -10], [41, -9], [41, -8], [41, -8], [41, -7], [41, -6], [42, -5], [42, -5], [42, -4], [42, -3], [42, -2], [42, -2], [42, -1], [42, 0], [42, 0], [42, 0], [42, 1], [42, 2], [42, 2], [42, 3], [42, 4], [42, 5], [42, 5], [41, 6], [41, 7], [41, 8], [41, 8], [41, 9], [41, 10], [40, 10], [40, 11], [40, 12], [40, 13], [40, 13], [39, 14], [39, 15], [39, 15], [39, 16], [38, 17], [38, 17], [38, 18], [37, 19], [37, 19], [37, 20], [36, 21], [36, 21], [35, 22], [35, 23], [35, 23], [34, 24], [34, 24], [33, 25], [33, 26], [32, 26], [32, 27], [32, 27], [31, 28], [31, 28], [30, 29], [30, 30], [29, 30], [28, 31], [28, 31], [27, 32], [27, 32], [26, -32]];
