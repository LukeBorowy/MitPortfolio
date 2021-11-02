var mapw = 7500;
var maph = 4500;
var xx = 0;
var yy = 0;
var isMobile = 'ontouchstart' in window;
var mip = [];
var canv = document.getElementById("canvas");
var ctx = canv.getContext("2d");
var winnerElem=document.getElementById("sim-winner");
var pauseElem=document.getElementById("sim-pause");
var leaderboard = document.getElementById("leaderboard");
var ammoMaxElem=document.getElementById("ammo-max");
var ammoAmountElem=document.getElementById("ammo-amount");
var startWithElem=document.getElementById("startwith");
var readyAmmoElem=document.getElementById("ready-ammo");
var nameElem=document.getElementById("name");
var boostBar = document.getElementById("boost-bar");
var reloadImage = document.getElementById("reload-image");
var ammoBoxElem = document.getElementById("ammo-box");
var ammoImgElem = document.getElementById("ammo-image"); 
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
pWeapon = function (theitem) {
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
            theitem.ammoimg.onload = (function (it) {
                return function () {
                    it.ammo = document.createElement('canvas');
                    var len = it.ammolen;
                    var wid = it.ammoimg.width * (len / it.ammoimg.height);

                    it.ammo.width = wid;
                    it.ammo.height = len;

                    var cx = it.ammo.getContext("2d");
                    cx.drawImage(it.ammoimg, 0, 0, wid, len);
                };
            })(theitem);
            theitem.ammoimg.src = "img/" + theitem.image.src.split('/img/')[1].slice(0, -4) + "ammo.png";

            theitem.reloadImg = new Image;
            theitem.reloadImg.onload = (function (theitem) {
                return function () {
                    
                    
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
            })(theitem);
            theitem.reloadImg.src = "img/" + theitem.image.src.split('/img/')[1].slice(0, -4) + "reloading.png";


        }

        //document.getElementById("starts").appendChild(theitem.pi);

        theitem.ri = document.createElement('canvas');
        theitem.ri.width = theitem.pi.width;
        theitem.ri.height = theitem.pi.height;
        cx = theitem.ri.getContext("2d");
        flipHorizontally(theitem.pi, 0, 0, cx)
        
    }
    
    theitem.image.src = "img/" + s + ".png";
    


}
pBoot = function(theitem) {
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

    }
    
    theitem.image.src = "img/" + s + ".png";
    


}
pChest = function(theitem) {
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

        theitem.li = document.createElement('canvas');
        theitem.li.width = theitem.pi.width;
        theitem.li.height = theitem.pi.height;
        var cx = theitem.li.getContext("2d");
        flipHorizontally(theitem.pi, 0, 0, cx)

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

                    theitem.backl = document.createElement('canvas');
                    theitem.backl.width = wid;
                    theitem.backl.height = len;
                    var cx = theitem.backl.getContext("2d");
                    flipHorizontally(theitem.back, 0, 0, cx)

                    var cx = theitem.si.getContext("2d");
                    cx.drawImage(theitem.backim, 0, 0, theitem.si.width, theitem.si.height);
                    cx.drawImage(theitem.image, 0, 0, theitem.si.width, theitem.si.height);

                };
            })(theitem);
        }
        theitem.pi.width = wid;
        theitem.pi.height = len;
        var cx = theitem.pi.getContext("2d");
        cx.drawImage(theitem.image, 0, 0, wid, len);

        theitem.ri = document.createElement('canvas');
        theitem.ri.width = theitem.pi.width;
        theitem.ri.height = theitem.pi.height;
        var cx = theitem.ri.getContext("2d");
        flipHorizontally(theitem.pi, 0, 0, cx)

    }
    theitem.image.src = "img/" + s + ".png";
    
}
pHelmet = function(theitem) {
    var s = theitem.image;
    if (typeof (s) !== "string") {return}
    theitem.spec = "";
    theitem.image = new Image;
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

        theitem.ri = document.createElement('canvas');
        theitem.ri.width = theitem.pi.width;
        theitem.ri.height = theitem.pi.height;
        var cx = theitem.ri.getContext("2d");
        flipHorizontally(theitem.pi, 0, 0, cx)
    }
    
    theitem.image.src = "img/" + s + ".png";


}


var ready = false;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "30px Baloo Paaji";
var inshop = "not";
quitf = function () {

    socket.emit('quit', rejoinc);
}
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
Array.prototype.remove = function (element) {
    var index = this.indexOf(element);

    if (! ~index) {
        console.trace("Element not in array!");

        throw "Element not in array!";

    }
    this.splice(index, 1);
};
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



var pp = [[27, -32], [27, -32], [28, -31], [28, -31], [29, -30], [30, -30], [30, -29], [31, -28], [31, -28], [32, -27], [32, -27], [32, -26], [33, -26], [33, -25], [34, -24], [34, -24], [35, -23], [35, -23], [35, -22], [36, -21], [36, -21], [37, -20], [37, -19], [37, -19], [38, -18], [38, -17], [38, -17], [39, -16], [39, -15], [39, -15], [39, -14], [40, -13], [40, -13], [40, -12], [40, -11], [40, -10], [41, -10], [41, -9], [41, -8], [41, -8], [41, -7], [41, -6], [42, -5], [42, -5], [42, -4], [42, -3], [42, -2], [42, -2], [42, -1], [42, 0], [42, 0], [42, 0], [42, 1], [42, 2], [42, 2], [42, 3], [42, 4], [42, 5], [42, 5], [41, 6], [41, 7], [41, 8], [41, 8], [41, 9], [41, 10], [40, 10], [40, 11], [40, 12], [40, 13], [40, 13], [39, 14], [39, 15], [39, 15], [39, 16], [38, 17], [38, 17], [38, 18], [37, 19], [37, 19], [37, 20], [36, 21], [36, 21], [35, 22], [35, 23], [35, 23], [34, 24], [34, 24], [33, 25], [33, 26], [32, 26], [32, 27], [32, 27], [31, 28], [31, 28], [30, 29], [30, 30], [29, 30], [28, 31], [28, 31], [27, 32], [27, 32], [26, -32]];

