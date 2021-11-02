/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
/*jshint esversion: 6 */

var http = require("http");
var express = require("express");
var fs = require("fs");
var FilterClass = require("bad-words");
var keepAlive = require("./keepalive");
var placeHolderProfane = "#!$%";
var profanityFilter = new FilterClass({ emptyList: true });
var theBadWordsList = require("./myBadWords").badWords;
profanityFilter.addWords(...theBadWordsList);

function replaceWord(string) {
    return placeHolderProfane;

}
function clean(string) {
    return string.split(/\b/).map((word) => {
        return profanityFilter.isProfane(word) ? replaceWord(word) : word;
    }).join("");

}

var pp = [[27, -32], [27, -32], [28, -31], [28, -31], [29, -30], [30, -30], [30, -29], [31, -28], [31, -28], [32, -27], [32, -27], [32, -26], [33, -26], [33, -25], [34, -24], [34, -24], [35, -23], [35, -23], [35, -22], [36, -21], [36, -21], [37, -20], [37, -19], [37, -19], [38, -18], [38, -17], [38, -17], [39, -16], [39, -15], [39, -15], [39, -14], [40, -13], [40, -13], [40, -12], [40, -11], [40, -10], [41, -10], [41, -9], [41, -8], [41, -8], [41, -7], [41, -6], [42, -5], [42, -5], [42, -4], [42, -3], [42, -2], [42, -2], [42, -1], [42, 0], [42, 0], [42, 0], [42, 1], [42, 2], [42, 2], [42, 3], [42, 4], [42, 5], [42, 5], [41, 6], [41, 7], [41, 8], [41, 8], [41, 9], [41, 10], [40, 10], [40, 11], [40, 12], [40, 13], [40, 13], [39, 14], [39, 15], [39, 15], [39, 16], [38, 17], [38, 17], [38, 18], [37, 19], [37, 19], [37, 20], [36, 21], [36, 21], [35, 22], [35, 23], [35, 23], [34, 24], [34, 24], [33, 25], [33, 26], [32, 26], [32, 27], [32, 27], [31, 28], [31, 28], [30, 29], [30, 30], [29, 30], [28, 31], [28, 31], [27, 32], [27, 32], [26, -32]];
var server = http.createServer(function (req, res) {
    res.writeHead(400);
    res.end();
});
Array.prototype.remove = function (element) {
    var index = this.indexOf(element);
    if (!~index) {
        console.trace("Element not in array!");
        throw "Element not in array!";
    }
    this.splice(index, 1);
};
Array.prototype.countNumber = function (element) {
    let c = 0;
    for (let e of this) {
        if (e == element) {
            ++c;
        }
    }
    return c;
};
function randomChoice(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}
var present = require("present");
var fps = 200;//200
var interval = 1000 / fps;
var pVal = Math.min(10 / fps, 1);
var adjInterval = interval + 0;
var badFrames = 0;
var goodFrames = 0;
var wasSlow = false;
var lastTime = 0;
function redirectToUpdate() {// redirectToUpdate starts at end of file


    var thisTime = present();

    var diff = thisTime - lastTime;
    lastTime = thisTime;
    update();

    var wentOver = interval - diff;

    //console.log("Took:"+diff);
    //console.log("Error:"+wentOver);
    var idealInterval = adjInterval + (wentOver * pVal);
    adjInterval = Math.max(0, idealInterval);
    if (idealInterval >= 0) {

        if (wasSlow) {
            goodFrames += 1;
            if (goodFrames > 200 * 20) {//must be 20 seconds of no slow
                wasSlow = false;
                badFrames = 0;
                console.log("Server no longer slowed. There are " + players.length + " players. It took " + diff + " to update. It should take " + interval + ".");
            }

        }
    } else {
        badFrames += 1;
        goodFrames = 0;
        if (badFrames >= 50 && !wasSlow && players.length >= 2) {

            wasSlow = true;
            console.log("Server Slowdown! There are " + players.length + " players. It took " + diff + " to update. It should take " + interval + ".");
        }
    }

    setTimeout(redirectToUpdate, adjInterval);
}


function regenPlayer(player, amnt) {
    if (player.chealth < player.mhealth) {
        player.chealth += amnt;
        if (player.chealth > player.mhealth) {
            player.chealth = player.mhealth + 0;
        }
        socketServer.emit("healthchange", [player.id, player.chealth]);
    }
}
function endSpawnProtection(player){
    player.spawnProtectionTime=0;
    socketServer.emit("otherinfo", [player.id, "spawnprotection", false]);
    
}
function startSpawnProtection(player){
    player.spawnProtectionTime=spawnSafetyTime;
    socketServer.emit("otherinfo", [player.id, "spawnprotection", true]);
}
function randomChance(chance) {
    return Math.random() < chance;
}
function intersectRect(r1, r2) {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}
function int(n) {
    return Math.floor(n);
}
function intersectPoint(p, r) {
    return ((p[0] < r.right) && (p[0] > r.left) && (p[1] < r.bottom) && (p[1] > r.top));
}
function getAngle(p1, p2) {
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI + 90;
}
function normalizeAngle(angle) {
    // reduce the angle  
    angle = angle % 360;

    // force it to be the positive remainder, so that 0 <= angle < 360  
    angle = (angle + 360) % 360;

    // force into the minimum absolute value residue class, so that -180 < angle <= 180  
    if (angle > 180) {
        angle -= 360;
    }
    return angle;
}

function angleDiff(ang1, ang2) {
    ang1 = normalizeAngle(ang1);
    ang2 = normalizeAngle(ang2);
    //console.log("new:",ang1,Math.floor(ang2));

    var r = ang2 - ang1;
    r += (r > 180) ? -360 : (r < -180) ? 360 : 0;
    //console.log("res:",r);

    return r;
}
function debug(info) {
    addEffect("map", "debug", 5, 1, info);
}

function isOutOfBounds(x, y) {
    return x > maplimitx || y > maplimity || x < 0 || y < 0;
}
function isSwordSwinging(player) {
    return (!(!player.attacking && player.attackdel == 0));
}
var transmitTicker = 0;
var clientFrames = 60;
var serverFrames = 200;
function update() {
    //Uber lag 
    //for (player of players) {for (player of players) {for (player of players) {process.stdout.write("");}}}
    updateObs();
    updateOtherObjects();
    var pi = updateProjs();
    var spi = updatePlayers();


    transmitTicker += 1;
    if (transmitTicker == 2) {//fancy fractions make the update transmit exactly 60 times in 200 ticks=1 second
        transmitTicker -= 2;
        socketServer.emit("update", [spi, pi]);
    }



}
function updateObs() {
    for (var ob of obs) {
        var donef = [];
        for (var f of ob.effects) {
            if (f[0] == 1) {
                if (f[3][0] >= f[3][1]) {

                    damageShape(ob, f[3][3], f[3][2], false, false);
                    f[3][0] = 0;

                } else {
                    f[3][0] += 1;
                }
            }
            f[1] -= 1;
            if (f[1] < 1) {
                donef.push(f);
            }
        }
        for (f of donef) {
            ob.effects.remove(f);
        }

    }
}
function updateOtherObjects() {
    for (var object of otherObjects) {
        if (object.type == 0) {//farmer wheat
            if (object.age < 1000) {
                object.age += 1;
                if (object.age == 1000) {

                    object.rect = makeRect(object.pos, 51, 150);
                }
            }

        }

    }
}
function updateProjs() {
    var pi = [];
    var rem = [];
    projLoop:
    for (var proj of projs) {
        if (proj.type == "Rocket Launcher") {
            if (!proj.targetPlayer) {
                var possiblePlayer = false;
                var closestDist = 700;
                for (var tarPlayer of players) {
                    if (tarPlayer.id != proj.shotby.id) {
                        var distance = Math.dist(proj.pos, tarPlayer.pos);
                        if (distance < closestDist) {
                            var angleTo = angleDiff(proj.ang, getAngle(proj.pos, tarPlayer.pos));
                            if (Math.abs(angleTo) < 90) {
                                possiblePlayer = tarPlayer;
                                closestDist = distance;
                            }

                        }
                    }
                }
                if (possiblePlayer) {
                    proj.targetPlayer = possiblePlayer;
                    //proj.range=1000;
                }

            } else {
                var currAng = normalizeAngle(proj.ang);
                var targetAng = normalizeAngle(getAngle(proj.pos, proj.targetPlayer.pos));
                var diff = angleDiff(currAng, targetAng);
                if (diff > 0) {
                    proj.ang += 0.125;
                } else {
                    proj.ang -= 0.125;
                }
            }
            var vel = [proj.speed * Math.sin(proj.ang * Math.PI / 180), -proj.speed * Math.cos(proj.ang * Math.PI / 180)];
            var hitoff = [proj.len * Math.sin(proj.ang * Math.PI / 180), -proj.len * Math.cos(proj.ang * Math.PI / 180)];
            proj.pos[0] += vel[0];
            proj.pos[1] += vel[1];
            proj.hitpos = [[proj.pos[0] + hitoff[0], proj.pos[1] + hitoff[1]]];
            proj.hitpos.push([proj.pos[0] + hitoff[0] * 0.5, proj.pos[1] + hitoff[1] * 0.5]);


        } else {
            proj.pos[0] += proj.vel[0];
            proj.pos[1] += proj.vel[1];
            proj.hitpos = [[proj.pos[0] + proj.hitoff[0], proj.pos[1] + proj.hitoff[1]]];
        }

        proj.traveled += proj.speed;
        var projInfo = [proj.id, proj.pos];
        if (proj.type == "Rocket Launcher") {
            projInfo.push(proj.ang);
        }
        pi.push(projInfo);
        var player = proj.shotby;
        if (isOutOfBounds(proj.hitpos[0][0], proj.hitpos[0][1])) {
            rem.push(proj);
            continue projLoop;
        }
        if (proj.traveled > proj.range) {
            rem.push(proj);
            continue projLoop;
        }

        for (var i = proj.hitpos.length - 1; i >= 0; i--) {
            var hitpos = proj.hitpos[i];
            var inter;
            for (var ob of obs) {
                inter = intersectPoint(hitpos, ob.rect);
                if (inter) {
                    damageShape(ob, player, proj.damage, true, true);
                    rem.push(proj);
                    continue projLoop;

                }
            }
            for (var op of players) {
                inter = intersectPoint(hitpos, op.rect);
                if (inter) {
                    doDamage(player, op, true, proj.damage, true);
                    rem.push(proj);
                    continue projLoop;
                }
            }
            for (var object of otherObjects) {
                switch (object.type) {
                case 0://add other type cases below this case, it will cascade into the block below
                {
                    inter = intersectPoint(hitpos, object.rect);
                    if (inter) {
                        rem.push(proj);
                        otherObjectHit[object.type](proj.shotby, object, true);
                        continue projLoop;
                    }
                }
                }
            }
        }


    }
    for (var r of rem) {
        remProj(r);
    }
    return pi;
}
function updatePlayers() {
    var spi = [];
    var deadPlayers = [];
    let aangle;
    for (var player of players) {
        if (player.helmet && player.helmet.hasOwnProperty("abilRecharge")) {
            if (player.abilTimer < player.helmet.abilRecharge) {
                player.abilTimer += 1;
            }
        }
        if (player.spawnProtectionTime > 0) {
            player.spawnProtectionTime -= 1;
            if(player.spawnProtectionTime==0){
                endSpawnProtection(player);
            }
        }

        if (player.atype == "Melee") {
            player.anim = Math.round(player.attackdel / 10);
        } else if (player.atype == "Ranged") {

            if (player.direction > -90) {

                aangle = 50 - Math.abs(int(player.direction));
                aangle = Math.min(Math.max(aangle, 0), 100);
            } else if (player.direction < -270) {

                aangle = 51 - (Math.abs((int(player.direction))) - 360);
                aangle = Math.min(Math.max(aangle, 0), 100);
            } else { // if (player.direction<-131 && player.direction>-232)

                aangle = (Math.abs((int(player.direction))) - 108) - 24;
                aangle = Math.min(Math.max(aangle, 0), 100);
            }
            player.anim = aangle;
            aangle = aangle + 42;
            if (player.facing == "left") {
                aangle = 360 - aangle;
            }

        }
        var speedMod;
        if (isSwordSwinging(player)) {
            speedMod = 0.5;
        } else {
            speedMod = 1;
        }

        var boostMod = 1;
        if (player.boosting) {
            if (player.availBoost > 0) {
                boostMod += (getStat(player, "boostSpeed") / 10);
                player.availBoost -= 2;
                if (player.availBoost < 0) {
                    player.availBoost = 0;
                }
                player.emit("boostchange", player.availBoost);
            }
        }
        else {
            if (player.availBoost < player.maxBoost) {
                player.availBoost += 0.00025 * player.maxBoost;
                if (player.availBoost > player.maxBoost) {
                    player.availBoost = player.maxBoost;
                }
                player.emit("boostchange", player.availBoost);
            }
        }
        var reloadMod = 1;
        if (player.reloading) {
            player.reloadDelay += 1;
            if (player.reloadDelay >= player.reloadTime) {
                player.reloading = false;
                player.availAmmo = player.maxAmmo;
            }
            reloadMod = 0.1;
        }
        var playerSpeed = getStat(player, "speed");
        var xm = (playerSpeed / 10) * player.actspeed * Math.cos(player.direction * Math.PI / 180) * speedMod * boostMod * reloadMod;
        var ym = (playerSpeed / 10) * player.actspeed * Math.sin(player.direction * Math.PI / 180) * speedMod * boostMod * reloadMod;
        var donef = [];
        var stunned = false;
        for (let f of player.effects) {
            if (f[0] == 0) {
                player.attackdel = 0;
                xm = 0;
                stunned = true;
                ym = 0;
            }
            if (f[0] == 1) {
                if (f[3][0] >= f[3][1]) {

                    f[3][0] = 0;

                    dirDamage(player, f[3][2], f[3][3]);
                } else {
                    f[3][0] += 1;
                }

            }
            if (f[0] == 3) {
                if (f[1] % 200 == 0) {
                    let ob = {
                        id: Math.random(),
                        pos: [player.pos[0], player.pos[1]],
                        rect: makeRect(player.pos, 30, 75),
                        age: 0,
                        type: 0
                    };
                    addNewOtherObject(ob, {
                        id: ob.id,
                        pos: ob.pos,
                        type: ob.type
                    });

                }

            }
            if (f[0] == 4) {//wizard
                player.attackdel = 0;
                xm = 0;
                stunned = true;
                ym = 0;
                if(f[1]==1){
                    player.pos = [f[3][0], f[3][1]];
                    //x,y,poofID,anim type()
                    setTimeout(function(){//really want to make sure player cam has moved before doing effect
                        addEffect("map", 4, 100, true, [f[3][2], true], true); //poof resolves.
                    }, 5);
                    
                }
            }
            f[1] -= 1;
            if (f[1] < 1) {
                donef.push(f);
            }
        }
        for (let f of donef) {
            player.effects.remove(f);
        }
        updatePlayerBonus(player);
        updateOtherAbilInfo(player);
        if (player.atype == "Melee") {
            if (isSwordSwinging(player)) {
                player.attackdel += getStat(player, "attackspeed");
                var collisionPoints = [];
                var hh = pp[player.anim];
                if (player.facing == "right") {
                    collisionPoints.push([hh[0] + player.pos[0], hh[1] + player.pos[1]]);
                } else {
                    collisionPoints.push([player.pos[0] - hh[0], hh[1] + player.pos[1]]);
                }
                var useAngle = player.anim + 40;

                if (player.weapon) {
                    var position = [player.pos[0], -40 + player.pos[1] - player.weapon.len, player.pos[0], player.pos[1]];
                    if (player.facing == "right") {
                        collisionPoints.push(rotate_point(position[0], position[1], position[2], position[3], useAngle));
                    } else {
                        collisionPoints.push(rotate_point(position[0], position[1], position[2], position[3], -useAngle));
                    }
                    if (player.weapon.len >= 80) {
                        position = [player.pos[0], -40 + player.pos[1] - (player.weapon.len / 2), player.pos[0], player.pos[1],];
                        if (player.facing == "right") {
                            collisionPoints.push(rotate_point(position[0], position[1], position[2], position[3], useAngle));
                        } else {
                            collisionPoints.push(rotate_point(position[0], position[1], position[2], position[3], -useAngle));
                        }
                    }

                }

                for (let op of players) {
                    if ((op != player) && !player.hasHit.includes(op)) {
                        let intersects = false;

                        for (let point of collisionPoints) {
                            intersects = intersectPoint(point, op.rect);
                            if (intersects === true) {
                                break;
                            }
                        }

                        if (intersects) {
                            doDamage(player, op, true, getStat(player, "damage"), false);
                        }
                    }
                }

                for (let ob of obs) {

                    if (!player.hasHit.includes(ob)) {
                        let intersects = false;
                        for (let point of collisionPoints) {
                            intersects = intersectPoint(point, ob.rect);
                            if (intersects === true) {
                                break;
                            }
                        }
                        if (intersects) {
                            player.hasHit.push(ob);
                            damageShape(ob, player, getStat(player, "damage"), true, false);
                        }
                    }
                }
                for (let object of otherObjects) {
                    if (!player.hasHit.includes(object)) {
                        var intersects = false;
                        for (let point of collisionPoints) {
                            intersects = intersectPoint(point, object.rect);
                            if (intersects === true) {
                                break;
                            }
                        }
                        if (intersects) {
                            player.hasHit.push(object);
                            otherObjectHit[object.type](player, object, false);
                        }
                    }
                }

                if (player.attackdel >= 1000) {
                    player.attackdel = 0;
                    player.hasHit = [];
                }
            }
        } else if (player.atype == "Ranged") {

            if (player.attacking && !player.reloading) {
                if (player.attackdel == 0 && !stunned) {
                    let pos = rotate_point(player.pos[0], -40 + player.pos[1], player.pos[0], player.pos[1], aangle);
                    addProj(player.weapon, pos, aangle, player);
                }
            }
            if (!(!player.attacking && player.attackdel == 0)) {
                player.attackdel += getStat(player, "attackspeed");
                if (player.attackdel >= 1000) {
                    player.attackdel = 0;
                }
            }

        }


        player.pos[0] += xm;

        updateXCollisions(player, players, ppminx, ppminy, ppminxCompare, ppminyCompare, true);
        updateXCollisions(player, obs, pominx, pominy, pominxCompare, pominyCompare);

        player.pos[1] += ym;

        updateYCollisions(player, players, ppminx, ppminy, ppminxCompare, ppminyCompare, true);
        updateYCollisions(player, obs, pominx, pominy, pominxCompare, pominyCompare);





        player.rect = {
            top: player.pos[1] - 96,
            bottom: player.pos[1] + 96,
            left: player.pos[0] - 40,
            right: player.pos[0] + 40,
        };
        spi.push([player.id, [Math.round(player.pos[0]), Math.round(player.pos[1])], player.facing, player.anim, boostMod > 1]);

        if (player.chealth <= 0) {
            kill(player);

            deadPlayers.push(player);
        }
        if (player.pos[0] > maplimitx - 40) {
            player.pos[0] = maplimitx - 40;
        }
        if (player.pos[1] > maplimity - 96) {
            player.pos[1] = maplimity - 96;
        }
        if (player.pos[0] < 40) {
            player.pos[0] = 40;
        }
        if (player.pos[1] < 96) {
            player.pos[1] = 96;
        }
        if (player.rt <= 0) {
            if (player.rdelay >= 1000) {
                player.rdelay = 0;
                if (player.chealth < player.mhealth) {
                    player.chealth += 1;
                    socketServer.emit("healthchange", [player.id, player.chealth]);
                }
            }
            player.rdelay += getStat(player, "regen");
        } else {
            player.rt -= 1;
        }
        if (player.chealth > player.mhealth) {
            player.chealth = player.mhealth;
        }
    }
    let anyDied = false;
    for (let dead of deadPlayers) {
        anyDied = true;
        players.remove(dead);
        if (currentUserIDs.includes(dead.userID)) {
            currentUserIDs.remove(dead.userID);
        }
    }
    if (anyDied) {
        calcLeaderboard();
    }

    return spi;
}
function updateXCollisions(player, colliders, minX, minY, minXCompare, minYCompare, checkIfSelf = false) {

    for (let ob of colliders) {
        if (checkIfSelf && ob.id === player.id) { continue; }
        var dx = player.pos[0] - ob.pos[0]; // 7.37
        var dy = player.pos[1] - ob.pos[1]; //149.86

        if (Math.abs(dx) < minXCompare && Math.abs(dy) < minYCompare) {

            if (dx < 0) {
                player.pos[0] = ob.pos[0] - minX;
            } else {
                player.pos[0] = ob.pos[0] + minX;
            }

        }
    }
}

function updateYCollisions(player, colliders, minX, minY, minXCompare, minYCompare, checkIfSelf = false) {
    for (let ob of colliders) {
        if (checkIfSelf && ob.id === player.id) { continue; }
        var dx = player.pos[0] - ob.pos[0];
        var dy = player.pos[1] - ob.pos[1];

        if (Math.abs(dx) < minXCompare && Math.abs(dy) < minYCompare) {

            if (dy < 0) {
                player.pos[1] = ob.pos[1] - minY;
            } else {
                player.pos[1] = ob.pos[1] + minY;
            }
        }
    }
}
/**
 * Check for expired bonuses of the player, removing any that have expired
 * @param {Player} player 
 */
function updatePlayerBonus(player) {
    let doneBonus = [];
    for (let bonus of player.allBonus) {

        bonus[4] -= 1;
        if (bonus[4] < 1) {
            doneBonus.push(bonus);
        }
    }
    for (let dB of doneBonus) {
        player.allBonus.remove(dB);
    }
}
function updateOtherAbilInfo(player) {
    if (player.otherAbilInfo == undefined) { return; }
    if (typeof player.otherAbilInfo.PhantomBlade == "number") {

        player.otherAbilInfo.PhantomBlade -= 1;
        if (player.otherAbilInfo.PhantomBlade <= 0) {
            player.otherAbilInfo.PhantomBlade = false;
            addOtherInfo(player, "PhantomScare", false);
        }

    }
}
function addOtherInfo(player, key, value) {
    socketServer.emit("otherinfo", [player.id, key, value]);
}
function rotate_point(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return [
        Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
        Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
    ];
}
function makeRect(pos, width, height) {
    return {
        top: pos[1] - height / 2,
        bottom: pos[1] + height / 2,
        left: pos[0] - width / 2,
        right: pos[0] + width / 2
    };
}
function removeSpaces(string) {
    return string.replace(/\s+/g, "");
}
function roundList(list) {
    for (var i = 0; i < list.length; i++) {
        list[i] = Math.round(list[i]);
    }
}
function forceReload(player) {
    player.reloading = true;
    player.reloadDelay = 0;
    socketServer.emit("reload", [player.id, player.reloadTime]);
}
function changeAmmo(player, changeBy) {
    player.availAmmo += changeBy;
    player.emit("ammoAmount", player.availAmmo);
    if (player.availAmmo <= 0) {
        forceReload(player);

    }
}
/**
 * 
 * @param {Item} weapon 
 * @param {Number[]} pos of length 2
 * @param {Number} ang 
 * @param {Player} shotby 
 */
function addProj(weapon, pos, ang, shotby) {
    let n = {
        id: Math.random(),
        type: weapon.name,
        pos: pos,
        ang: ang
    };

    changeAmmo(shotby, -1);
    socketServer.emit("newproj", n);
    n.shotby = shotby;
    n.vel = [weapon.projSpeed * Math.sin(ang * Math.PI / 180), -weapon.projSpeed * Math.cos(ang * Math.PI / 180)];
    let len = weapon.ammolen / 2;
    n.range = weapon.range;
    n.hitoff = [len * Math.sin(ang * Math.PI / 180), -len * Math.cos(ang * Math.PI / 180)];
    n.damage = getStat(shotby, "damage");
    n.traveled = 0;
    n.speed = weapon.projSpeed;
    n.len = len;
    if (weapon.name == "Rocket Launcher") {
        n.targetPlayer = false;
    }
    projs.push(n);
}
function remProj(proj) {
    projs.remove(proj);

    socketServer.emit("delproj", proj.id);
}

function doDamage(player, victim, abil, damage, fromProjectile) {
    player.hasHit.push(victim);
    victim.ld = player.id;
    if(victim.spawnProtectionTime>0){// safe because i-frames
        return;
    }
    var origD = damage;
    for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
        if (mine) {
            let un = removeSpaces(mine.name);
            if (damageModify.hasOwnProperty(un)) {
                damage += damageModify[un](player, victim, origD, fromProjectile);
            }
        }
    }

    damage = Math.max(damage - (Math.max(getStat(victim, "armor") - getStat(player, "armorp"), 0)), 0);
    damage = getPhantomEffect(player, damage);
    for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
        if (mine) {
            let un = removeSpaces(mine.name);
            if (onHit.hasOwnProperty(un)) {

                onHit[un](player, victim);
            }
        }
    }

    for (let mine of [victim.helmet, victim.chest, victim.boots, victim.weapon]) {
        if (mine) {
            let un = removeSpaces(mine.name);
            if (onAttacked.hasOwnProperty(un)) {
                damage = onAttacked[un](player, victim, damage, fromProjectile);
            }
        }

    }

    victim.chealth -= damage;
    victim.rt = 2000;
    socketServer.emit("healthchange", [victim.id, victim.chealth]);
    checkForSpy(victim);
}
function dirDamage(player, da, id) {
    if(player.spawnProtectionTime>0){// safe because i-frames
        return;
    }
    player.chealth -= da;
    player.rt = 2000;
    player.ld = id;
    socketServer.emit("healthchange", [player.id, player.chealth]);
    checkForSpy(player);
}
function getPhantomEffect(player, damage) {
    if (player.otherAbilInfo != undefined) {
        if (player.otherAbilInfo.PhantomBlade) {
            damage = Math.floor(damage / 2);
            if (player.otherAbilInfo.PhantomBlade > 200) {
                player.otherAbilInfo.PhantomBlade = 200;
            }
        }
    }
    return damage;
}
function checkForSpy(player) {
    if (player.otherAbilInfo == undefined) {
        console.log("OtherAbil error");
        dumpPlayer(player);
        return;
    }
    if (player.otherAbilInfo.SpyHat) {
        player.otherAbilInfo.SpyHat = false;
        broadcastTrueEquipment(player);
    }
}
function removeRejoinCode(rid) {
    if (rid) {
        for (let r of rjoin) {
            if (r[0] == rid) {
                rjoin.remove(r);

                break;
            }
        }
    }
}
/**
 * Broadcasts that a player has changed items, but don't actually change them. Used for Spy Cloak. This broadcasts a special message to the sneaky player, to tell them it is not real.
 * @param {Player} player 
 * @param {Item} item 
 * @param {String} itemCategory
 */
function fakeItemChange(player, item, itemCategory) {
    if (item === false) {
        item = { name: false };
    }
    var curDamage = player.mhealth - player.chealth;
    player.broadcast.emit("echange", [player.id, item.name, itemCategory, player.mhealth, curDamage]);
    player.emit("echange", [player.id, item.name, itemCategory, player.mhealth, curDamage, true]);

}
/**
 * Tell clients the real equipment of a player. Used to reset the spy hat ability.
 * @param {Player} player 
 */
function broadcastTrueEquipment(player) {
    fakeItemChange(player, player.weapon, "weapon");
    fakeItemChange(player, player.boots, "boots");
    fakeItemChange(player, player.chest, "chest");
    fakeItemChange(player, player.helmet, "helmet");
}
/**
 * 
 * @param {Shape} shape 
 * @param {Player} player 
 * @param {Number} da amount of damage
 * @param {Boolean} abil if abilities should trigger
 */
function damageShape(shape, player, da, abil, fromProjectile) {
    var origD = da;

    if (abil) {
        for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
            if (mine) {
                let un = removeSpaces(mine.name);
                if (onShapeHit.hasOwnProperty(un)) {

                    onShapeHit[un](player, shape);
                }
            }
        }
        for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
            if (mine) {
                let un = removeSpaces(mine.name);
                if (damageModify.hasOwnProperty(un)) {

                    da += damageModify[un](player, shape, origD, fromProjectile);
                }
            }
        }
    }
    da = getPhantomEffect(player, da);
    shape.health -= da;
    if (shape.health <= 0) {

        killShape(shape, player);

    } else {
        socketServer.emit("shapechange", {
            shape: shape.id,
            newp: shape.health
        });
    }
}
/**
 * Gives money from shape and also spawns new one of same type
 * @param {*} old 
 * @param {*} player 
 */
function killShape(old, player) {
    if (!(obs.includes(old))) {
        return;
    }
    let oldt = old.type;
    if (typeof player.money !== "number") {//if it is from fire, just the player ID gets passed in
        for (let p of players) {
            if (p.id == player) {
                player = p;
            }
        }

    }
    if (typeof player.money === "number") {//check if the player quit, and their shape burnt. AKA if it is STILL an number after above
        changeMoney(player, old.money);
    }

    obs.remove(old);
    let nob = spawnShape(oldt);
    socketServer.emit("newshape", {
        news: nob,
        rem: old.id
    });

}
/**
 * Spawn a shape of the specified type
 * @param {*} shapeType 
 * 
 */
function spawnShape(shapeType) {

    let nx = Math.floor((Math.random() * maplimitx));
    let ny = Math.floor((Math.random() * maplimity));
    let nob = {
        pos: [nx, ny]
    };
    nob.effects = [];
    nob.type = shapeType;
    nob.rect = {
        top: nob.pos[1] - 33,
        bottom: nob.pos[1] + 33,
        left: nob.pos[0] - 33,
        right: nob.pos[0] + 33,
    };
    nob.id = Math.random();
    if (shapeType == 1) {
        nob.money = 1;
        nob.health = 50;
    } else if (shapeType == 2) {
        nob.money = 3;
        nob.health = 150;

    } else if (shapeType == 3) {
        nob.money = 9;
        nob.health = 450;

    } else if (shapeType == 4) {
        nob.money = 27;
        nob.health = 1350;
    }

    obs.push(nob);
    return nob;

}
function addNewOtherObject(object, clientObject) {
    otherObjects.push(object);
    socketServer.emit("newotherobject", clientObject);
}
function removeOtherObject(object) {
    otherObjects.remove(object);
    socketServer.emit("removeotherobject", object.id);

}
function kill(dead) {
    calcStats(dead);
    var killer = false;
    for (let player of players) {
        if (player.id == dead.ld) {
            killer = player;
        }
    }

    if (killer) {
        changeMoney(killer, int(dead.value / 2));
    }
    if (!killer) {
        killer = { name: "Player" };
    }

    let rdid = Math.random();
    let r = [rdid, int(dead.value / 2), 0];
    rjoin.push(r);
    console.log(dead.name + " has been killed by " + killer.name + ". They had " + dead.value + " value, so they will start with " + r[1] + " money.");
    dead.emit("dead", [killer.name, [r[0], r[1]]]);
    socketServer.emit("delplayer", [dead.id]);
    socketServer.emit("chat", ["",killer.name+" killed "+dead.name+"!","info"]);
}
function calcLeaderboard() {
    var topNum = 3;
    let leaders = players.slice();
    leaders.sort(function (a, b) {
        return a.value - b.value;
    });
    leaders = leaders.slice(Math.max(leaders.length - topNum, 0));
    leaders.reverse();
    let leadd = [];
    for (let l of leaders) {
        leadd.push([l.name, l.value, l.id]);
    }
    socketServer.emit("leaderboard", leadd);
}
Math.dist = function (pos1, pos2) {
    let x1 = pos1[0];
    let x2 = pos2[0];
    let y1 = pos1[1];
    let y2 = pos2[1];

    var xs = x2 - x1,
        ys = y2 - y1;

    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
};
function changeMoney(player, changeBy) {
    player.money += changeBy;
    player.emit("moneyChange", player.money);
    calcStats(player);
}
function calcStats(player) {
    let oldv = int(player.value);
    let oldMon = int(player.money);
    player.speed = 10;
    player.mhealth = 100;
    player.attackspeed = 10;
    player.boostSpeed = 5;
    player.damage = 10;
    player.armorp = 0;
    player.armor = 0;
    player.regen = 10;
    player.maxAmmo = 0;
    player.maxBoost = calcBoost(player);
    player.value = 0;
    player.atype = "Melee";
    for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
        if (mine) {
            player.speed += (mine.speed != undefined ? mine.speed : 0);
            player.maxAmmo += (mine.maxAmmo != undefined ? mine.maxAmmo : 0);
            player.damage += (mine.damage != undefined ? mine.damage : 0);
            player.attackspeed += (mine.aspeed != undefined ? mine.aspeed : 0);
            player.armorp += (mine.armorp != undefined ? mine.armorp : 0);
            player.armor += (mine.armor != undefined ? mine.armor : 0);
            player.mhealth += (mine.health != undefined ? mine.health : 0);
            player.regen += (mine.regen != undefined ? mine.regen : 0);
            player.boostSpeed += (mine.boostSpeed != undefined ? mine.boostSpeed : 0);
            player.maxBoost += (mine.boosttime != undefined ? mine.boosttime * 10 : 0);
            player.atype = (mine.type != undefined ? mine.type : "Melee");
        }
    }
    player.value += player.totalItemCosts;


    player.value += player.money;
    if (player.value != oldv) {
        calcLeaderboard();
    }

    if (player.availBoost > player.maxBoost) {
        player.availBoost = player.maxBoost;
    }


}
function calcBoost(player) {
    var b = 1000;//1000
    b -= player.maxCost["chest"];
    b -= player.maxCost["helmet"];
    b -= player.maxCost["boots"];
    b -= player.maxCost["weapon"];
    if (b < 1) {
        b = 1;
    }
    return b;
}
/**
 * Returns the stat and bonus added together of this player's statName
 * @param {Player} player 
 * @param {String} statName
 * @returns {Number} the stat with bonus
 */
function getStat(player, statName) {
    return player[statName] + getBonus(player, statName);
}
function getBonus(player, statName) {
    var totalBonus = 0;
    for (let bonus of player.allBonus) {
        if (bonus[0] == statName) {
            if(bonus[5](player)){
                if (bonus[2] === true) {//if it is a percent increase
                    totalBonus += player[statName] * bonus[1];
                } else {
                    totalBonus += bonus[1];//it is an absolute increase
                }
            }
            
        }

    }
    return Math.round(totalBonus);//no decimals allowed!


}
let serverVersion=1;
var maplimitx = 7500;
var maplimity = 4500;
var socketModule = require("socket.io");
var socketServer = socketModule(server, {
    cors:{
        origin:"*"
    }
});
var players = [];
var currentUserIDs = [];
var obs = [];
var otherObjects = [];
var projs = [];
var numobs = 100;
spawnStartingShapes();
let spawnSafetyTime=2000; //2000 ms
var ppminx = 50;
var ppminy = 150;
var pominx = 58;
var pominy = 129;
var tolerance = 0.000001;
var ppminxCompare = ppminx - tolerance;
var ppminyCompare = ppminy - tolerance;
var pominxCompare = pominx - tolerance;
var pominyCompare = pominy - tolerance;

var rjoin = [];
//START CALC COPY
var helmets = {


    MossHat: {
        name: "Moss Hat",
        health: 10,
        cost: 10,
        regen: 2,
        wid: 70,
        by: 25,
        abilRecharge: 4000,//200=1 sec
        image: "mosshat",
        st: "Healing Aura: Activate to heal 25 health and start regen"

    },
    StrawHat: {
        name: "Straw Hat",
        health: 8,
        armor: 1,
        cost: 30,
        wid: 100,
        by: 30,
        abilRecharge: 6000,
        image: "strawhat",
        st: "Farming: Plants 5 wheat that grow up. When grown, break to heal or get money"

    },
    VikingHelmet: {
        name: "Viking Helmet",
        armor: 3,
        cost: 50,
        wid: 80,
        by: 75,
        abilRecharge: 6000,
        image: "vikinghelmet",
        st: "Battle Rage: Activate to increase your damage and attack speed for 10 seconds"

    }, WizardHat: {
        name: "Wizard Hat",
        health: 32,
        armor: 1,
        cost: 100,
        wid: 80,
        by: 35,
        abilRecharge: 6000,
        image: "wizardhat",
        st: "Teleport: Activate to teleport to a random location"

    }, SpyHat: {
        name: "Spy Hat",
        health: 44,
        boostSpeed: 2,
        armor: 1,
        cost: 150,
        wid: 80,
        by: 10,
        abilRecharge: 1000,
        image: "spyhat",
        st: "Disguise: Makes it look like you have weak equipment, but goes back after attacking or being hit"

    }
    //from now on keep helmets doing 8 hittimes against spy knife, just better abilities.
    /*HardHat: {
        name: "Hard Hat",
        health: 120,
        armor: 15,
        cost: 200,
        wid: 80,
        by: 35,
        abilRecharge: 6000,
        image: "wizardhat",
        st: "Construct: Build a brick wall right behind you."

    },*/


};
var chest = {

    //T2
    LeatherShirt: {
        name: "Leather Shirt",
        health: 30,
        armor: 3,
        cost: 20,
        wid: 45,
        by: 10,
        image: "leathershirt"
    },
    //T3
    MossCape: {
        name: "Moss Cape",
        health: 90,
        regen: 1,
        cost: 30,
        wid: 50,
        by: 15,
        image: "mosscape",
        imageback: "mosscapeback"
    },
    //T4
    SpyCloak: {
        name: "Spy Cloak",
        health: 80,
        armor: 4,
        boostSpeed: 1,
        cost: 50,
        wid: 71,
        by: 0,
        image: "spycloak",
        imageback: "spycloakback"
    },
    SkeletonSuit: {
        name: "Skeleton Suit",
        health: 104,
        armor: 2,
        regen: 4,
        cost: 50,
        wid: 50,
        by: 10,
        image: "skeletonsuit"
    },
    //T5
    ElvenCloak: {
        name: "Elven Cloak",
        health: 107,
        armor: 3,
        boosttime: 7,
        regen: 2,
        cost: 70,
        wid: 60,
        by: 13,
        image: "elvencloak",
        imageback: "elvencloakback"
    },
    ChainmailChestplate: {
        name: "Chainmail Chestplate",
        health: 60,
        armor: 10,
        cost: 70,
        wid: 50,
        by: 0,
        image: "chainmailchestplate",
        st: "15% chance of taking 0 damage"
    },

    //T6
    KnightChestplate: {
        name: "Knight Chestplate",
        health: 37,
        armor: 15,
        cost: 100,
        wid: 50,
        by: 0,
        image: "knightchestplate"
    },
    ArcherCloak: {
        name: "Archer Cloak",
        health: 207,
        armor: 6,
        cost: 100,
        wid: 50,
        boostSpeed: 1,
        image: "archercloak",
        by: 0,
        st: "Your ranged weapons do 20% more damage"
    },
    //T7
    ArmyJacket: {
        name: "Army Jacket",
        health: 226,
        armor: 8,
        cost: 120,
        wid: 50,
        by: 0,
        image: "armyjacket"
    },
    BlazingCloak: {
        name: "Blazing Cloak",
        health: 149,
        armor: 8,
        cost: 150,
        wid: 50,
        by: 0,
        image: "blazingcloak",
        st: "When you are hit by a melee weapon, there is a 35% chance attacker is lit on fire"
    },
    //T9
    TeslaChestplate: {
        name: "Tesla Chestplate",
        health: 339,
        armor: 9,
        cost: 200,
        wid: 85,
        by: 0,
        image: "teslachestplate",
        st: "When you are attacked, 10% chance to zap 4 nearby shapes or players for 20 damage"
    },
    GoldenCloak: {
        name: "Golden Cloak",
        health: 378,
        armor: 8,
        cost: 220,
        wid: 50,
        by: 0,
        image: "goldencloak",
        st: "Your stun abilities have 10% greater chance to activate"
    },
    //T10
    CrystalChestplate: {
        name: "Crystal Chestplate",
        health: 404,
        armor: 21,
        cost: 300,
        wid: 65,
        by: 0,
        image: "crystalchestplate",

    },

};
var weapons = {
    //T0
    SmallBranch: {
        name: "Small Branch",
        damage: 1,
        type: "Melee",
        cost: 3,

        image: "deadbranch",
        len: 60
    },
    //T1
    Pitchfork: {
        name: "Pitchfork",
        damage: 3,

        type: "Melee",
        cost: 10,
        image: "pitchfork",
        len: 70
    },
    BasicBow: {
        name: "Basic Bow",
        damage: 1,
        type: "Ranged",
        cost: 10,
        range: 500,
        projSpeed: 5,
        image: "bow",
        ammolen: 70,
        maxAmmo: 8,
        len: 80,
        offx: -20,
        dispDist: 0,
    },
    Candlestick: {
        name: "Candlestick",
        aspeed: 2,
        type: "Melee",
        cost: 15,
        image: "candlestick",
        len: 60,
        st: "35% chance to light opponent on fire when attacking"
    },
    //T2
    KnightSword: {
        name: "Knight Sword",
        damage: 2,
        armorp: 1,
        aspeed: 2,
        type: "Melee",
        cost: 20,
        image: "knightsword",
        len: 80
    },
    WoodenClub: {
        name: "Wooden Club",
        damage: 5,
        armorp: 3,
        aspeed: -3,
        type: "Melee",
        cost: 20,
        image: "woodenclub",
        len: 85,
        st: "15% chance of stunning opponent for 1 second"
    },
    //T3
    Battleaxe: {
        name: "Battleaxe",
        damage: 8,
        armorp: 1,
        type: "Melee",
        cost: 40,
        image: "battleaxe",
        len: 120
    },
    Spear: {
        name: "Spear",
        damage: 4,
        armorp: 2,
        aspeed: 3,
        type: "Melee",
        cost: 40,
        image: "spear",
        len: 150
    },
    //T4
    Torch: {
        name: "Torch",
        aspeed: 2,
        damage: 4,
        type: "Melee",
        cost: 65,
        image: "torch",
        len: 110,
        st: "35% chance to light opponent on fire when attacking"
    },
    Crossbow: {
        name: "Crossbow",
        damage: 5,
        aspeed: 5,
        armorp: 2,
        type: "Ranged",
        cost: 65,
        range: 500,
        projSpeed: 5,
        image: "crossbow",
        ammolen: 84,
        maxAmmo: 8,
        len: 60,
        offx: -16,
        offy: 7,
        dispDist: 45,
    },
    /*FlamingBow: {
    name: "Flaming Bow",//stats wrong!!
    damage: 1,
    type: "Ranged",
    cost: 10,
    range: 750,
    projSpeed: 5,
    image: "bow",
    ammolen: 70,
    len: 80,
    offx: -20
    },*/
    //T5
    Mace: {
        name: "Mace",
        aspeed: -1,
        damage: 11,
        armorp: 5,
        type: "Melee",
        cost: 80,
        image: "mace",
        len: 100,
        st: "15% chance of stunning opponent for 1 second"

    },
    //T6

    ElvenBlade: {
        name: "Elven Blade",
        aspeed: 9,
        damage: 9,
        armorp: 2,
        type: "Melee",
        cost: 100,
        image: "elvenblade",
        len: 120
    },
    TeslaSword: {
        name: "Tesla Sword",
        aspeed: 1,
        damage: 8,
        armorp: 5,
        type: "Melee",
        cost: 100,
        image: "teslasword",
        len: 100,
        st: "When attacking, 20% chance to zap 4 nearby shapes or players for 20 damage"
    },
    //T8
    MegaHammer: {
        name: "Mega Hammer",
        aspeed: -5,
        damage: 76,
        armorp: 10,
        type: "Melee",
        cost: 150,
        image: "megahammer",
        len: 120

    },
    SpyKnife: {
        name: "Spy Knife",
        aspeed: 10,
        damage: 14,
        armorp: 5,
        type: "Melee",
        cost: 150,
        image: "spyknife",
        len: 50

    },
    //T9
    BlazingSword: {
        name: "Blazing Sword",
        aspeed: 2,
        damage: 30,
        armorp: 3,
        type: "Melee",
        cost: 200,
        image: "blazingsword",
        len: 90,
        st: "35% chance to light opponent on fire when attacking"

    },
    Trident: {
        name: "Trident",
        aspeed: 1,
        damage: 41,
        armorp: 3,
        type: "Melee",
        cost: 200,
        image: "trident",
        len: 150
    },
    //T10
    Flamethrower: {
        name: "Flamethrower",
        damage: 5,
        aspeed: 53,//21
        armorp: 10,
        type: "Ranged",
        cost: 300,
        range: 300,
        projSpeed: 5,
        image: "flamethrower",
        maxAmmo: 55,//vamp has 70h left
        st: "Lights stuff on fire when attacking",
        ammolen: 67,
        len: 50,
        dispDist: 100,
        offx: -20
    },
    VampiricSword: {
        name: "Vampiric Sword",
        aspeed:1,
        damage: 40,
        armorp: 7,
        type: "Melee",
        cost: 300,
        st: "10% chance to heal 40 health when attacking a player",
        image: "vampiricsword",
        len: 100
    },

    RocketLauncher: {
        name: "Rocket Launcher",
        damage: 203,
        armorp: 21,
        type: "Ranged",
        cost: 500,
        range: 750,
        projSpeed: 2,
        image: "rocketlauncher",
        maxAmmo: 1,
        st: "Shoots a homing missile that explodes",
        ammolen: 150,
        len: 50,
        dispDist: 160,
        offx: -20,
        offy: 5,
    },
    PhantomBlade: {
        name: "Phantom Blade",
        aspeed: 2,
        damage: 30,
        armorp: 999,
        type: "Melee",
        cost: 500,
        st: "50% chance to scare a hit player, making them do half damage",
        image: "phantomblade",
        len: 120,
    },


};
var boots = {
    /*Ameriboots: {
        name: "Ameriboots",
        speed: 3,
        armor: 2,
        cost: 50,
        image: "ameriboots",
        wid: 50
    },
    /*WeirdBoots: {
        name: "Weird Boots",
        speed: 5,
        armor: 1,
        cost: 50,
        image: "weirdboot",
        wid: 50
    },*/
    //(10*boosttime+(1000-4*cost))*(5+(boostspeed)/10) should equal about 5000
    KnightBoots: {
        name: "Knight Boots",
        armor: 3,
        boosttime: 8,
        cost: 60,
        image: "knightboot",
        wid: 50,
        by: 5,
    },
    VineShoes: {
        name: "Vine Shoes",
        boosttime: 1,
        boostSpeed: 1,
        regen: 1,
        cost: 12,
        image: "vineboots",
        by: 20,
        wid: 50
    },
    LeatherBoots: {
        name: "Leather Boots",
        boosttime: 3,
        cost: 10,
        image: "leatherboots",
        wid: 40,
        by: 4,
    },
    ElvenBoots: {
        name: "Elven Boots",
        boosttime: 13,
        boostSpeed: 4,
        cost: 85,
        image: "elvenboots",
        wid: 50,
        by: 4,
    },
};
function teslaEffect(player, ob) {
    let md = 700; //max distance
    if (Math.random() <= 0.2) {

        let czap = [];
        for (let p of players) {
            if (p != player) {
                let dis = Math.dist(p.pos, ob.pos);

                if (dis <= md) {

                    czap.push(p);
                }
            }

        }
        for (let o of obs) {
            let dis = Math.dist(ob.pos, o.pos);

            if (dis <= md) {
                czap.push(o);
            }

        }
        var zap = [];
        for (let i = 0; i <= 3; i++) {
            if (czap.length > 0) {
                var rand = czap[Math.floor(Math.random() * czap.length)];
                czap.remove(rand);

                zap.push(rand);
            }
        }

        let points = [];

        for (let z of zap) {
            let bolt = [];
            bolt.push(ob.pos);

            let mid = [(ob.pos[0] + z.pos[0]) / 2, (ob.pos[1] + z.pos[1]) / 2];
            mid = [mid[0] + ((Math.random() - 0.5) * 150), mid[1] + ((Math.random() - 0.5) * 150)];
            bolt.push(mid);

            let midu = [(ob.pos[0] + mid[0]) / 2, (ob.pos[1] + mid[1]) / 2];
            midu = [midu[0] + ((Math.random() - 0.5) * 150), midu[1] + ((Math.random() - 0.5) * 150)];
            bolt.push(midu);

            let midd = [(mid[0] + z.pos[0]) / 2, (mid[1] + z.pos[1]) / 2];
            midd = [midd[0] + ((Math.random() - 0.5) * 150), midd[1] + ((Math.random() - 0.5) * 150)];
            bolt.push(midd);

            bolt.push(z.pos);
            points.push(bolt);

            if (z.hasOwnProperty("name")) {
                dirDamage(z, 20, player.id);
            } else {
                damageShape(z, player, 20, false, false);

            }
        }

        addEffect("map", 2, 200, true, points);

    }
}
var onHit = {
    WoodenClub: function (player, op) {
        let plus = (hasAbil(player, "GoldenCloak") ? 0.1 : 0);

        if (Math.random() <= 0.15 + plus) {
            addEffect(op, 0, 200, true);

        }
    },
    Mace: function (player, op) {
        let plus = (hasAbil(player, "GoldenCloak") ? 0.1 : 0);
        if (Math.random() <= 0.15 + plus) {
            addEffect(op, 0, 200, true);
        }
    },
    VampiricSword: function (player, op) {
        if (randomChance(0.1)) {
            regenPlayer(player, 40);
        }

    },
    Candlestick:
        function (player, op) {
            if (Math.random() <= 0.35) {
                addEffect(op, 1, 500, false, [0, 75, 2, player.id]);
            }
        },
    Torch:
        function (player, op) {
            if (Math.random() <= 0.35) {
                addEffect(op, 1, 500, false, [0, 75, 4, player.id]);
            }
        },
    BlazingSword:
        function (player, op) {

            if (Math.random() <= 0.35) {
                addEffect(op, 1, 250, false, [0, 75, 10, player.id]);
            }
        },
    Flamethrower:
        function (player, op) {
            addEffect(op, 1, 250, false, [0, 75, 14, player.id]);
        },
    TeslaSword:
        teslaEffect,
    RocketLauncher:
        function (player, op) {

            addEffect("map", 5, 100, false, op.pos);
            var effectRange = 170;//pyth theorm for 250+250, the size of the explosion image. Divide by 2 to get radius from diameter. Reduced a bit
            var pToDamage = [];
            for (let p of players) {
                if (/*p.id!=player.id && */p.id != op.id) {//don't hurt myself, or the person who was first hit
                    if (Math.dist(p.pos, op.pos) <= effectRange) {
                        pToDamage.push(p);
                    }

                }
            }
            for (let p of pToDamage) {
                dirDamage(p, 40, player.id);
            }

            var obsToDamage = [];
            for (let o of obs) {
                if (o.id != op.id) {//check is for onshapehit, this function is reused
                    if (Math.dist(o.pos, op.pos) <= effectRange) {
                        obsToDamage.push(o);
                    }
                }

            }
            for (let o of obsToDamage) {
                damageShape(o, player, 40, false, false);
            }
        },
    PhantomBlade:
        function (player, op) {
            if (randomChance(0.5)) {
                op.otherAbilInfo.PhantomBlade = 1000;
                addOtherInfo(op, "PhantomScare", true);

            }
        }

};

var onShapeHit = {
    TeslaSword:
        teslaEffect,
    Candlestick:
        function (player, ob) {
            if (Math.random() <= 0.35) {
                shapeEffect(ob, 1, 500, false, [0, 75, 2, player.id]);
            }
        },
    BlazingSword:
        function (player, ob) {
            if (Math.random() <= 0.35) {
                shapeEffect(ob, 1, 500, false, [0, 75, 10, player.id]);
            }
        },
    Torch:
        function (player, ob) {
            if (Math.random() <= 0.35) {
                shapeEffect(ob, 1, 500, false, [0, 75, 4, player.id]);
            }
        },
    Flamethrower:
        function (player, ob) {

            shapeEffect(ob, 1, 250, false, [0, 75, 14, player.id]);
        },
    RocketLauncher:
        onHit.RocketLauncher,


};

var onAttacked = {//victim, playerAttacking, damage,fromProjectile
    ChainmailChestplate:
        function (player, op, damage) {

            if (Math.random() <= 0.15) {

                return 0;
            }
            return damage;
        },
    BlazingCloak:
        function (player, op, damage, fromProjectile) {

            if ((!fromProjectile) && Math.random() <= 0.35) {
                addEffect(player, 1, 500, false, [0, 75, 6, op.id]);
            }
            return damage;
        },
    TeslaChestplate: function (player, op, damage) {
        teslaEffect(op, player);

        return damage;
    },


};
var damageModify = {
    ArcherCloak:
        function (player, op, damage, fromProjectile) {
            if (fromProjectile) {
                return Math.round(damage * 0.2);//increase damage by 20%
            }
            return 0;
        }

};
var activatedAbil = {
    VikingHelmet: function (player) {
        addBonus(player, "damage", 10, 2000, false, function(p){return p.atype=="Melee";});
        addBonus(player, "attackspeed", 1, 2000, false);
        addEffect(player, 2, 2000, false, [], true);
        return true;
    },
    MossHat: function (player) {
        player.rt = 0;
        regenPlayer(player, 25);
        return true;

    },
    StrawHat: function (player) {

        addEffect(player, 3, 1000, true);
        return true;


    },
    SpyHat: function (player) {
        if (player.attacking) {
            return false;
        } else {
            var fakeHelmet = randomChoice([helmets.MossHat, false]);
            var fakeBoots = randomChoice([boots.LeatherBoots, boots.VineShoes, false]);
            var fakeWeapon = randomChoice([weapons.SmallBranch, weapons.Pitchfork, weapons.BasicBow, false]);
            var fakeChest = randomChoice([chest.LeatherShirt, false]);
            fakeItemChange(player, fakeWeapon, "weapon");
            fakeItemChange(player, fakeBoots, "boots");
            fakeItemChange(player, fakeChest, "chest");
            fakeItemChange(player, fakeHelmet, "helmet");
            player.otherAbilInfo.SpyHat = {
                helmet: fakeHelmet.name,
                chest: fakeChest.name,
                boots: fakeBoots.name,
                weapon: fakeWeapon.name
            };
            return true;
        }



    },
    WizardHat: function (player) {
        //oldx, oldy, newx, newy, isStart, poofID for effects
        let poofID=Math.random();
        var nx = Math.floor((Math.random() * maplimitx));
        var ny = Math.floor((Math.random() * maplimity));
        let i=0;
        while(i<3 && Math.dist([nx, ny], player.pos)<1500){
            nx = Math.floor((Math.random() * maplimitx));
            ny = Math.floor((Math.random() * maplimity));
            i++;
        }
        
        addEffect(player, 4, 500, true, [nx, ny, poofID], false);
        addEffect("map", 4, 510, true, [Math.round(player.pos[0]), Math.round(player.pos[1]), nx, ny, false, poofID], true);//starting poof
        return true;
    }
};
var otherObjectHit = {
    0: function (player, object, fromProjectile) {
        if (object.age == 1000) {
            if (player.chealth < player.mhealth) {
                regenPlayer(player, 40);
            } else {
                changeMoney(player, 2);
            }
        }

        removeOtherObject(object);
    }
};
//END CALC COPY
function spawnStartingShapes(){
    for (let i = 0; i < (numobs * 0.4); i++) {
        spawnShape(1);
    }
    for (let i = 0; i < (numobs * 0.3); i++) {
        spawnShape(2);
    }
    for (let i = 0; i < (numobs * 0.2); i++) {
        spawnShape(3);
    }
    for (let i = 0; i < (numobs * 0.1); i++) {
        spawnShape(4);
    }
}
function urt() {
    var len = rjoin.length;
    var toRem = [];
    for (let i = 0; i < len; i++) {
        let r = rjoin[i];
        r[2] += 1;
        if (r[2] > 120) {
            toRem.push(r);

        }
    }
    len = toRem.length;
    for (let i = 0; i < len; i++) {
        let r = toRem[i];
        rjoin.remove(r);
    }
}
/**
 * 
 * @param {Player} player the player the effect is applying to, or the string "map" if it should be a map/global effect
 * @param {Number} eid the number of the effect type. 0=stun, 1=fire, 2=battlerage, 3=farmer, 4=wizardpoof 5=rpgboom
 * @param {Number} duration duration in 5ms ticks it will last
 * @param {Boolean} stack if it is allowed to stack with others of this type
 * @param {Array} extra any extra info needed for this effect
 * @param {Boolean} purelyVisual if this is a purely visual effect that should simply be transmitted to the client
 */
function addEffect(player, eid, duration, stack, extra = [], purelyVisual = false) {
    if (player != "map") {
        if (!purelyVisual) {
            let ind = "n";
            if (!stack) {
                for (let e of player.effects) {
                    if (e[0] == eid) {
                        ind = player.effects.indexOf(e);
                        break;

                    }
                }
            }
            if (ind == "n") {

                if (extra.length != 0) {
                    player.effects.push([eid, duration, duration, extra]);
                } else {
                    player.effects.push([eid, duration, duration]);
                }
            } else {
                if (extra.length != 0) {
                    if (eid == 1) {
                        extra[0] = player.effects[ind][3][0];
                    }
                    player.effects[ind] = [eid, duration, duration, extra];
                } else {
                    player.effects.push([eid, duration, duration]);
                }
            }
        }

        socketServer.emit("effect", [player.id, eid, duration]);
    } else {
        socketServer.emit("meffect", [eid, duration, extra]);
    }

}
function alwaysTrue(){
    return true;
}
/**
 * Add a stat bonus to the player
 * @param {Player} player the player
 * @param {String} statName the name of the stat being bonused
 * @param {Number} amount how much the bonus should be
 * @param {Number} duration how long it should last, in ticks (5ms each)
 * @param {Boolean} isPercent if the expressed amount is a percent increase between 0-1, or an absolute increase
 * @param {Function} validator function that takes a player, return true if the bonus should apply. default=always true
 */
function addBonus(player, statName, amount, duration, isPercent, validator=alwaysTrue) {
    player.allBonus.push([statName, amount, isPercent, duration, duration, validator]);//stat, amount, time, remainingTime
}
function startBoost(player) {
    player.boosting = true;
}
function endBoost(player) {
    player.boosting = false;
}
function shapeEffect(shape, eid, duration, stack, extra = []) {
    if (shape != "map") {
        let ind = "n";
        if (!stack) {
            for (let e of shape.effects) {
                if (e[0] == eid) {
                    ind = shape.effects.indexOf(e);
                    break;
                }

            }
        }
        if (ind == "n") {
            if (extra.length != 0) {
                shape.effects.push([eid, duration, duration, extra]);
            } else {
                shape.effects.push([eid, duration, duration]);
            }
            socketServer.emit("seffect", [shape.id, eid, duration]);
        } else {
            if (extra.length != 0) {
                if (eid == 1) {
                    extra[0] = shape.effects[ind][3][0];
                }
                shape.effects[ind] = [eid, duration, duration, extra];
            } else {
                shape.effects.push([eid, duration, duration]);
            }
            socketServer.emit("seffect", [shape.id, eid, duration]);
        }
    } else {
        socketServer.emit("meffect", [eid, duration, extra]);
    }
}
function hasAbil(player, abil) {
    for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
        if (mine) {
            var un = removeSpaces(mine.name);
            if (un == abil) {
                return true;
            }
        }
    }

    return false;
}
function dumpPlayer(socket) {
    console.log("hasBought=");
    console.log(socket.hasBought);
    console.log("name=");
    console.log(socket.name);
    console.log("chest=");
    console.log(socket.chest);
    console.log("helmet=");
    console.log(socket.helmet);
    console.log("weapon=");
    console.log(socket.weapon);
    console.log("boots=");
    console.log(socket.boots);
    console.log("money=");
    console.log(socket.money);
    console.log("maxCost=");
    console.log(socket.maxCost);
    console.log("otherAbilInfo=");
    console.log(socket.otherAbilInfo);
    console.log("attacking=");
    console.log(socket.attacking);
}
setInterval(urt, 10000);
socketServer.sockets.on("connection", function (socket) {
    
    socket.emit("items", [helmets, chest, boots, weapons, serverVersion]);
    socket.on("newplayer", function (info) {
        var canJoin = true;
        var stopInfo;
        if (players.indexOf(socket) != -1) {//no double-joining
            console.log(socket.name + " is a hacker (maybe)!");
            canJoin = false;
        }
        var userID = info[2] || Math.random();
        socket.userID = userID;
        currentUserIDs.push(userID);
        let num = currentUserIDs.countNumber(userID);
        if (num >= 5) {//tabs = 2
            console.log("Someone is spamming tabs");
            canJoin = false;
        }
        if (canJoin) {
            if (!info[0]) { info[0] = ""; }
            info[0] = info[0].trim();
            info[0] = info[0].substring(0, 16).normalize("NFD").replace(/[\u0300-\u036f]{2,}/g, "");
            if (info[0] === "") {
                info[0] = "Player";
            }
            socket.name = clean(info[0]);
            //var hash=require('crypto').createHash('md5').update(socket.name).digest("hex");
            //console.log(hash);
            socket.pos = [Math.floor((Math.random() * maplimitx)), Math.floor((Math.random() * maplimity))];
            socket.direction = 0;
            socket.actspeed = 1;
            socket.chealth = 100;
            socket.attacking = false;
            socket.anim = 0;
            socket.attackdel = 0;
            socket.attackspeed = 10;
            socket.value = 0;
            socket.ld = "none";
            socket.spawnProtectionTime=spawnSafetyTime;
            socket.availBoost = 1000;
            socket.maxBoost = 1000;
            socket.boostSpeed = 5;
            socket.boosting = false;

            socket.abilTimer = 0;
            socket.rect = {
                right: 0,
                left: 0,
                top: 0,
                bottom: 0
            };
            socket.facing = "right";
            socket.money = 0;//setmoney
            socket.hasHit = [];
            socket.hasBought = [];
            socket.rdelay = 0;
            socket.weapon = false;
            socket.chest = false;
            socket.helmet = false;
            socket.boots = false;
            socket.maxCost = {
                "boots": 0,
                "weapon": 0,
                "helmet": 0,
                "chest": 0,
            };
            socket.totalItemCosts = 0;
            socket.dt = [];
            socket.rt = 0;
            socket.regen = 10;
            socket.availAmmo = 0;
            socket.maxAmmo = 0;
            socket.reloading = false;
            socket.reloadTime = 500;
            socket.reloadDelay = 0;
            socket.effects = [];
            socket.allBonus = [];
            socket.otherAbilInfo = {};
            players.push(socket);
            if (info[1]) {
                for (let r of rjoin) {
                    if (r[0] == info[1]) {
                        socket.money = r[1];
                        rjoin.remove(r);

                    }
                }
            }

            console.log(info[0] + " has joined, with " + socket.money + " money");
            calcStats(socket);
            socket.availBoost = socket.maxBoost;
            let every = [];
            for (let player of players) {
                var helmetName;
                var chestName;
                var bootsName;
                var weaponName;
                if (player.otherAbilInfo.SpyHat) {
                    var fakeStuff = player.otherAbilInfo.SpyHat;
                    helmetName = fakeStuff.helmet;
                    chestName = fakeStuff.chest;
                    bootsName = fakeStuff.boots;
                    weaponName = fakeStuff.weapon;
                } else {
                    helmetName = player.helmet.name;
                    chestName = player.chest.name;
                    bootsName = player.boots.name;
                    weaponName = player.weapon.name;
                }
                var otherInfo = {};//TODO fix why this sometimes doesnt work
                if (player.otherAbilInfo != undefined) {
                    if (player.otherAbilInfo.PhantomBlade) {
                        otherInfo["PhantomScare"] = true;
                    }
                }
                every.push({
                    id: player.id,
                    effects: player.effects,
                    spawnProtection: player.spawnProtectionTime>0,
                    facing: player.facing,
                    name: player.name,
                    pos: player.pos,
                    mhealth: player.mhealth,
                    chealth: player.chealth,
                    anim: player.anim,
                    helmet: helmetName,
                    chest: chestName,
                    boots: bootsName,
                    weapon: weaponName,
                    otherInfo: otherInfo
                });
            }
            var cobs = [];
            for (let ob of obs) {
                cobs.push({
                    id: ob.id,
                    effects: ob.effects,
                    pos: ob.pos,
                    health: ob.health,
                    type: ob.type
                });
            }
            var cprojs = [];
            for (let p of projs) {
                cprojs.push({
                    id: p.id,
                    pos: p.pos,
                    ang: p.direction,
                    type: p.type
                });
            }
            socket.broadcast.emit("newplayer", [socket.id, socket.pos, socket.name]);
            socket.emit("all", [every, cobs, cprojs, socket.id, socket.money, socket.maxBoost, otherObjects]);
            calcLeaderboard();
            socket.initialized = true;
        } else {
            socket.emit("stopit");//tell client to stop trying to reconnect
        }
    });
    socket.on("dchange", function (newd) {
        let angle=(newd[0] % 360) + (newd[0] > 0 ? -360 : 0);
        socket.direction = angle;
        let d = -angle;
        let upt = d < 90 && d >= 0;
        let dnt = d > 270 && d < 360;
        if (upt || dnt) {
            socket.facing = "right";
        } else if (d !== 0) {
            socket.facing = "left";
        }
        socket.actspeed = Math.max(Math.min(newd[1], 1), 0);
    });
    socket.on("buyitem", function (iname) {
        if (!socket.initialized) { return; }
        if (typeof socket.name === "undefined") {
            console.log("undefined socket send.");
            console.log("is pos undefined? pos is: ");
            console.log(socket.pos);
            dumpPlayer(socket);
            return;
        }
        let item = undefined;
        let z;
        iname = removeSpaces(iname);
        if (helmets.hasOwnProperty(iname)) {
            z = "helmet";
            item = helmets[iname];
        } else if (chest.hasOwnProperty(iname)) {
            z = "chest";
            item = chest[iname];
        } else if (boots.hasOwnProperty(iname)) {
            z = "boots";
            item = boots[iname];
        } else if (weapons.hasOwnProperty(iname)) {
            z = "weapon";
            item = weapons[iname];
        }
        if (item == undefined) {
            item = {
                cost: 9999999
            };
        }
        var toPay = item.cost;
        try {
            if (socket.hasBought.includes(item.name)) {
                //already owned, no need to pay
                toPay = 0;
            }

        } catch (error) {
            console.log("The error occured!");
            console.log(error);
            dumpPlayer(socket);
            console.log("item=");
            console.log(item);
        }

        if (socket.money >= toPay) {

            changeMoney(socket, -toPay);
            if (!socket.hasBought.includes(item.name)) {
                socket.hasBought.push(item.name);
            }

            if (z == "helmet") {
                socket.helmet = item;
            } else if (z == "chest") {
                socket.chest = item;
            } else if (z == "boots") {
                socket.boots = item;
            } else if (z == "weapon") {
                socket.weapon = item;
            }
            var healthMod = (item.health != undefined ? item.health : 0);
            var healthPerc = socket.chealth / socket.mhealth;
            socket.totalItemCosts += toPay;
            if (item.cost > socket.maxCost[z]) {
                socket.maxCost[z] = item.cost;
            }
            if (item.type == "Ranged") {
                forceReload(socket);
            }
            if (item.hasOwnProperty("abilRecharge")) {
                socket.abilTimer = 0;//reset ability timer to prevent exploits
            }
            calcStats(socket);
            socket.chealth = int(socket.mhealth * healthPerc);
            console.log(socket.name + " bought: " + item.name);

            if (socket.chealth > socket.mhealth) {
                socket.chealth = socket.mhealth;
            }
            var curDamage = socket.mhealth - socket.chealth;
            socketServer.emit("echange", [socket.id, item.name, z, socket.mhealth, curDamage]);
            socket.emit("maxboost", [socket.maxBoost, socket.availBoost]);
            /*if(item.name=="Leather Shirt" && socket.name=="Warrior"){
                changeMoney(socket,-9990);
            }*/

        }
    });
    socket.on("astart", function (info) {
        if (!socket.initialized) { return; }
        socket.attacking = true;
        checkForSpy(socket);
        if(socket.spawnProtectionTime>0){
            endSpawnProtection(socket);
        }
    });
    socket.on("aend", function (info) {
        socket.attacking = false;
    });
    socket.on("reload", function () {

        forceReload(socket);

    });
    socket.on("booststart", function (info) {
        startBoost(socket);
    });
    socket.on("boostend", function (info) {
        endBoost(socket);
    });
    socket.on("activatehelmetabil", function () {
        if (socket.helmet != undefined && socket.helmet.hasOwnProperty("abilRecharge") && socket.abilTimer >= socket.helmet.abilRecharge) {
            var worked = activatedAbil[removeSpaces(socket.helmet.name)](socket);
            if (worked) {
                socket.abilTimer = 0;
                socket.emit("abilused");
            }

        }
    });
    socket.on("chat", function (text) {
        text = text || "";
        text = text.substring(0, 75).normalize("NFD").replace(/[\u0300-\u036f]{2,}/g, "");
        var filtered = clean(text);
        if (text.length === 0) {
            return;
        }
        if (text.toLowerCase().includes("@admin")) {
            console.log(socket.name + " chatted: " + text);
        }

        socketServer.emit("chat", [socket.id, filtered, "chat"]);
    });
    socket.on("disconnect", function (rj) {
        console.log(socket.name + " quit.");
        if (players.includes(socket)) {
            players.remove(socket);
        }

        if (currentUserIDs.includes(socket.userID)) {
            currentUserIDs.remove(socket.userID);
        }

        socket.disconnect(true);

        socketServer.emit("delplayer", socket.id);
        removeRejoinCode(rj);
        calcLeaderboard();
    });
});
server.listen(process.env.PORT || 8080);
//keepAlive.wakeUpDyno("http://stikk-server.herokuapp.com/", 1000 * 60 * 25);//revive every 25 minutes
lastTime = present();
redirectToUpdate();

