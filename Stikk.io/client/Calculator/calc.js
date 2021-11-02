//d=damage,a=armor,s=aspeed,p=armorp,h=health,t=hittimes
//t=h / (d - (a - p)) * s
var varNames = { damage: "d", armor: "a", aspeed: "s", armorp: "p", health: "h", hittimes: "t" }
var formula = CQ("t = (h / ((d - (a - p)) * (s/10)))");
var statFormulas = {};
const baseValues = { health: 100, damage: 10, aspeed: 10, hittimes: 0, armorp: 0, armor: 0 }
var values = { health: 0, damage: 0, aspeed: 0, hittimes: 10, armorp: 0, armor: 0 }
var elems;
var specialSolvers = {//http://www.wolframalpha.com/input/?i=solve+t+%3D+(h+%2F+((d+-+(a+-+p))+*+(s%2F10)))+for+d
    armorp: function (vals) {
        return vals["armor"] - vals["damage"] + (10 * vals["health"]) / (vals["aspeed"] * vals["hittimes"])
    },
    armor: function (vals) {
        return vals['damage'] - (10 * vals['health']) / (vals['aspeed'] * vals['hittimes']) + vals['armorp']
    },
    damage:function(vals){
        return vals["armor"] + (10 *vals["health"])/(vals["aspeed"]* vals["hittimes"]) - vals["armorp"]
    }
}

elems = {
    health: document.getElementById("health"),
    damage: document.getElementById("damage"),
    armor: document.getElementById("armor"),
    aspeed: document.getElementById("aspeed"),
    armorp: document.getElementById("armorp"),
    hittimes: document.getElementById("hittimes"),
    truehittimes: document.getElementById("true-hittimes"),
}
for (stat in values) {
    
    var elem = elems[stat];
    setVal(elem.value, stat);
    
    
}
updateVals()

function countNaN(obj) {
    var i = 0;
    for (prop in obj) {
        if (isNaN(obj[prop])) { i += 1 }
    }
    return i;
}
function setVal(val, stat) {
    values[stat] = baseValues[stat] + parseFloat(val);
}
function setDomVal(val, stat) {
    elems[stat].value = val;
    saveValue(elems[stat]);
    setVal(val, stat);
}
function updateTrueHittimes() {
    elems.truehittimes.innerHTML = getSolvedStat("hittimes")
}
function updateVals() {
    var numNaN = countNaN(values)
    if (numNaN == 1) {
        var result = solve(values);
        var solution = Math.round(result[0]);
        var toSolve = result[1];
        elems[toSolve].value = solution;
        setVal(solution, toSolve);
        updateTrueHittimes()
    } else if (numNaN == 0) {//just check hittimes
        updateTrueHittimes()
    }
    else {
        alert("Please enter all but one value.")
    }
}
function damageAspeedSlider() {
    var perc = 1 - document.getElementById("damage-aspeed-slider").value / 100;//invert value and change to percentage
    percentBetweenStats("aspeed","damage",perc)
}
function damageArmorpSlider(){
    var perc = 1 - document.getElementById("damage-armorp-slider").value / 100;//invert value and change to percentage
    percentBetweenStats("armorp","damage",perc)
}
function armorHealthSlider() {
    var perc =  document.getElementById("armor-health-slider").value / 100;//change to percentage
    percentBetweenStats("health","armor",perc)
}

function percentBetweenStats(stat1,stat2,percent){//stat1 is the one that controls the other. Stat1 should be more precise, like health.
    //comments refer to percentBetweenStats("aspeed","damage")
    var perc=percent;
    var vals=copyVals();
    vals[stat2]=baseValues[stat2];
    var maxStat1 = getSolvedStat(stat1,vals);//if it was all aspeed, it would be this.
    var trueStat1=Math.round(maxStat1*perc);//   but, we have to reduce it so damage can be a factor
    setDomVal(trueStat1,stat1);

    var vals=copyVals();
    vals[stat1]=trueStat1+baseValues[stat1]//set the aspeed from above
    var trueStat2=Math.round(getSolvedStat(stat2,vals));// figure out the damage
    setDomVal(trueStat2,stat2);


    updateTrueHittimes();
}
function keypressed(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
        updateVals();
    }
}
function copyVals() {
    return Object.assign({}, values); //copy values so it does not change original
}
function getSolvedStat(stat,vals) {
    var valCopy = vals || copyVals();
    valCopy[stat] = NaN;
    return solve(valCopy)[0];
}


function solve(values) {
    equation = formula;
    var toSolve;
    for (stat in values) {
        if (!isNaN(values[stat])) {//if it is filled in
            var val = values[stat];
            var varName = varNames[stat];
            var replacement = {};
            replacement[varName] = val;
            equation = equation.sub(replacement)
        } else {// it is the unknown variable
            toSolve = stat;
            var varToSolve = varNames[toSolve];
        }
    }
    var solution;
    if (specialSolvers[toSolve]) {
        solution = specialSolvers[toSolve](values);
    }
    else {

        solution = equation.solve(varToSolve)[0].approx();

    }
    solution = solution - baseValues[toSolve];
    return [solution, toSolve];
}

function getCodeForItem(event){
    var split=event.target.id.split("-");
    var statName=split[1];
    var pName=split[0];
    var equipment=getEquipment();
    var item=equipment[pName][statName]
    for (stat of ["armor","health","damage","armorp","aspeed","range","speed","boostSpeed","boosttime","regen"]){
        if (item[stat]==0){
            delete item[stat]
        }
    }
    if(item.type!=="Ranged"){
        for (stat of ["maxAmmo","projSpeed"]){
            
            delete item[stat]
            
        }
    }
    var code="ITEMNAME:"+JSON.stringify(item,null,2).replace(/"(\w+)"\s*:/g,'$1:');
    document.getElementById("equipment-code").innerHTML=code;
    navigator.clipboard.writeText(code)
}