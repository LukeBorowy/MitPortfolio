/*jshint esversion: 6 */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Baloo Paaji";
var uicanvas = document.getElementById("uicanvas");
var uictx = uicanvas.getContext("2d");
var inshop = "not";
var leaders = [];
var campos = [0, 0];
var serverFrames=200.0;
var clientFrames=100.0;
var updateRatio = serverFrames/clientFrames;

var miniMapPos = (isMobile ? [1250, 0] : [1250, 750]);
if (isMobile) {

    

    var joystick = new JoyStick({
        radius: 50,
        inner_radius: 40
    });
    joystick.setVisible(false);
    var attackButton = document.createElement("img");
    attackButton.src = "img/attackButton.png";
    attackButton.id = "attackButton";
    document.getElementById("gameStuff").appendChild(attackButton);

    document.getElementById("ability-box").classList.add("touchscreen");
    chatInput.placeholder="Tap to chat...";
}else{
    boostBar.style.height="24px";
    document.getElementById("boost-text").style.fontSize="16px";
    document.getElementById("boost-text").style.top="calc(50% - 12px)";
}


function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        /*
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }*/
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

function getAngle(p1, p2) {
    var angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
    return angleDeg - 180;
}
var TO_RADIANS = Math.PI / 180;
function rotate_point(pointX, pointY, originX, originY, angle) {
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
    var boosting = false;
    var name = nameElem.value;
    socket.on('update', updateHandler);
    socket.on('leaderboard', leaderboardHandler);
    socket.on('moneyChange', moneyChangeHandler);
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
    socket.on('reload', reloadHandler);
    socket.on("abilused",abilusedHandler);
    socket.on("newotherobject",newotherobjectHandler);
    socket.on("removeotherobject",removeotherobjectHandler);
    socket.on("otherobjectchange",otherobjectchangeHandler);
    socket.on("otherinfo",otherinfoHandler);
    if(!socket.hasListeners("chat")){ socket.on("chat",chatHandler)};
    socket.on("stopit",stopitHandler);


    if (isMobile) {
        
        window.addEventListener('touchstart', touchstartEvent);
        window.addEventListener('touchend', touchendEvent);
        window.addEventListener('touchcancel', touchendEvent);
        window.addEventListener('touchmove', touchmoveEvent, { passive: false });
        window.addEventListener('keydown', chatSendKey);// simple keydown for sending on enter key.

        boostBar.addEventListener('touchstart', boostStart);
        ammoBoxElem.addEventListener('touchstart', forceReload);
        boostBar.addEventListener('touchend', boostEnd);
        boostBar.addEventListener('touchcancel', boostEnd);
        
    } else {
        window.addEventListener('mousemove', mousemoveEvent);
        window.addEventListener('mousedown', mousedownEvent);
        window.addEventListener('mouseup', mouseupEvent);

        window.addEventListener('keydown', keydownEvent);
        window.addEventListener('keyup', keyupEvent);

    }
    
    if (rejoinc) {
        socket.emit('newplayer', [name, rejoinc,localStorage.getItem("userID")]);
    } else {
        socket.emit('newplayer', [name, false,localStorage.getItem("userID")]);
    }

}

function removeGameHandlers() {
    window.removeEventListener('mousedown', mousedownEvent);
    window.removeEventListener('mousemove', mousemoveEvent);
    window.removeEventListener('mouseup', mouseupEvent);
    window.removeEventListener('keyup', keyupEvent);
    window.removeEventListener('keydown', keydownEvent);
    window.removeEventListener('keydown', chatSendKey);


    window.removeEventListener('touchstart', touchstartEvent);
    window.removeEventListener('touchend', touchendEvent);
    window.removeEventListener('touchcancel', touchendEvent);
    window.removeEventListener('touchmove', touchmoveEvent, { passive: false });

    boostBar.removeEventListener('touchstart', boostStart);
    boostBar.removeEventListener('touchend', boostEnd);
    boostBar.removeEventListener('touchcancel', boostEnd);
    ammoBoxElem.removeEventListener('touchstart', forceReload);

    if (isMobile) {
        joystick.setVisible(false);
        attackTouchId = false;
        joyTouchId = false;
    }
    abilBoxElem.style.display="none";
    socket.removeAllListeners();
    socket.on("chat",chatHandler);//keep chat running

}

function drawGrid(ctx) {
    //ctx.beginPath();
    xx = -campos[0] % 1500;
    yy = -campos[1] % 900;

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

    

}
function drawBorders(ctx) {
    //ctx.drawImage(chest[0].pi,0,0);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.rect(0 - campos[0], 0 - campos[1], mapw, maph);
    ctx.stroke();
    ctx.closePath();
}

function drawMiniMap(ctx) {
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#000000";
    ctx.rect(miniMapPos[0], miniMapPos[1], 250, 150);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(miniMapPos[0], miniMapPos[1], 250, 150);
    ctx.stroke();
    var vals = Object.values(players);
    for (var player of vals) {
        
        
        if(myPlace!=-1){
            if(myPlace==0){
                break;//if in first, no people on minimap
            }else if(myPlace==1 && player.id!=firstId){
                continue;
            }else if(myPlace==2 && player.id!=firstId && player.id!=secondId){
                continue;
            }
        }
        
        var mip=[player.pos[0] / 30, player.pos[1] / 30];
        ctx.moveTo(miniMapPos[0] + mip[0], miniMapPos[1] + mip[1]);
        ctx.arc(miniMapPos[0] + mip[0], miniMapPos[1] + mip[1], 1, 0, 2 * Math.PI);
        if(player.id==firstId){
            ctx.drawImage(leaderCrown,miniMapPos[0]+mip[0]-leaderCrown.width/2,miniMapPos[1]+mip[1]-leaderCrown.height/2-5);
        }
        
    }
    ctx.stroke();
    ctx.beginPath();
    pos = [campos[0] + 750, campos[1] + 450];
    var mip = [pos[0] / 30, pos[1] / 30];

    ctx.arc(miniMapPos[0] + mip[0], miniMapPos[1] + mip[1], 4, 0, 2 * Math.PI);

    
    ctx.fill();
    ctx.stroke();
    if(myPlace==0){
        ctx.drawImage(leaderCrown,miniMapPos[0]+mip[0]-leaderCrown.width/2,miniMapPos[1]+mip[1]-leaderCrown.height/2-7);
    }

    ctx.font = "20px Baloo Paaji";
    ctx.fillStyle = "#000000";
    var offy=isMobile ? 165:-5;
    ctx.fillText("Players: "+Object.keys(players).length,miniMapPos[0]+100,miniMapPos[1]+offy);
    ctx.font = "30px Baloo Paaji";
    
    

}

function drawLeaderboard() {
    var leaderElems = leaderboard.children;
    for (var i = 0; i < leaders.length; i++) {
        var leader = leaders[i];
        var name = leader[0];
        t = (i + 1) + ". " + name + ": " + leader[1];

        if (leaderElems.length <= i) {
            var newElem = document.createElement("span");
            newElem.className = "leader";
            leaderboard.appendChild(newElem);
        }
        leaderElems[i].innerText = t;
    }
    if (leaders.length < leaderElems.length) {
        leaderboard.removeChild(leaderElems[0]);
        drawLeaderboard();//Not true recursion, just redraw with new info
    }
}

function drawStats(ctx) {
    ctx.clearRect(0, 0, uicanvas.width, uicanvas.height);
    ctx.font = "30px Baloo Paaji";
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.75;
    roundRect(ctx, 1350, 350, 125, 50, 5, !0, !1);
    ctx.globalAlpha = 1.0;
    ctx.beginPath();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    var wid = ctx.measureText(myPlayer.money).width;
    ctx.fillText(myPlayer.money, 1425, 380); //1400,380
    ctx.drawImage(coinicon, 1400 - (wid / 2), 358);

    if (hover != "none") {
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.75;

        if (['Helmets', 'Chestplates', 'Boots', 'Weapons', 'Shop'].indexOf(hover) > -1) {
            roundRect(ctx, 1300, 295, 175, 50, 5, !0, !1); //150
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1.0;
            ctx.fillText(hover, 1387, 325);
        } else {
            th = 75;
            mine = "";
            if (inshop == "helmet") {
                if (myPlayer.trueHelmet) {
                    mine = helmetsD[myPlayer.trueHelmet.withoutSpaces()];
                }
            } else if (inshop == "chest") {
                if (myPlayer.trueChest) {
                    mine = chestD[myPlayer.trueChest.withoutSpaces()];
                }
            } else if (inshop == "boots") {
                if (myPlayer.trueBoots) {
                    mine = bootsD[myPlayer.trueBoots.withoutSpaces()];
                }
            } else if (inshop == "weapons") {
                if (myPlayer.trueWeapon) {
                    mine = weaponsD[myPlayer.trueWeapon.withoutSpaces()];
                }
            }
            ow = 25;
            if (hover.damage == undefined && mine.damage == undefined) {
                ddamage = "not";
            } else {
                ddamage = (mine.damage != undefined ? mine.damage : 0);
                th += ow;
            }

            if (hover.aspeed == undefined && mine.aspeed == undefined) {
                daspeed = "not";
            } else {
                daspeed = (mine.aspeed != undefined ? mine.aspeed : 0);
                th += ow;
            }

            if (hover.armorp == undefined && mine.armorp == undefined) {
                darmorp = "not";
            } else {
                darmorp = (mine.armorp != undefined ? mine.armorp : 0);
                th += ow;
            }

            if (hover.health == undefined && mine.health == undefined) {
                dhealth = "not";
            } else {
                dhealth = (mine.health != undefined ? mine.health : 0);
                th += ow;
            }

            if (hover.armor == undefined && mine.armor == undefined) {
                darmor = "not";
            } else {
                darmor = (mine.armor != undefined ? mine.armor : 0);
                th += ow;
            }

            if (hover.speed == undefined && mine.speed == undefined) {
                dspeed = "not";
            } else {
                dspeed = (mine.speed != undefined ? mine.speed : 0);
                th += ow;
            }
            if (hover.boostSpeed == undefined && mine.boostSpeed == undefined) {
                dboostSpeed = "not";
            } else {
                dboostSpeed = (mine.boostSpeed != undefined ? mine.boostSpeed : 0);
                th += ow;
            }
            if (hover.boosttime == undefined && mine.boosttime == undefined) {
                dboosttime = "not";
            } else {
                dboosttime = (mine.boosttime != undefined ? mine.boosttime : 0);
                th += ow;
            }
            if (isMobile) {
                th += 50;
            }
            if (hover.regen == undefined && mine.regen == undefined) {
                dregen = "not";
            } else {
                dregen = (mine.regen != undefined ? mine.regen : 0);
                th += ow;
            }

            if (hover.st == undefined) {
                dtext = "not";
            } else {
                if (hover.spec == "") {

                    t = hover.st;
                    dtext = [[], 0];
                    sl = t.split(" ");
                    tt = "";
                    toty = 25;
                    s = 20;
                    ctx.font = s + "px Baloo Paaji";
                    for (var word of sl) {
                        prev = tt;
                        tt = [tt, word].join(" ");
                        if (tt[0] == " ") {
                            tt = tt.replace(' ', '');
                        }
                        wid = ctx.measureText(tt).width;
                        if (wid > 210) {

                            tt = prev;
                            dtext[0].push(tt);
                            tt = word;
                            toty += 25;
                        }

                    }
                    dtext[0].push(tt);

                    dtext[1] = s;
                    th += toty;
                    hover.spec = [dtext[0], dtext[1], toty];
                } else {
                    dtext = hover.spec;
                    th += hover.spec[2];
                }

            }
            sp = 345 - th;
            roundRect(ctx, 1280, sp, 215, th, 5, !0, !1); //150
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1.0;
            ctx.font = "30px Baloo Paaji";
            wid = ctx.measureText(hover.name).width;
            s = 30;
            while (wid > 210) {
                ctx.font = s + "px Baloo Paaji";
                wid = ctx.measureText(hover.name).width;
                s -= 1;
            }
            ctx.fillText(hover.name, 1387, sp + 30);

            ctx.font = "30px Baloo Paaji";
            //Cost
            t = hover.cost;
            var owned = false;

            if (myPlayer.hasBought.indexOf(hover.name) != -1) {//already owned
                owned = true;

            }
            if (owned) {
                ctx.fillStyle = "#26ff00";
                t = "Bought";

            } else if (t <= myPlayer.money) {
                ctx.fillStyle = "#ffffff";
            } else {
                ctx.fillStyle = "#ff0000";
            }
            var wid = ctx.measureText(t).width;
            ctx.fillText(t, 1387, sp + 60);
            ctx.fillStyle = "#ffffff";
            if (!owned) {
                ctx.drawImage(coinicon, 1387 - (wid / 2) - 25, sp + 39);
            }
            dy = 91;
            //Buy Button
            if (isMobile) {
                ctx.fillStyle = "#108e00";
                buyButtonY = sp + 72;
                roundRect(ctx, 1280, buyButtonY, 215, 40, 5, !0, !1);
                ctx.fillStyle = "#ffffff";
                if (owned) {
                    t = "Equip";
                } else {
                    t = "Buy";
                }
                ctx.fillText(t, 1387, sp + 100);
                dy += 50;
            }
            //Health
            if (dhealth != "not") {
                t = (hover.health != undefined ? hover.health : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(hearticon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = dhealth;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;
            }
            if (darmor != "not") {
                t = (hover.armor != undefined ? hover.armor : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(shieldicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = darmor;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;
            }
            if (dspeed != "not") {
                t = (hover.speed != undefined ? hover.speed : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(speedicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = dspeed;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;

            }

            if (dboostSpeed != "not") {
                t = (hover.boostSpeed != undefined ? hover.boostSpeed : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(boostSpeedicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = dboostSpeed;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;

            }
            if (dboosttime != "not") {
                t = (hover.boosttime != undefined ? hover.boosttime : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(boosttimeicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = dboosttime;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;

            }
            if (daspeed != "not") {
                t = (hover.aspeed != undefined ? hover.aspeed : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(aspeedicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = daspeed;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;

            }
            if (ddamage != "not") {
                t = (hover.damage != undefined ? hover.damage : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(damageicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = ddamage;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;

            }
            if (darmorp != "not") {
                t = (hover.armorp != undefined ? hover.armorp : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(armorpicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = darmorp;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;

            }
            if (dregen != "not") {
                t = (hover.regen != undefined ? hover.regen : 0);
                wid = ctx.measureText(t).width;
                ctx.fillText(t, 1387, sp + dy);
                ctx.drawImage(regenicon, 1387 - (wid / 2) - 25, sp + (dy - 21));

                ctx.font = "20px Baloo Paaji";
                c = dregen;

                p = t - c;

                if (p > 0) {
                    t = "(+" + p + ")";
                    ctx.fillStyle = "#26ff00";
                } else if (p < 0) {
                    t = "(" + p + ")";
                    ctx.fillStyle = "#ff0000";
                } else {
                    t = "";
                }
                twid = ctx.measureText(t).width + wid;
                ctx.fillText(t, 1387 + (twid / 2), sp + dy);
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;
            }
            if (dtext != "not") {

                ly = 0;
                ctx.font = dtext[1] + "px Baloo Paaji";
                for (var line of dtext[0]) {
                    ctx.fillText(line, 1387, sp + dy + ly);
                    ly += 25;
                }
                ctx.font = "30px Baloo Paaji";
                ctx.fillStyle = "#ffffff";
                dy += 25;
            }
        }
    }
    ctx.globalAlpha = 1.0;
    drawShop(ctx);


}
function drawShop(ctx) {
    if (!ready) {
        inshop = 'not';
    }
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.75;
    roundRect(ctx, 1415, 410, 60, 60, 5, !0, !1);
    ctx.globalAlpha = 1;
    ctx.drawImage(shopicon, 1420, 415);
    ctx.beginPath();
    if (inshop != "not") {
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.75;
        roundRect(ctx, 1315, 405, 60, 240, 5, !0, !1);
        ctx.beginPath();
        ctx.moveTo(1375, 410);
        ctx.lineTo(1400, 440);
        ctx.lineTo(1375, 470);
        ctx.fill();
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.drawImage(helmeticon, 1320, 415);
        ctx.drawImage(chesticon, 1320, 475);
        ctx.drawImage(footicon, 1320, 535);
        ctx.drawImage(swordicon, 1320, 585);
    }
    if (inshop != 'not' && inshop != "cat") {
        ctx.fillStyle = "#000000";
        ctx.globalAlpha = 0.75;

        if (inshop == "helmet") {
            sy = 410;
            r = helmets.rect;
        } else if (inshop == "chest") {
            sy = 470;
            r = chest.rect;
        } else if (inshop == "boots") {
            sy = 530;
            r = boots.rect;
        } else if (inshop == "weapons") {
            sy = 590;
            r = weapons.rect;

        }

        roundRect(ctx, r[0], r[1], r[2], r[3], 5, !0, !1);

        ctx.beginPath();
        ctx.moveTo(1275, sy);
        ctx.lineTo(1300, sy + 30);
        ctx.lineTo(1275, sy + 70);
        ctx.fill();

        ctx.beginPath();
        ctx.globalAlpha = 1;
        if (inshop == "helmet") {
            rx = 1215;

            for (var item of helmets) {

                dx = item.pos[0] + ((60 - item.si.width) / 2);
                dy = item.pos[1];
                ctx.drawImage(item.si, dx, dy);

            }
        } else if (inshop == "chest") {
            rx = 1215;

            for (var item of chest) {

                dx = item.pos[0] + ((60 - item.si.width) / 2);
                dy = item.pos[1];
                ctx.drawImage(item.si, dx, dy);

            }
        } else if (inshop == "boots") {

            rx = 1215;

            for (var item of boots) {

                dx = item.pos[0] + ((60 - item.si.width) / 2);
                dy = item.pos[1];
                ctx.drawImage(item.si, dx, dy);

            }
        } else if (inshop == "weapons") {
            rx = 1215;

            for (var item of weapons) {

                dx = item.pos[0] + ((60 - item.si.width) / 2);
                dy = item.pos[1];
                ctx.drawImage(item.si, dx, dy);

            }
        }
    }
}

var mx = 0;

var my = 0;
var ang = 0;
var obs = {};
var projs = {};
var players = {};
var otherObjects={};
var geffects = [];
var joyTouchId = false;
var attackTouchId = false;
var myPlayer;
var buyButtonY;
var screenxr = window.innerWidth / 1500;
var screenyr = window.innerHeight / 900;
var hover = 'none';
var mouseInShop = false;
function getItemUnderMouse(mx, my) {
    mx = mx / screenxr;
    my = my / screenyr;
    var hover = "none";
    var change = false;
    var mouseInShop = false;
    if (mx > 1415 && mx < 1475 && my > 410 && my < 470) {
        change = true;
        mouseInShop = true;
        hover = 'Shop';

        //shop
    }
    if (inshop != "not") {

        if (mx > 1320 && mx < 1370 && my > 415 && my < 470) {
            change = true;

            hover = 'Helmets';
            //helmet
        } else if (mx > 1320 && mx < 1370 && my > 470 && my < 530) {
            change = true;

            hover = 'Chestplates';
            //chest
        } else if (mx > 1320 && mx < 1370 && my > 530 && my < 580) {
            change = true;

            hover = 'Boots';
            //boots
        } else if (mx > 1320 && mx < 1370 && my > 580 && my < 640) {
            change = true;

            hover = 'Weapons';
            //weapons
        }
        if (mx > 1320 && mx < 1420 && my > 415 && my < 640) {
            mouseInShop = true;
        }

        if (inshop != "cat") {

            if (inshop == "helmet") {
                cat = helmets;
            } else if (inshop == "chest") {
                cat = chest;
            } else if (inshop == "boots") {
                cat = boots;
            } else if (inshop == "weapons") {
                cat = weapons;
            }
            for (var i of cat) {
                if (mx < (i.pos[0] + 55) && mx > (i.pos[0]) && my < (i.pos[1] + 55) && my > (i.pos[1])) {
                    change = true;

                    hover = i;
                    break;
                }

            }
            if (mx > cat.rect[0] && mx < (cat.rect[0] + cat.rect[2] + 50) && my > cat.rect[1] && my < (cat.rect[1] + cat.rect[3])) {
                mouseInShop = true;
            }

        }
    }
    return [hover, change, mouseInShop];
}

function mousemoveEvent(e) {
    mx = e.pageX;
    my = e.pageY;
    scaledX=mx/screenxr;
    scaledY=my/screenyr;
    ang = getAngle([scaledX, scaledY], [750, 450]);
    dis = Math.hypot(scaledX - 750, scaledY - 450);
    var per = dis / 150;
    per=Math.min(1,per);
    //console.log(ang, "deg", per);

    if (mouseInShop) {
        per = 0;
    }

    socket.emit("dchange", [ang, per]);
    var res = getItemUnderMouse(mx, my);
    var oldHover = hover;
    hover = res[0];
    change = res[1];
    mouseInShop = res[2];
    if (change) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
        hover = 'none';
    }
    if (hover != oldHover) {
        drawStats(uictx);
    }
}

function keydownEvent(e) {
    if (!e) { e = window.event; }
    var keyCode = e.keyCode || e.which;
    if(document.activeElement.id!="chat-input"){// don't do stuff when *typing* a space
        if (keyCode == 32) {
            if (!boosting) {
                boostStart();
                
            }
        } else if (keyCode == 82) {
            forceReload();
        }else if (keyCode==65){
            attemptUseAbility();
        }
    }

    if(keyCode==13){

        if(e.target.id=="chat-input"){
            sendChat();//press enter to send.
        }else{
            chatInput.focus();//press enter to chat
        }
    }

}
function keyupEvent(e) {
    if (!e) { e = window.event; }
    var keyCode = e.keyCode || e.which;
    if (keyCode == 32) {
        boostEnd();
    }
}
function boostStart() {
    socket.emit("booststart");
    boosting = true;
}
function forceReload() {
    if (myPlayer.trueWeapon) {
        var weapon = weaponsD[myPlayer.trueWeapon.withoutSpaces()];
        if (weapon.type == "Ranged" && myPlayer.availAmmo < weapon.maxAmmo && !myPlayer.reloading) {
            socket.emit("reload");
        }
    }
}
function boostEnd() {
    socket.emit("boostend");
    boosting = false;
}
function chatSendKey(e){
    if(e.keyCode==13){

        if(e.target.id=="chat-input"){
            sendChat();//press enter to send.
        }
    }
}
function touchstartEvent(e) {
    
    if(e.target.id=="chat-input"){
        chatInput.focus();
    }else{
        if(e.target.id!="chat-messages" && e.target.id!="chat-message")
        e.preventDefault();
    }

    
    var t;
    for (var i = 0; i < e.changedTouches.length; i++) {
        //alert(t.target.id);

        t = e.changedTouches[i];
        mx = t.pageX;
        my = t.pageY;
        var id = t.identifier;
        if (attackTouchId === false) {
            if (t.target.id === "attackButton") {
                attackTouchId = id;

                socket.emit("astart");
                return false;//don't show joystick

            }
        }
        if(t.target.parentNode.id=="ability-box"){
            
            attemptUseAbility();
            return false;//don't show joystick
        }
        if(t.target.id=="chat-title"){
            toggleChat();
            return false;//don't show joystick
        }
        
        if(t.target.id=="boost-text" || t.target.id=="boost-canvas"){
            return; //don't show joystick
        }
        
        if (joyTouchId === false) {
            if (mx / screenxr < 1100) {
                joyTouchId = id;

                joystick.setVisible(true);
                joystick.setPos(mx, my);
            }
        }
        

        var res = getItemUnderMouse(mx, my);

        var clicked = res[0];
        if (clicked != "none") {

            hover = clicked;
            if (typeof (clicked) == "string") {
                handleClick(clicked);// category clicked
            } else {
                //item was clicked, dont buy. Buy when buy button pressed.
            }
        }
        if (typeof (hover) != "string") {
            if (mx / screenxr > 1280 && my / screenyr > buyButtonY && my / screenyr < buyButtonY + 50) {
                handleClick(hover);
            }
        }
    }
    drawStats(uictx);
}
var prevChatScrollTouchY=0;
function touchmoveEvent(e) {
    
    var cancel=true;

    var t;
    for (var i = 0; i < e.changedTouches.length; i++) {
        t = e.changedTouches[i];
        mx = t.pageX;
        my = t.pageY;
        var id = t.identifier;
        if (id === joyTouchId) {

            joystick.setKnobPos(mx, my);
            var dis = joystick.getKnobDistance();
            var ang = joystick.getKnobAngle();
            var per = Math.min(1, dis / 30);


            if (mouseInShop) {
                per = 0;
            }
            //console.log(per);
            socket.emit("dchange", [ang, per]);
        }

        if(t.target.id=="chat-messages" || t.target.className=="chat-message"){
            var delta=my-prevChatScrollTouchY;
            prevChatScrollTouchY=my;
            if(chatMessages.scrollTop==0 && delta>1){//at top, going higher
                //yes, cancel it
                //alert("sTop="+chatMessages.scrollTop+" delta="+delta);
            }else if (chatMessages.scrollTop==chatMessages.scrollHeight && delta<-1){//at bottom, going lower
                //yes, cancel it
                //alert("sTop="+chatMessages.scrollTop+" delta="+delta);

            }
            else{
                cancel=false;//no, let it scroll
            }
    
        }
    }

    if(cancel){
        e.preventDefault();
    }else{
        //alert("ggd");
    }
}
function touchendEvent(e) {

    e.preventDefault();
    var t;

    for (var i = 0; i < e.changedTouches.length; i++) {

        t = e.changedTouches[i];
        mx = t.pageX / screenxr;
        my = t.pageY / screenxr;

        var id = t.identifier;

        if (id === joyTouchId) {

            joyTouchId = false;
            joystick.setVisible(false);

        }
        else if (id === attackTouchId) {

            attackTouchId = false;
            socket.emit("aend", "");
        }
    }
}
function mousedownEvent(e) {
    if (e.button == 2) {
        boostStart();
        return false;
    }
    if(e.button==0){
        if(e.target.parentNode.id=="ability-box"){
            attemptUseAbility();
            return false;//if the click was for activating the ability, don't also trigger attack
        }
        if(e.target.id=="chat-title"){
            toggleChat();
            return false;//if the click was for chat toggle, don't attack
        }
        if(e.target.id=="chat-input"){
            return false;//if the click was for chat, don't attack
        }
    }
    mx = e.pageX;
    my = e.pageY;
    ang = getAngle([mx, my], [document.body.clientWidth / 2, document.body.clientHeight / 2]);
    var res = getItemUnderMouse(mx, my);
    var clicked = res[0];
    handleClick(clicked);
    drawStats(uictx);
    var but = res[1];
    if (!but) {
        socket.emit("astart", 'Started');
    }
}
function handleClick(clicked) {
    if (clicked == "none") {
        //pass
    }
    else if (typeof (clicked) !== "string") {//clicked item
        socket.emit("buyitem", clicked.name);
    }
    else {//lclicked on category
        if (clicked == "Shop") {
            if (inshop == "not") {
                inshop = "cat";
                but = true;
            } else {
                inshop = "not";
                but = true;
            }
        } else {
            var low;
            if (clicked == "Helmets") {
                low = "helmet";
            } else if (clicked == "Boots") {
                low = "boots";
            } else if (clicked == "Chestplates") {
                low = "chest";
            } else if (clicked == "Weapons") {
                low = "weapons";
            }
            if (inshop != low) {
                inshop = low;
            } else {
                inshop = "cat";
            }
        }
    }
}
function mouseupEvent(e) {
    if (e.button == 2) {
        boostEnd();
        return false;
    }
    socket.emit("aend", 'Ended');
}

function resizeEvent(e) {
    updateScreenSize();

}
function toggleChat(e){
    chatOpen=!chatOpen;
    if(chatOpen){
        chatBox.style.animation="main-hide-chat-backwards 1s ease-in-out both";
        chatTitle.style.animation="title-hide-chat-backwards 1s ease-in-out both";
    }else{
        chatBox.style.animation="main-hide-chat-forwards 1s ease-in-out both";
        chatTitle.style.animation="title-hide-chat-forwards 1s ease-in-out both";
    }
}
function sendChat(){
    
    var text=chatInput.value.trim();
    if(text.length>0){
        socket.emit("chat", text);
    }
    chatInput.value="";
    chatInput.blur();
}
function addThingInChat(text,color){

    var elem = document.createElement("p");
    elem.className="chat-message";
    elem.style.color=color;
    elem.appendChild(document.createTextNode(text));
    chatMessages.appendChild(elem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function addChatMessage(player,text){
    text=player.name+": "+text;
    if(player.chatColor===""){
        player.chatColor=generateChatColor(player);
    }
    var color=player.chatColor;
    addThingInChat(text,color);
}
function generateChatColor(player){
    var rand=Math.seededRandom(player.id);
    var h = Math.floor(rand()*360);
    var s = Math.floor(rand()*50)+50;
    var l = Math.floor(rand()*40)+60;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    
}
var debText = "";
var chatOpen=true;
window.addEventListener("resize", resizeEvent);
function drawDebug() {
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";

    ctx.fillText(debText, 0, 850);

}
const boostCanvas = document.getElementById("boost-canvas");
const boostCtx = document.getElementById("boost-canvas").getContext("2d");
boostCtx.fillStyle = "#00e1ff";
var lastDrawn = -1; //AKA nothing
var boostMaxWidth = 1000;
function drawBoost(boostAmount) {
    if (boostAmount == lastDrawn) { return; }
    lastDrawn = boostAmount;

    boostCtx.clearRect(0, 0, boostMaxWidth, 24);

    //boostStyle.width = (boostAmount / myPlayer.maxBoost) * 100 + "%";
    var width = (boostAmount / myPlayer.maxBoost) * boostMaxWidth;
    var x = (boostMaxWidth - width) / 2;
    var radius = 13;
    if (radius * 2 > width) {
        radius = width / 2;
    }
    roundRect(boostCtx, x, 0, width, 24, radius, true, false);
}

function drawShapes() {
    var vals = Object.values(obs);
    for (var shape of vals) {
        //if(shapeid=="remove"){continue}
        //if (!obs.hasOwnProperty(shapeid)) { continue }//dont try to show "remove"
        ctx.fillStyle = "#00ff00";
        //shape = obs[shapeid];
        var adjX = shape.pos[0] - campos[0];
        var adjY = shape.pos[1] - campos[1];
        if (adjX < -40 || adjY < -40 || adjX > 1540 || adjY > 960) {
            continue;
        }
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
function drawOtherObjects(){
    var vals = Object.values(otherObjects);
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
    pos = rotate_point(adjX - offx, (adjY - ((it.len / 2) + 40)) - offy, adjX, adjY, usa);
    drawRotatedImage(usim, pos.x, pos.y, usa);

}
function drawPlayers() {
    var vals = Object.values(players);
    for (var player of vals) {
        //if(pid=="remove"){continue}
        //if (!players.hasOwnProperty(pid)) { continue }
        //player = players[pid];
        var adjX = player.pos[0] - campos[0];
        var adjY = player.pos[1] - campos[1];
        ctx.fillStyle = "#00ff00";
        ctx.strokeStlye = "#000000";
        ctx.lineWidth = 2;
        var boostLinesY = -50;
        var boostLinesX = 80;
        if(player.spawnProtection && performance.now()%400<200){
            ctx.globalAlpha=0.5;
        }
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
            if (player.helmet) {
                it = helmetsD[player.helmet.withoutSpaces()];
                ctx.drawImage(it.ri, adjX - (it.pi.width / 2)+1, adjY - 40 - (it.pi.height * 2) + it.by);//+1 in X to make up for asymmetrical stickman image
            }
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
            if (player.helmet) {
                it = helmetsD[player.helmet.withoutSpaces()];
                ctx.drawImage(it.pi, adjX - (it.pi.width / 2), adjY - 40 - (it.pi.height * 2) + it.by);
            }
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

        }
        
        //health
        ctx.beginPath();
        ctx.fillRect(adjX - 36, adjY - 120, (player.chealth / player.mhealth) * 70, 10);
        //name
        
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(player.name, adjX, adjY - 125);

        if(player.spawnProtection){
            ctx.globalAlpha=1;
        }
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
function drawProjs() {
    var vals = Object.values(projs);
    for (var proj of vals) {//draw projectiles
        //if(pid=="remove"){continue}
        //if (!projs.hasOwnProperty(pid)) { continue }
        //proj = projs[pid];
        it = weaponsD[proj.type.withoutSpaces()];
        if (proj.displayDistance >= it.dispDist) {
            drawRotatedImage(it.ammo, (proj.pos[0] - campos[0]), (proj.pos[1] - campos[1]), proj.ang);
        }

    }
}
function drawCirclePoof(x, y, ang, amountOut, alpha){
    ctx.globalAlpha=alpha;
    ctx.beginPath();
    var xChange=Math.sin(TO_RADIANS*ang)*100*amountOut;
    var yChange=Math.cos(TO_RADIANS*ang)*100*amountOut;
    ctx.arc(x-campos[0]+xChange, y-campos[1]+yChange, 50, 0, 2 * Math.PI);
    ctx.fill();
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
            let mode=ef[2][4];//false is beginning, true is ending
            if(mode===true){
                for(let outward of [true, false]){
                    var percentDone=ef[1] / 100;//actually distance from being done
                    var amountOut=(outward ? (1-percentDone): percentDone);
                    var posIndexOffset=(outward ? 2: 0)
                    ctx.fillStyle="#234b68";
                    
                    for(let i=0;i<12;i++){
                        let ang=i*30-15;
                        drawCirclePoof(ef[2][posIndexOffset],ef[2][1+posIndexOffset], ang, amountOut, percentDone)
                    }
                }
            }else{
                var percentDone=Math.min(1, ef[1] / 500);//actually distance from being done
                var progress=1-percentDone;
                
                //ctx.fillStyle="#234b68";
                ctx.fillStyle="rgb(35, 75, "+(255-151*percentDone)+")";
                for(let i=0;i<12;i++){
                    let ang=-i*30-180;
                    let op=progress*13-i;
                    drawCirclePoof(ef[2][0],ef[2][1], ang, 1, Math.max(0,Math.min(op,1))*0.5)
                }
                let outOp=progress*((Math.sin(progress*Math.PI*2.5)/2)+0.5);
                drawCirclePoof(ef[2][2],ef[2][3], 0, 0, outOp);
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
function drawAbilCooldown(){
    if(myPlayer.hasHelmetAbil){
        var height=100-((myPlayer.abilTimer/helmetsD[myPlayer.trueHelmet.withoutSpaces()].abilRecharge)*100);
        if(height==0 && abilCooldownElem.style.height=="0%"){
            //don't re-assign if the cooldown is already gone
        }else{
            abilCooldownElem.style.height=height+"%";//100-val because we want a low amount of recharge to be a larger gray box

        }
    }
    
}
function drawViewport() {
    try {
        if (posRecieved) {
            ctx.clearRect(0, 0, canv.width, canv.height);//maybe remove, if so fix borders
            campos = [myPlayer.pos[0] - 750, myPlayer.pos[1] - 450];
            drawGrid(ctx);
            drawShapes();
            drawOtherObjects();
            drawBorders(ctx);
            drawProjs();
            drawPlayers();
            drawGEffects();
            drawMiniMap(ctx);
            drawBoost(myPlayer.availBoost);
            drawAbilCooldown();
            if (debText != "") {
                drawDebug();
            }
        }
    } finally{
        if (state == "game") {
            requestAnimationFrame(drawViewport);
        }
    }


}
function showReloadIcon() {
    readyAmmoElem.style.display = "none";
    reloadImage.style.display = "inline";
}
function hideReloadIcon() {
    readyAmmoElem.style.display = "inline";
    reloadImage.style.display = "none";
}
function showAmmo() {
    ammoBoxElem.style.display = "block";
}
function hideAmmo() {
    ammoBoxElem.style.display = "none";
}
hideReloadIcon();
hideAmmo();

function attemptUseAbility(){//attempt because the it might not have cooled down
    socket.emit("activatehelmetabil");

}


function updateHandler(info) {
    if(myPlayer===undefined){
        return; //don't do anything if we have not recieved the original initialization for player.
    }

    if(myPlayer.hasHelmetAbil && myPlayer.abilTimer < helmetsD[myPlayer.trueHelmet.withoutSpaces()].abilRecharge)
    myPlayer.abilTimer+=1*updateRatio;

    for (var newp of info[0]) {

        p = players['o' + newp[0]];
        if (p) {
            p.pos = newp[1];
            p.facing = newp[2];
            p.anim = newp[3];
            p.boosting = newp[4];
        }

    }
    var vals = Object.values(obs);
    var donef;
    for (var shape of vals) {
        //if(shapeid=="remove"){continue}
        //if (!obs.hasOwnProperty(shapeid)) { continue }//dont try to show "remove"
        //shape = obs[shapeid];
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
        p = projs['o' + newp[0]];
        if (p) {
            p.pos = newp[1];
            if(newp.length==3){
                p.ang=newp[2];
            }
        }

    }
    var vals = Object.values(players);
    for (var player of vals) {
        //if(pid=="remove"){continue}
        //if (!players.hasOwnProperty(pid)) { continue }
        //player = players[pid];
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
    var vals = Object.values(projs);
    for (var proj of vals) {
        //proj = projs[pid];
        proj.displayDistance += 5*updateRatio;
    }

    var vals=Object.values(otherObjects);
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
    drawStats(uictx);
}

function allHandler(info) {
    geffects=[];
    players = {};
    for (var nop of info[0]) {
        nop.dt = [];
        nop.chatColor="";
        players["o" + nop.id] = nop;
    }
    obs = {};

    for (var nob of info[1]) {
        nob.dt = [];
        obs["o" + nob.id] = nob;

    }
    projs = {};
    for (var nob of info[2]) {

        projs["o" + nob.id] = nob;
    }
    
    otherObjects = {};
    for (nob of info[6]) {
        if(nob.type==0){
            nob.health=Math.floor(nob.age / serverFrames);//because server uses real time
            nob.age=Math.floor((nob.age / serverFrames)*clientFrames);//convert to our time
        }

        otherObjects["o" + nob.id] = nob;
    }
    firstId=0;
    secondId=0;
    thirdId=0;
    myId = info[3];
    myPlace=-1;
    myPlayer = players["o" + myId];
    myPlayer.helmet = false;
    myPlayer.chest = false;
    myPlayer.weapon = false;
    myPlayer.boots = false;
    //myPlayer.spawnProtection;
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
    drawLeaderboard();
    drawStats(uictx);
    drawBoost(1000);
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
    killedby = msg[0];

    rejoinc = msg[1][0];
    startmoney = msg[1][1];
    deathElem.innerText = "You were killed by " + killedby + "!";
    startWithElem.innerText = "You'll start with " + startmoney + " gold";

    var deadName=myPlayer.name;
    var killerName=killedby;
    var text=killerName+" killed "+deadName+"!";
    hideAmmo();
    fadeGame(false);
    removeGameHandlers();

}

function shapechangeHandler(info) {

    obs['o' + info.shape].dt.push([obs['o' + info.shape].health - info.newp, 1]);
    obs['o' + info.shape].health = info.newp;

}

function healthchangeHandler(info) {
    p = players["o" + info[0]];
    var oldHeath = p.chealth;
    p.chealth = info[1];
    p.dt.push([info[1] - oldHeath, 1]);

}

function echangeHandler(info) {
    p = players["o" + info[0]];
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
            if (item.type == "Ranged") {
                ammoMaxElem.innerText = "/" + item.maxAmmo;
                ammoImgElem.src = item.ammoimg.src;
                showAmmo();
            } else {
                hideAmmo();
            }
        } else if (info[2] == "helmet"){
            var item = helmetsD[itemName];
            var abilDisplay="block";
            if(item.hasOwnProperty("abilRecharge")){

                abilBoxElem.replaceChild(item.abilImage,abilBoxElem.childNodes[1]);
                myPlayer.hasHelmetAbil=true;
                myPlayer.abilTimer=0;

            }else{
                abilDisplay="none";
                myPlayer.hasHelmetAbil=false;

            }
            abilBoxElem.style.display=abilDisplay;
        }
            drawStats(uictx);

    }

}

function effectHandler(info) {
    p = players["o" + info[0]];
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

    p = obs["o" + info[0]];
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

    if(info[0]==4){
        //Wizard stuff
        if(info[2][1]===true){//if this is the ending segment
            for(let e of geffects){
                if(e[0]==4 && e[2][5]==info[2][0]){//if is poof, and poof id match
                    e[2][4]=true; //set to exit mode, reset timer
                    e[1]=100;
                }
            }
        }else{
            geffects.push(info);
        }
    }else{
        geffects.push(info);
    }
}

function newshapeHandler(info) {
    obs["o" + info.news.id] = info.news;
    obs["o" + info.news.id].dt = [];
    delete obs['o' + info.rem];

}

function delplayerHandler(info) {
    
    
    delete players["o" + info];
    
}

function delprojHandler(info) {
    delete projs["o" + info];
}

function newplayerHandler(info) {
    if (!players["o" + info[0]]) {
        players["o" + info[0]] = {
            pos: info[1],
            id: info[0],
            effects: [],
            dt: [],
            facing: "right",
            name: info[2],
            boosting: false,
            spawnProtection:true,
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
    projs["o" + info.id] = info;
    projs["o" + info.id].displayDistance = 0;
}
function ammoAmountHandler(newAmmo) {
    ammoAmountElem.innerText = newAmmo;
    myPlayer.availAmmo = newAmmo;
}
function reloadHandler(info) {
    var player = players["o" + info[0]];
    player.reloading = true;
    player.reloadRemaining = info[1];
    if (info[0] == myId) {
        showReloadIcon();
    }
}
function abilusedHandler(info){
    myPlayer.abilTimer=0;
}
function newotherobjectHandler(info){
    if(info.type==0){
        info.age=0;
        info.health=0;
    }
    otherObjects["o" + info.id] = info;
}
function removeotherobjectHandler(info){
    delete otherObjects["o" + info];
}
function otherobjectchangeHandler(info){

}
function otherinfoHandler(info){
    var player = players["o" + info[0]];
    if(info[1]=="spawnprotection"){
        player.spawnProtection=info[2];
    }else{
        player.otherInfo[info[1]]=info[2];
    }
}
function chatHandler(info){
    if(info[2]=="chat"){
        var player=players["o" + info[0]];
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
