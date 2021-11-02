var simSocket=function(){
    callbacks={};
    function on(type, func){
        callbacks[type]=func;
    }
    function emit(type, info){
        if(callbacks[type])callbacks[type](JSON.parse(JSON.stringify(info)));
    }
    return {"on":on, "emit":emit};
}();
var dummySocket=function(){
    callbacks={};
    function on(type, func){
        
    }
    function emit(type, info){
        
    }
    return {"on":on, "emit":emit};
}();
socketServer=simSocket;
socket=simSocket;
