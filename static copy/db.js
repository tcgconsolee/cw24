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
function cluesnew() {
    var array1 = [];
    $(".new1").each(function() {
        array1.push(`<div class = "new1 clues-window" id = "${$(this).attr('id')}">${$(this).html()}</div>`)
    })
    return {page:array1, folders: $(".cases").html()};
}
function addData() {
    var transaction = db.transaction(["community"],"readwrite");
    var store = transaction.objectStore("community");
    var community = {community: document.getElementsByClassName("msgs")[0].innerHTML, nav: navCoordinates(), accepted: accepted, mission: $(".mission").html(), new: cluesnew()}
    var request = store.put(community,1);
    request.onerror = function(e) {}
    request.onsuccess = function(e) {}
}
var accepted = false;
var created2=false;
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
        if(result.new) {
            if(result.new.page) {
                result.new.page.forEach(a => {
                    $(document.body).append($(a));
                    $(".close").click(function() {
                        $(".close").parent().hide(500)
                    })
                });
            }
            if(result.new.folders) {
                $(".cases").html(result.new.folders)
                $(".folder").each(function(i){
                    $(this).click(function() {
                        $(`#${replaceSpaces($(".title").eq(i).html())}`).show(500);
                        $(`#${replaceSpaces($(".title").eq(i).html())} .clues-partition p`).html(`CLUES - ${$(".title").eq(i).html()}`)
                    })
                })
                $(".upload-create-btn").off('click')
                $(".upload-create-btn").click(function() {
                    if($(".upload-input").val() == "") {
                        alert("You cannot have a case with a blank name!")
                        return;
                    }
                    $(".title").each(function() {
                        if($(".upload-input").val() == $(this).html()) {
                            alert("A case with this name already exists! Select a new name!")
                            created2=true;
                        }
                    })
                    if(created2) {
                        created2=false;
                        return;
                    }
                    createNewCase($(".upload-input").val())
                    createNewCluePage($(".upload-input").val(), $(".upload-quote").val(), $(".upload-imgs").html())
                    $(".upload-window").hide(500);
                })
            }
        }
    }   
}