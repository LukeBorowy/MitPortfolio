// author: Willie Lawrence
// contact: cptx032 arroba gmail dot com
// based in https://github.com/jeromeetienne/virtualjoystick.js/blob/master/virtualjoystick.js
var JOYSTICK_DIV = null;

function __init_joystick_div() {
    JOYSTICK_DIV = document.createElement('div');
    var div_style = JOYSTICK_DIV.style;

    div_style.position = 'absolute';
    div_style.x="5px";
    div_style.x="50%";
    document.getElementById("gameStuff").appendChild(JOYSTICK_DIV);
}
var JoyStick = function (attrs) {
    this.radius = attrs.radius || 50;
    this.inner_radius = attrs.inner_radius || this.radius / 2;
    this.x = attrs.x || 0;
    this.y = attrs.y || 0;
    this.mouse_support = attrs.mouse_support || true;

    if (attrs.visible === undefined) {
        attrs.visible = true;
    }

    if (attrs.visible) {
        this.__create_fullscreen_div();
    }
};



JoyStick.prototype.__create_fullscreen_div = function () {
    if (JOYSTICK_DIV === null) {
        __init_joystick_div();
    }
    this.div = JOYSTICK_DIV;
    ///////////////////////////////////////////
    this.base = document.createElement('span');
    div_style = this.base.style;
    div_style.width = this.radius * 2 + 'px';
    div_style.height = this.radius * 2 + 'px';
    div_style.position = 'absolute';
    div_style.top = this.y - this.radius + 'px';
    div_style.left = this.x - this.radius + 'px';
    div_style.borderRadius = '50%';
    div_style.borderColor = 'rgba(0,0,0,0.75)';
    div_style.borderWidth = '1px';
    div_style.borderStyle = 'solid';
    this.div.appendChild(this.base);
    ///////////////////////////////////////////
    this.control = document.createElement('span');
    div_style = this.control.style;
    div_style.width = this.inner_radius * 2 + 'px';
    div_style.height = this.inner_radius * 2 + 'px';
    div_style.position = 'absolute';
    div_style.top = this.y - this.inner_radius + 'px';
    div_style.left = this.x - this.inner_radius + 'px';
    div_style.borderRadius = '50%';
    div_style.backgroundColor = 'rgba(0,0,0,0.5)';
    
    this.div.appendChild(this.control);
    ///////////////////////////////////////////
    var self = this;
    this.x=0;
    this.y=0;
    this.knobY=0;
    this.knobX=0;
};
JoyStick.prototype.setPos = function (x,y) {
    
    this.x=x;
    this.y=y;
    this.control.style.top = this.y - this.inner_radius + 'px';
    this.control.style.left = this.x - this.inner_radius + 'px';
    this.base.style.top = this.y - this.radius + 'px';
    this.base.style.left = this.x - this.radius + 'px';
};
JoyStick.prototype.setKnobPos = function (x,y) {
   
    this.knobX=x;
    this.knobY=y;
    this.control.style.top = this.knobY - this.inner_radius + 'px';
    this.control.style.left = this.knobX - this.inner_radius + 'px';
    
};
JoyStick.prototype.getKnobAngle = function () {
    
    return getAngle([this.knobX, this.knobY], [this.x,this.y])
    
};
JoyStick.prototype.getKnobDistance = function () {
    
    return Math.hypot(this.knobX - this.x, this.knobY - this.y)
    
};

JoyStick.prototype.setVisible = function (visible) {
    
    this.div.style.display=visible ? "block":"none";
    
};

