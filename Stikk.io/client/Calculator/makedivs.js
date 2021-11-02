var template = '<label for="{{player}}-{{type}}-sim-equip">{{type}}</label><input class="sim-stat-input" value=0 id="{{player}}-{{type}}-sim-equip" type="text" onkeyup="saveValue(this)" /> <br>'
var addExistingTemplate = '<label for="{{player}}-{{type}}-sim-equip">{{type}}</label><input class="sim-stat-input" id="{{player}}-{{type}}-sim-equip" type="text" onkeyup="saveValue(this)" /> <br>'
var statButtonTemplate = '<button onclick=getCodeForItem(event) id="{{player}}-{{type}}-get-js">{{type}} code</button>'
var clearPlayerTemplate= '<button onclick=clearPlayer("{{player}}")>Reset {{player}} stats</button>'
var converterRegexType = /\{\{type\}\}/g;
var converterRegexPlayer = /\{\{player\}\}/g;
var statTypes = ["armor", "health", "damage", "armorp", "maxAmmo", "aspeed", "len", "range", "projSpeed", "speed", "boostSpeed", 'boosttime', "regen"];
var equipTypes = ["helmet", "chest", "boots", "weapon"];
var names = ["equip-A", "equip-B"];
function convertAll(string, stat, pName) {
    return string.replace(converterRegexType, stat).replace(converterRegexPlayer, pName);
}

for (var divName of names) {
    var elem = document.getElementById(divName);
    var pName = divName.replace("equip-", "")
    for (var stat of statTypes) {
        elem.innerHTML += convertAll(template, stat, pName);

    }
    elem.innerHTML += 'Or, this equipment: <br>'
    for (var stat of equipTypes) {
        elem.innerHTML += convertAll(statButtonTemplate, stat, pName);
        elem.innerHTML += convertAll(addExistingTemplate, stat, pName);
    }
    elem.innerHTML += convertAll(clearPlayerTemplate, "", pName);
    for (var stat of statTypes) {
        let inElem = document.getElementById(convertAll("{{player}}-{{type}}-sim-equip", stat, pName));
        getSavedValue(inElem);
    }
    for (var stat of equipTypes) {
        let inElem = document.getElementById(convertAll("{{player}}-{{type}}-sim-equip", stat, pName));
        getSavedValue(inElem, "");
    }

    let specialDefaults = ["-len-sim-equip", "-projSpeed-sim-equip", "-maxAmmo-sim-equip"];
    let defVal = ["90", "5", "5"];
    for (let i = 0; i < specialDefaults.length; i++) {
        let elem = document.getElementById(pName + specialDefaults[i])
        getSavedValue(elem, defVal[i]);
    }
}
//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e) {
    var id = e.id;  // get the sender's id to save it . 
    var val = e.value; // get the value. 
    localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

//get the saved value function - return the value of "v" from localStorage. 
function getSavedValue(e, def = "0") {
    let val;
    if (!localStorage.getItem(e.id)) {
        val = def;
    }else{
        val = localStorage.getItem(e.id);
    }
    
    e.value = val;
    
}
function clearPlayer(pName) {
    var key;
    for (var i = 0; i < localStorage.length; i++) { 
        key = localStorage.key(i); 
        if (key[0]==pName) { localStorage.removeItem(key); } 
    }
}

var inputFields = ["aspeed", "damage", "armorp", "health", "armor"];
for (let i = 0; i < inputFields.length; i++) {
    let elem = document.getElementById(inputFields[i])
    getSavedValue(elem, 0);
}
