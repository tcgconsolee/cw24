var idbSupported = false;
document.addEventListener("DOMContentLoaded", function(){
    if("indexedDB" in window) {
        idbSupported = true;
    }
},false);var db;
function indexedDBOk() {
    return "indexedDB" in window;
}
document.addEventListener("DOMContentLoaded", function() {
    if(!indexedDBOk) return;
    var openRequest = indexedDB.open("db",1);
    openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
        if(!thisDB.objectStoreNames.contains("community")) {
            thisDB.createObjectStore("community");
        }
    }
    openRequest.onsuccess = function(e) {
        db = e.target.result;
        setInterval(() => {
            addData()
        }, 2000);
        restoreData()
    }
    openRequest.onerror = function(e) {
        console.log("err")
    }
},false);
function navCoordinates() {
    var array = [];
    $(".nav-icon").each(function() {
        array.push({left: $(this).css("left"), top: $(this).css("top"), transform: $(this).css("transform")})
    })
    return array;
}
function addData() {
    var transaction = db.transaction(["community"],"readwrite");
    var store = transaction.objectStore("community");
    var community = {community: document.getElementsByClassName("msgs")[0].innerHTML, nav: navCoordinates(), accepted: accepted, mission: $(".mission").html()}
    var request = store.put(community,1);
    request.onerror = function(e) {}
    request.onsuccess = function(e) {}
}
var accepted = false;
function restoreData(e) {
    var key = 1
    var transaction = db.transaction(["community"],"readonly");
    var store = transaction.objectStore("community");
    var request = store.get(Number(key));
    request.onsuccess = function(e) {
        var result = e.target.result;
        if(result.community){
            document.getElementsByClassName("msgs")[0].innerHTML = result.community;
        }
        if(result.nav) {
            $(".nav-icon").each(function(i) {
                $(this).css("left", result.nav[i].left)
                $(this).css("top", result.nav[i].top)
                $(this).css("transform", result.nav[i].transform)
            })
        }
        if(result.accepted) {
            accepted = result.accepted;
        }
        if(result.mission) {
            $(".mission").html(result.mission);
            $(".cancel-btn").click(function() {
                $(".missions-window").hide(500)
                $(".mission").empty();
                $(".mission").append("<p class = 'nothing'>Select a bounty first!</p>")
                accepted=false;
            })
        }
    }   
}