let clientVersion=1;
var mapw = 7500;
var maph = 4500;
var xx = 0;
var yy = 0;
var isMobile = 'ontouchstart' in window;
var mip = [];
var canv = document.getElementById("canvas");
var ctx = canv.getContext("2d");
var deathElem=document.getElementById("death");
var leaderboard = document.getElementById("leaderboard");
var chatTitle=document.getElementById("chat-title");
var chatBox=document.getElementById("chat-box");
var chatInput=document.getElementById("chat-input");
var chatMessages=document.getElementById("chat-messages");
var ammoMaxElem=document.getElementById("ammo-max");
var ammoAmountElem=document.getElementById("ammo-amount");
var startWithElem=document.getElementById("startwith");
var readyAmmoElem=document.getElementById("ready-ammo");
var nameElem=document.getElementById("name");
var boostBar = document.getElementById("boost-bar");
var reloadImage = document.getElementById("reload-image");
var ammoBoxElem = document.getElementById("ammo-box");
var ammoImgElem = document.getElementById("ammo-image"); 
var abilBoxElem = document.getElementById("ability-box"); 
var abilCooldownElem=document.getElementById("ability-cooldown");
var connectingTextElem=document.getElementById("loading-text");
var stickmanr = new Image();
stickmanr.src = 'img/stickmanr.png';
var stickmanl = new Image();
stickmanl.src = 'img/stickmanl.png';
var bgrid = new Image();
bgrid.src = 'img/grid.png';
var helmeticon = new Image();
helmeticon.src = 'img/helmeticon.png';
var footicon = new Image();
footicon.src = 'img/footicon.png';
var chesticon = new Image();
chesticon.src = 'img/chesticon.png';
var swordicon = new Image();
swordicon.src = 'img/swordicon.png';
var triangle = new Image();
triangle.src = 'img/triangle.png';
var square = new Image();
square.src = 'img/square.png';
var pentagon = new Image();
pentagon.src = 'img/pentagon.png';
var hexagon = new Image();
hexagon.src = 'img/hexagon.png';
var shopicon = new Image(25, 25);
shopicon.src = 'img/shop.png';
var coinicon = new Image(25, 25);
coinicon.src = 'img/coin.png';
var hearticon = new Image(25, 25);
hearticon.src = 'img/heart.png';
var shieldicon = new Image(25, 25);
shieldicon.src = 'img/shield.png';
var aspeedicon = new Image(25, 25);
aspeedicon.src = 'img/attackspeed.png';
var speedicon = new Image(25, 25);
speedicon.src = 'img/speedicon.png';
var armorpicon = new Image(25, 25);
armorpicon.src = 'img/armorp.png';
var damageicon = new Image(25, 25);
damageicon.src = 'img/damage.png';
var regenicon = new Image(25, 25);
regenicon.src = 'img/regenicon.png';
var stunstars = new Image(25, 25);
stunstars.src = 'img/stunstars.png';
var fireicon = new Image(25, 25);
fireicon.src = 'img/fireicon.png';
var boostSpeedicon = new Image(25, 25);
boostSpeedicon.src = 'img/boostspeed.png';
var boosttimeicon = new Image(25, 25);
boosttimeicon.src = 'img/boosttime.png';
var boostlines = new Image();
boostlines.src = 'img/boostlines.png';
var farmerCropImage=new Image();
farmerCropImage.src = 'img/farmercrop.png';
var farmerCropSmallImage=new Image();
farmerCropSmallImage.src = 'img/farmercropsmall.png';
var explosionImage=new Image();
explosionImage.src = 'img/explosion.png';
var phantomScared=new Image();
phantomScared.src = 'img/phantomScared.png';
var leaderCrown=new Image();
leaderCrown.src = 'img/leaderCrown.png';

//Random stuff for Seeded RNGs (chat color)
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}
function xoshiro128ss(a, b, c, d) {
    return function() {
        var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
        c ^= a; d ^= b;
        b ^= c; a ^= d; c ^= t;
        d = d << 11 | d >>> 21;
        return (r >>> 0) / 4294967296;
    }
}
Math.seededRandom = function(s) {
    // Create xmur3 state:
    var seed = xmur3(s);
    // Output four 32-bit hashes to provide the seed.
    var rand = xoshiro128ss(seed(), seed(), seed(), seed());

    return rand;
    
};

function addFlippedImage(theitem){
    theitem.ri = document.createElement('canvas');
    theitem.ri.width = theitem.pi.width;
    theitem.ri.height = theitem.pi.height;
    var cx = theitem.ri.getContext("2d");
    flipHorizontally(theitem.pi, 0, 0, cx)
}
pWeapon = function (ind) {
    var theitem = weapons[ind];
    var s = theitem.image;
    if (typeof (s) !== "string") {return}
    theitem.image = new Image;
    theitem.spec = "";
    theitem.image.onload = function () {
        //SMALLIM
        theitem.si = document.createElement('canvas');
        if (theitem.image.width > theitem.image.height) {
            wid = 50;
            len = theitem.image.height * (wid / theitem.image.width);
        } else {
            len = 50;
            wid = theitem.image.width * (len / theitem.image.height);
        }

        theitem.si.width = wid;
        theitem.si.height = len;

        var cx = theitem.si.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, wid, len);

        /*BIGIM*/

        theitem.pi = document.createElement('canvas');
        var len = theitem.len;
        var wid = theitem.image.width * (len / theitem.image.height);

        if (theitem.type == "Melee") {
            theitem.pi.width = wid;
            theitem.pi.height = len;
            cx = theitem.pi.getContext("2d");
            cx.drawImage(theitem.image, 0, 0, wid, len);
        } else {

            theitem.pi.width = len;
            theitem.pi.height = wid;
            var cx = theitem.pi.getContext("2d");
            theitem.len = wid;

            /*cx.globalAlpha=0.25;
            cx.fillStyle = "red";
            cx.fillRect(0, 0, theitem.pi.width,theitem.pi.height);
            cx.globalAlpha=1;
            */

            LOADERdrawRotatedImage(theitem.image, len / 2, wid / 2, 90, cx, wid, len);
            var tmp = document.createElement("Canvas");
            tmp.width = theitem.pi.width;
            tmp.height = theitem.pi.height
            flipVertically(theitem.pi, 0, 0, tmp.getContext("2d"));
            theitem.pi = tmp;

            theitem.ammoimg = new Image;
            theitem.ammoimg.onload = (function (inde) {
                return function () {
                    var it = weapons[inde]
                    it.ammo = document.createElement('canvas');
                    var len = it.ammolen;
                    var wid = it.ammoimg.width * (len / it.ammoimg.height);

                    it.ammo.width = wid;
                    it.ammo.height = len;

                    var cx = it.ammo.getContext("2d");
                    cx.drawImage(it.ammoimg, 0, 0, wid, len);
                };
            })(ind);
            theitem.ammoimg.src = "img/" + theitem.image.src.split('/img/')[1].slice(0, -4) + "ammo.png";

            theitem.reloadImg = new Image;
            theitem.reloadImg.onload = (function (inde) {
                return function () {
                    var theitem = weapons[inde];
                    
                    theitem.reloadingImg = document.createElement('canvas');
                    var wid=theitem.pi.height;
                    var len=theitem.pi.width;
                    theitem.reloadingImg.width = theitem.pi.width;
                    theitem.reloadingImg.height = theitem.pi.height;
                    var cx = theitem.reloadingImg.getContext("2d");

                    LOADERdrawRotatedImage(theitem.reloadImg, len / 2, wid / 2, 90, cx, wid, len);
                    var tmp = document.createElement("Canvas");
                    tmp.width = theitem.reloadingImg.width;
                    tmp.height = theitem.reloadingImg.height
                    flipVertically(theitem.reloadingImg, 0, 0, tmp.getContext("2d"));
                    theitem.reloadingImg = tmp;

                    theitem.reloadingImgRight = document.createElement('canvas');
                    theitem.reloadingImgRight.width = theitem.reloadingImg.width;
                    theitem.reloadingImgRight.height = theitem.reloadingImg.height;
                    cx = theitem.reloadingImgRight.getContext("2d");
                    flipHorizontally(theitem.reloadingImg, 0, 0, cx)
                };
            })(ind);
            theitem.reloadImg.src = "img/" + theitem.image.src.split('/img/')[1].slice(0, -4) + "reloading.png";


        }

        //document.getElementById("starts").appendChild(theitem.pi);

        addFlippedImage(theitem);
        if (wentUp == columns - 1) {
            theitem.pos = [1220, (740 - (rows * 55)) + (55 * inc)];
            wentUp = 0;
        } else {
            theitem.pos = [1220 - (55 * (wentUp + 1)), (740 - (rows * 55)) + (55 * inc)];
            wentUp += 1;
            if (wentUp == columns - 1) {
                inc += 1;
            }
        }


        if (ind < weapons.length - 1) {
            ind++;
            pWeapon(ind);

        } else {
            weapons.rect = [1215 - ((columns - 1) * 55), -5 + 740 - (rows * 55), 60 + ((columns - 1) * 55), 5 + (rows * 55)]
            columns = 2//Boots Columns
            col = 0;
            inc = 0;
            wentUp = columns - 1;
            first = true
            rows = Math.ceil(boots.length / columns)
            pBoot(0);
        }
    }
    
    theitem.image.src = "img/" + s + ".png";
    


}
pBoot = function (ind) {
    theitem = boots[ind];
    var s = theitem.image;
    if (typeof (s) !== "string") {return}
    theitem.spec = "";
    theitem.image = new Image;

    theitem.image.onload = function () {

        theitem.pi = document.createElement('canvas');
        //DOUBLE

        wid = theitem.wid;

        len = theitem.image.height * (wid / theitem.image.width);



        an = 40;
        rotim = document.createElement('canvas');
        ns = getRSize(wid, len, an);

        rotim.width = ns[0];
        rotim.height = ns[1];
        rctx = rotim.getContext("2d");



        LOADERdrawRotatedImage(theitem.image, ns[0] / 2, ns[1] / 2, an, rctx, wid, len);

        trimCanvas(rctx, rotim);
        ns = [rotim.width, rotim.height]

        theitem.rh = rotim.height

        spaceing = 70;
        theitem.pi.width = (ns[0] * 2) + spaceing;
        theitem.pi.height = ns[1];

        theitem.pi.width = spaceing + (ns[0] * 1.5)
        theitem.pi.height = ns[1];


        cx = theitem.pi.getContext("2d");

        /*
        cx.globalAlpha=0.25;
        cx.fillStyle = "red";
        cx.fillRect(0, 0, theitem.pi.width,theitem.pi.height);
        cx.globalAlpha=1;
        */

        cx.drawImage(rotim, 0, 0);
        flipHorizontally(rotim, spaceing + (ns[0] / 2), 0, cx)



        //Single
        theitem.si = document.createElement('canvas');
        if (theitem.image.width > theitem.image.height) {
            wid = 50;
            len = theitem.image.height * (wid / theitem.image.width);
        } else {
            len = 50;
            wid = theitem.image.width * (len / theitem.image.height);
        }



        theitem.si.width = wid;
        theitem.si.height = len;

        cx = theitem.si.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, wid, len);

        if (wentUp == columns - 1) {
            theitem.pos = [1220, (740 - (rows * 55)) + (55 * inc)];
            wentUp = 0;
        } else {
            theitem.pos = [1220 - (55 * (wentUp + 1)), (740 - (rows * 55)) + (55 * inc)];
            wentUp += 1;
            if (wentUp == columns - 1) {
                inc += 1;
            }
        }
        if (ind < boots.length - 1) {
            ind++;
            pBoot(ind);
        } else {
            boots.rect = [1215 - ((columns - 1) * 55), -5 + 740 - (rows * 55), 60 + ((columns - 1) * 55), 5 + (rows * 55)]
            columns = 2//Chest Columns
            col = 0;
            inc = 0;
            wentUp = columns - 1;
            first = true
            rows = Math.ceil(chest.length / columns)

            pChest(0)
        }
    }
    
    theitem.image.src = "img/" + s + ".png";
    


}
pChest = function (ind) {
    var theitem = chest[ind];
    var s = theitem.image;
    if (typeof (s) !== "string") {return}

    theitem.spec = "";
    theitem.image = new Image;

    theitem.image.onload = function () {

        theitem.si = document.createElement('canvas');

        if (theitem.image.width > theitem.image.height) {
            var shopwid = 50;
            var shoplen = theitem.image.height * (shopwid / theitem.image.width);
        } else {
            var shoplen = 50;
            var shopwid = theitem.image.width * (shoplen / theitem.image.height);
        }



        theitem.si.width = shopwid;
        theitem.si.height = shoplen;

        var cx = theitem.si.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, shopwid, shoplen);


        /*BIGIM*/

        theitem.pi = document.createElement('canvas');
        var wid = theitem.wid;
        var len = theitem.image.height * (wid / theitem.image.width);


        theitem.pi.width = wid;
        theitem.pi.height = len;
        var cx = theitem.pi.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, wid, len);

        addFlippedImage(theitem);

        if (theitem.hasOwnProperty("imageback")) {
            theitem.backim = new Image;
            theitem.backim.src = "img/" + theitem.imageback + ".png";
            theitem.backim.onload = (function (theitem) {
                return function () {
                    theitem.back = document.createElement('canvas');

                    var wid = theitem.wid;
                    var len = theitem.backim.height * (wid / theitem.backim.width);

                    theitem.back.width = theitem.pi.width;
                    theitem.back.height = theitem.pi.height;

                    var cx = theitem.back.getContext("2d");
                    cx.drawImage(theitem.backim, 0, 0, wid, len);

                    theitem.backr = document.createElement('canvas');
                    theitem.backr.width = wid;
                    theitem.backr.height = len;
                    var cx = theitem.backr.getContext("2d");
                    flipHorizontally(theitem.back, 0, 0, cx)

                    var cx = theitem.si.getContext("2d");
                    cx.drawImage(theitem.backim, 0, 0, theitem.si.width, theitem.si.height);
                    cx.drawImage(theitem.image, 0, 0, theitem.si.width, theitem.si.height);

                };
            })(theitem);
        }


        if (wentUp == columns - 1) {
            theitem.pos = [1220, (740 - (rows * 55)) + (55 * inc)];
            wentUp = 0;
        } else {
            theitem.pos = [1220 - (55 * (wentUp + 1)), (740 - (rows * 55)) + (55 * inc)];
            wentUp += 1;
            if (wentUp == columns - 1) {
                inc += 1;
            }
        }
        if (ind < chest.length - 1) {
            ind++;
            pChest(ind);
        } else {
            chest.rect = [1215 - ((columns - 1) * 55), -5 + 740 - (rows * 55), 60 + ((columns - 1) * 55), 5 + (rows * 55)]
            columns = 2//Helmet Columns
            col = 0;
            inc = 0;
            wentUp = columns - 1;
            first = true
            rows = Math.ceil(helmets.length / columns)

            pHelmet(0)

        }


    }
    theitem.image.src = "img/" + s + ".png";
    
}

pHelmet = function (ind) {
    theitem = helmets[ind];
    var s = theitem.image;
    if (typeof (s) !== "string") {return;}
    theitem.spec = "";
    theitem.image = new Image();

    if(theitem.hasOwnProperty("abilRecharge")){
        var abilImage=new Image();
        abilImage.src="img/"+s+"abil.png";
        abilImage.classList.add("ability-image");
        theitem.abilImage=abilImage;
    }

    theitem.image.onload = function () {
        //SMALLIM
        theitem.si = document.createElement('canvas');

        if (theitem.image.width > theitem.image.height) {
            wid = 50;

            len = theitem.image.height * (wid / theitem.image.width);
        } else {
            len = 50;
            wid = theitem.image.width * (len / theitem.image.height);
        }



        theitem.si.width = wid;
        theitem.si.height = len;

        cx = theitem.si.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, wid, len);

        //BIGIM
        theitem.pi = document.createElement('canvas');


        wid = theitem.wid;

        len = theitem.image.height * (wid / theitem.image.width);


        theitem.pi.width = wid;
        theitem.pi.height = len;

        cx = theitem.pi.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, wid, len);

        addFlippedImage(theitem);

        if (wentUp == columns - 1) {
            theitem.pos = [1220, (740 - (rows * 55)) + (55 * inc)];
            wentUp = 0;
        } else {
            theitem.pos = [1220 - (55 * (wentUp + 1)), (740 - (rows * 55)) + (55 * inc)];
            wentUp += 1;
            if (wentUp == columns - 1) {
                inc += 1;
            }
        }

        if (ind < helmets.length - 1) {
            ind++;
            pHelmet(ind);
        } else {
            ready = true;
            state = "login";

            fadeOutConnecting();
            helmets.rect = [1215 - ((columns - 1) * 55), -5 + 740 - (rows * 55), 60 + ((columns - 1) * 55), 5 + (rows * 55)];
            console.log("All loaded. (From " + addr + ")");
        }
    };
    
    theitem.image.src = "img/" + s + ".png";


};


var ready = false;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Baloo Paaji";
var inshop = "not";
quitf = function () {

    socket.emit('quit', rejoinc);
};
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
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
getAngle = function (p1, p2) {
    var angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
    return angleDeg - 180;
}
abs = Math.abs;
sin = Math.sin;
cos = Math.cos;

var TO_RADIANS = Math.PI / 180;
getRSize = function (x, y, rot) {
    rot = rot// * (Math.PI / 180);
    return [abs(x * cos(rot)) + abs(y * sin(rot)), abs(x * sin(rot)) + abs(y * cos(rot))
    ]
}







function LOADERdrawRotatedImage(image, x, y, angle, context, width, height, hflip) {

    width = width || image.width;
    height = height || image.height;
    hflip = hflip || false;
    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);
    if (hflip) {
        ctx.scale(-1, 1);
    }
    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(image, -(width / 2), -(height / 2), width, height);

    // and restore the co-ords to how they were when we began
    context.restore();
}
function flipHorizontally(img, x, y, ctx) {
    // move to x + img's width
    ctx.translate(x + img.width, y);

    // scaleX by -1; this "trick" flips horizontally
    ctx.scale(-1, 1);

    // draw the img
    // no need for x,y since we've already translated
    ctx.drawImage(img, 0, 0);

    // always clean up -- reset transformations to default
    ctx.setTransform(1, 0, 0, 1, 0, 0);
};

String.prototype.withoutSpaces = function () {
    return this.replace(/\s+/g, '');
}
 function arrRemove(array,element) {
    var index = array.indexOf(element);

    if (! ~index) {
        console.trace("Element not in array!");

        throw "Element not in array!";

    }
    array.splice(index, 1);
};
function flipVertically(img, x, y, ctx) {
    // move to x + img's width
    ctx.translate(x, y + img.height);

    // scaleX by -1; this "trick" flips horizontally
    ctx.scale(1, -1);

    // draw the img
    // no need for x,y since we've already translated
    ctx.drawImage(img, 0, 0);

    // always clean up -- reset transformations to default
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function intr(n) { return Math.round(n); };
function int(n) { return Math.floor(n); };

var toArray = function (obj) {
    var arr = [];
    for (o in obj) {
        if (obj.hasOwnProperty(o)) {
            arr.push(obj[o]);
        }
    }
    return arr;
};


function trimCanvas(context, thecanvas) {

    var w = thecanvas.width;
    var h = thecanvas.height;
    var pix = { x: [], y: [] },
        imageData = context.getImageData(0, 0, thecanvas.width, thecanvas.height),
        x, y, index;

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index + 3] > 0) {

                pix.x.push(x);
                pix.y.push(y);

            }
        }
    }
    pix.x.sort(function (a, b) { return a - b });
    pix.y.sort(function (a, b) { return a - b });
    var n = pix.x.length - 1;

    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];
    var cut = context.getImageData(pix.x[0], pix.y[0], w, h);

    thecanvas.width = w;
    thecanvas.height = h;
    context.putImageData(cut, 0, 0);



}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
if (localStorage.getItem("userID") === null) {
    var id=uuidv4();
    localStorage.setItem("userID",id);
}


  
socket = false;
function connect() {
    connectingTextElem.innerText="Connecting to server...";
    //document.getElementById('loading').opacity="1";
    state = "loading"
    rejoinc = false;
    addr = document.getElementById('server').value;
    //addr="ws://stikk-server-stikk-io.1d35.starter-us-east-1.openshiftapps.com/";
    //addr='http://173.22.1.95:8080';
    //addr='http://192.168.1.5:8080';
    helmets = undefined;
    boots = undefined;
    chest = undefined;
    weapons = undefined;
    ready = false;
    if (socket) {

        socket.disconnect(true);
        socket.destroy();

        socket = io(addr, {
            transports: [
                'websocket'
            ], 'forceNew': true
        })


    } else {

        socket = io(addr, {
            transports: [
                'websocket'
            ], 'forceNew': true
        })
    }
    socket.on('items', function (info) {
        if(info[4]!=clientVersion){
            if(confirm("Your website version is out of date, trying force reload. If you see this again, you can click no/cancel to try to play anyway.")){
                setTimeout(function(){window.location.href = window.location.href}, 200);
            }
            
        }
        connectingTextElem.innerText="Connected, loading items...";

        if (typeof helmets == "undefined") {
            helmetsD = info[0];
            chestD = info[1];
            bootsD = info[2];
            weaponsD = info[3];

            helmets = toArray(info[0]);
            chest = toArray(info[1]);
            boots = toArray(info[2]);
            weapons = toArray(info[3]);

            boots.sort(function (a, b) { return a.cost - b.cost; })
            chest.sort(function (a, b) { return a.cost - b.cost; })
            helmets.sort(function (a, b) { return a.cost - b.cost; })
            weapons.sort(function (a, b) { return a.cost - b.cost; })




            columns = 2//Weapon Columns
            col = 0;
            inc = 0;
            wentUp = columns - 1;
            first = true
            rows = Math.ceil(weapons.length / columns)
            pWeapon(0);

        }
    })
}

document.getElementById('server').addEventListener('change', connect);
window.addEventListener('unload', quitf);
connect();


var pp = [[27, -32], [27, -32], [28, -31], [28, -31], [29, -30], [30, -30], [30, -29], [31, -28], [31, -28], [32, -27], [32, -27], [32, -26], [33, -26], [33, -25], [34, -24], [34, -24], [35, -23], [35, -23], [35, -22], [36, -21], [36, -21], [37, -20], [37, -19], [37, -19], [38, -18], [38, -17], [38, -17], [39, -16], [39, -15], [39, -15], [39, -14], [40, -13], [40, -13], [40, -12], [40, -11], [40, -10], [41, -10], [41, -9], [41, -8], [41, -8], [41, -7], [41, -6], [42, -5], [42, -5], [42, -4], [42, -3], [42, -2], [42, -2], [42, -1], [42, 0], [42, 0], [42, 0], [42, 1], [42, 2], [42, 2], [42, 3], [42, 4], [42, 5], [42, 5], [41, 6], [41, 7], [41, 8], [41, 8], [41, 9], [41, 10], [40, 10], [40, 11], [40, 12], [40, 13], [40, 13], [39, 14], [39, 15], [39, 15], [39, 16], [38, 17], [38, 17], [38, 18], [37, 19], [37, 19], [37, 20], [36, 21], [36, 21], [35, 22], [35, 23], [35, 23], [34, 24], [34, 24], [33, 25], [33, 26], [32, 26], [32, 27], [32, 27], [31, 28], [31, 28], [30, 29], [30, 30], [29, 30], [28, 31], [28, 31], [27, 32], [27, 32], [26, -32]];

