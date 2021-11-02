

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
var present = function () { return performance.now() };
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

    if (state == "sim") { 
        update();
        if(maxSpeed){
            for(var i=0;i<100;i++){
                update();
            }
        }
        

    };
    
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
        //console.log(badFrames);
        if (badFrames >= 100 && !wasSlow && players.length >= 2) {

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

                    damageShape(ob, f[3][3], f[3][2], false);
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
                    damageShape(ob, player, proj.damage, true);
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
    aiGetChoices(playerA,playerB);
    aiGetChoices(playerB,playerA);
    var spi = [];
    var deadPlayers = [];
    let aangle;
    for (var player of players) {
        if (player.helmet && player.helmet.hasOwnProperty("abilRecharge")) {
            if (player.abilTimer < player.helmet.abilRecharge) {
                player.abilTimer += 1;
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
                            damageShape(ob, player, getStat(player, "damage"), true);
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
    var origD = damage;
    for (let mine of [player.helmet, player.chest, player.boots, player.weapon]) {
        if (mine) {
            let un = removeSpaces(mine.name);
            if (damageModify.hasOwnProperty(un)) {
                damage += damageModify[un](player, victim, origD);
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

    player.chealth -= da;
    player.rt = 2000;
    player.ld = id;
    socketServer.emit("healthchange", [player.id, player.chealth]);
    checkForSpy(player);
    console.log(player.name, " took ", da)
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
function damageShape(shape, player, da, abil) {
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

                    da += damageModify[un](player, shape, origD);
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

    maxSpeed=false;
    if (killer.chealth>0) {
        winnerElem.innerHTML = "Player " + killer.name + " won. They had " + killer.chealth + " health left.";
    } else {
        winnerElem.innerHTML = "Both players killed the other.";
    }
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
            if (bonus[2] === true) {//if it is a percent increase
                totalBonus += player[statName] * bonus[1];
            } else {
                totalBonus += bonus[1];//it is an absolute increase
            }
        }

    }
    return Math.round(totalBonus);//no decimals allowed!


}
const maplimitx = 3000;
const maplimity = 1800;

var players = [];
var currentUserIDs = [];
var obs = [];
var otherObjects = [];
var projs = [];
var numobs = 0;

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


var url = "/Github/Stikk.io/server.js";
var request = new XMLHttpRequest();
request.open('GET', url+"?nocache="+Math.random(), false);  // `false` makes the request synchronous
request.send();
var response=request.responseText;
if (request.status !== 200) {
  console.error("server get failed");
}
var itemsDefString=response.split('//START CALC COPY').pop().split('//END CALC COPY')[0]; 
//console.log(itemsDefString);

eval(itemsDefString);// define all of the items!

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
/**
 * Add a stat bonus to the player
 * @param {Player} player the player
 * @param {String} statName the name of the stat being bonused
 * @param {Number} amount how much the bonus should be
 * @param {Number} duration how long it should last, in ticks (5ms each)
 * @param {Boolean} isPercent if the expressed amount is a percent increase between 0-1, or an absolute increase
 */
function addBonus(player, statName, amount, duration, isPercent) {
    player.allBonus.push([statName, amount, isPercent, duration, duration]);//stat, amount, time, remainingTime
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
function createPlayer(name, pos) {
    var socket;
    if(players.length==1){
        socket = simSocket;//socket is really player
    }else{
        socket=dummySocket;//first is viewing socket, second is dummy player
    }
    socket.name = name;
    socket.pos = pos;
    socket.direction = 0;
    socket.actspeed = 1;
    socket.chealth = 100;
    socket.attacking = false;
    socket.anim = 0;
    socket.attackdel = 0;
    socket.attackspeed = 10;
    socket.value = 0;
    socket.ld = "none";

    socket.availBoost = 1000;
    socket.maxBoost = 1000;
    socket.boostSpeed = 5;
    socket.boosting = false;

    socket.id = Math.random();
    socket.abilTimer = 0;
    socket.rect = {
        right: 0,
        left: 0,
        top: 0,
        bottom: 0
    };
    socket.facing = "right";
    socket.money = 9990;//setmoney
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
    socketServer.emit("newplayer", [socket.id, socket.pos, socket.name]);
    socket.emit("all", [every, cobs, cprojs, socket.id, socket.money, socket.maxBoost, otherObjects]);
    calcLeaderboard();
    socket.initialized = true;
    return socket;

}
function setDir(player, newd) {
    var socket = player;
    socket.direction = newd;
    d = -newd;
    upt = d < 90 && d >= 0
    dnt = d > 270 && d < 360
    if (upt || dnt) {
        socket.facing = "right"
    } else if (d !== 0) {
        socket.facing = "left"
    }
}

function setEquipment(player, item, category) {
    var socket = player;
    var z = category;
    if (!["boots", "weapon", "helmet", "chest"].includes(category)) {
        throw "Invalid category: " + z + ". Must be in [boots,weapon,helmet,chest]";
    }
    if (z == "boots") {
        pBoot(item)
    } else if (z == "chest") {
        pChest(item)
    } else if (z == "weapon") {
        pWeapon(item)
    } else if (z == "helmet") {
        pHelmet(item)
    }
    socket[z] = item;

    var healthMod = (item.health != undefined ? item.health : 0)
    var healthPerc = socket.chealth / socket.mhealth;
    if (item.cost > socket.maxCost[z]) {
        socket.maxCost[z] = item.cost;
    };
    calcStats(socket);
    if (item.type == "Ranged") {
        //forceReload(socket);//not for the sim!
        socket.availAmmo=socket.maxAmmo+0;
    }
    socket.chealth = int(socket.mhealth * healthPerc);

    if (socket.chealth > socket.mhealth) {
        socket.chealth = socket.mhealth;
    }
    var curDamage = socket.mhealth - socket.chealth;
    socketServer.emit("echange", [socket.id, item.name, z, socket.mhealth, curDamage]);

}
function loadItems() {
    columns = 2//Weapon Columns
    col = 0;
    inc = 0;
    wentUp = columns - 1;
    first = true
    rows = Math.ceil(weapons.length / columns)
    pWeapon(0);
}
var helmetsD = helmets;
var chestD = chest;
var bootsD = boots;
var weaponsD = weapons;
function setAllEquipment(player,equipment){
    for (eqType of ["chest", "weapon", "helmet", "boots"]) {
        var theEq=equipment[eqType];
        var varName=eqType;
        if(eqType=="weapon" || eqType=="helmet"){varName+="s"}
        window[varName][theEq.name]=theEq;
        setEquipment(player, theEq, eqType);
    }
}

function aiGetChoices(player,otherPlayer){
    var me=player;
    var him=otherPlayer
    var distance=Math.dist(me.pos,him.pos)
    if(me.atype=="Ranged"){
        me.actspeed=1;//real player aims
        if(distance<=me.weapon.range+40+40){
            me.attacking=true;
        }else{
            me.attacking=false;
        }
    }else if(me.atype="Melee"){
        var weaponLen;
        if(me.weapon){
            weaponLen=me.weapon.len+40+40;//40 for armlen,40 for rectsize
        }else{
            weaponLen=80;
        }
        
        if(distance<=weaponLen){
            me.attacking=true;
        }else{
            me.attacking=false;
        }
        if(him.atype=="Ranged"){
            if(me.availBoost>=5){
                if(distance<=him.weapon.range+40+40){
                    me.boosting=true;
                }
            }else{
                me.boosting=false;
            }
        }
        
        me.actspeed=1;
    }

}
var playerA;
var playerB;
var state = "stop";
var maxSpeed=false;
function startServer(equipment) {
    players = [];
    obs = [];
    projs = [];
    spawnStartingShapes();
    startGame([players, obs, projs]);
    playerA = createPlayer("A", [0, 900]);
    playerB = createPlayer("B", [3000, 900]);
    setDir(playerB, -180);
    
    lastTime = present();
    for (var player of [playerA, playerB]) {
        setAllEquipment(player,equipment[player.name]);
        updateHealthDisplay(player)
    }
    

    setTimeout(drawViewport,500);
}
redirectToUpdate();
function startGame(info) {
    pauseElem.style.display = "inline";
    pauseElem.innerHTML = pauseText;
    cli_obs = {};
    cli_projs = {};
    cli_players = {};
    dt = [];
    odt = [];
    geffects = [];
    state = "sim";
    cli_players = [];
    for (nop of info[0]) {
        nop.dt = [];
        cli_players["o" + nop.id] = Object.assign({}, nop);

    }
    cli_obs = [];

    for (nob of info[1]) {
        nob.dt = [];
        cli_obs["o" + nob.id] = Object.assign({}, nob);

    }
    cli_projs = []
    for (nob of info[2]) {

        cli_projs["o" + nob.id] = Object.assign({}, nob);
    }
}
var resumeText = "Resume Simulation";
var pauseText = 'Pause Simulation';
function pauseClicked() {
    var newText = resumeText;
    if (state == "sim") {
        state = 'stop';
    } else {
        state = "sim";
        requestAnimationFrame(drawViewport);
        newText = pauseText;
    }
    pauseElem.innerHTML = newText;
}
function speedupClicked(){
    maxSpeed=!maxSpeed;
}
function beginSim() {
    var allEquipment=getEquipment();
    startServer(allEquipment);
}
function getEquipment(){
    var allEquipment = {};
    for (var pName of ["A", 'B']) {
        var playerEq = {};
        var theItem = {
            name: "Chestplate-"+pName,
            cost: 0,
            wid: 50,
            by: 0,
            image: "chestplace"
        }
        playerEq.chest = theItem;
        getInputForEq(["armor", "health"], theItem, pName)

        var theItem = {
            name: "Weapon-"+pName,
            type:"Melee",
            cost: 0,
            wid: 50,
            len: 60,
            by: 0,
            image: "swordplace"
        }
        
        playerEq.weapon = theItem;
        getInputForEq(["aspeed", "armorp", "damage", 'maxAmmo', "len","range","projSpeed"], theItem, pName)
        if(theItem.len<1){
            playerEq.weapon=false;
        }
        if(theItem.range>=1){
            theItem.type="Ranged";
            theItem.image="bowplace";
            theItem.ammolen=70;
            theItem.dispDist=0;

        }
        var theItem = {
            name: "Boots-"+pName,
            cost: 0,
            wid: 50,
            len: 60,
            by: 0,
            image: "bootplace"
        }
        playerEq.boots = theItem;
        getInputForEq(["boostSpeed","boosttime","speed"], theItem, pName)
        var theItem = {
            name: "Helmet-"+pName,
            cost: 0,
            wid: 70,
		    by: 60,
            image: "helmetplace"
        }
        playerEq.helmet=theItem;
        getInputForEq(["regen"], theItem, pName)

        for(eType of ["chest","weapon","helmet","boots"]){
            var elem=document.getElementById(pName+"-"+eType+"-sim-equip");
            var eName=eType;
            if(eType=="weapon" || eType=="helmet"){
                eName+="s"
            }
            if(elem.value!=""){
                playerEq[eType]=window[eName][elem.value];
            }
        }
        allEquipment[pName]=playerEq;

    }
    return allEquipment
}
function getInputForEq(stats, theItem, pName) {
    for (var stat of stats) {
        theItem[stat] = parseFloat(document.getElementById(pName + "-" + stat + "-sim-equip").value);
    }
}
function updateHealthDisplay(player){
    var p=player;
    document.getElementById(p.name.toLowerCase()+"-current-health").innerHTML=p.chealth;//update current health display

}