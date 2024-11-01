var focused = [];
let mouse = {}
let shifted = false;
var occured = 0;
let isDragging = false;
var grouped = false;

$(document).on('keyup keydown', function(e){shifted = e.shiftKey} );

$(".nav-icon").each(function (i) {
    $(this).mousedown(function () {
        isDragging = true;
        setTimeout(() => {
            if(!focused.includes(i)) {
                if(grouped && !shifted) {
                    $(".selected").each(function() { 
                        $(this).removeClass("selected")
                        if(focused.length > 1) {
                            $(this).css("left", Number(($(this).css("left")).split("p")[0]) + Number(($(".group").css("left")).split("p")[0]) - Number(($(".group").css("width")).split("p")[0])/2)
                            $(this).css("top", Number(($(this).css("top")).split("p")[0]) + Number(($(".group").css("top")).split("p")[0]) - Number(($(".group").css("height")).split("p")[0])/2)
                            $(".nav-icons").prepend($(this))
                        }
                        $(".nav-icons").prepend($(".group"))
                        occured = 0;
                        grouped = false;
                    })
                    focused = [];
                }
                focused.push(i);
            }            
            $(this).addClass("selected")
        }, 10);
        if(focused.length > 1) {
            grouped = true;
        }
    })
    $(document).mouseup(function() {
        isDragging = false;
    })
    $(document).mousemove(async function(e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        if(isDragging) {
            var distanceX = [];
            var distanceY=[];
            $(".selected").each(function(){
                if(focused.length > 1) {
                    if(occured < 1 ) {
                        distanceX.push(Number(($(this).css("left")).split("p")[0]))
                        distanceY.push(Number(($(this).css("top")).split("p")[0]))
                        $(this).css("transform", "translate(50%, 50%)")
                        $(".group").append($(this))
                        grouped = true;
                    }
                } else {
                    $(this).css("left", mouse.x)
                    $(this).css("top", mouse.y)
                    $(this).css("transform", "translate(-50%, -50%)")
                    grouped = false;
                }
            });
            if(occured < 1) {
                occured++
                if(distanceX.length < 1 || $(".group").children().length < focused.length) {
                    occured--
                }
                var maxDistance= {
                    x: Math.max(...distanceX) - Math.min(...distanceX) + 96,
                    y: Math.max(...distanceY) - Math.min(...distanceY) + 96
                }
                $(".selected").each(function() {
                    $(this).css("left", Number(($(this).css("left")).split("p")[0]) - Math.min(...distanceX))
                    $(this).css("top", Number(($(this).css("top")).split("p")[0]) - Math.min(...distanceY))
                })
                $(".group").css("width", maxDistance.x)
                $(".group").css("height", maxDistance.y)
            }
            
            $(".group").css("left", mouse.x)
            $(".group").css("top", mouse.y)
            $(".group").css("transform", "translate(-50%, -50%)")
        }
    })
    $(this).dblclick(function(){
        $(`.full-${$(this).attr('id')}-window`).show(500)
    })
})
$(".maximize").each(function(i){
    $(this).click(function(){
        (($(this).parent()).parent()).parent().animate({width: "100vw", height: "100vh", top: "50%"})
        $(this).css("display", "none");
        $(".restore").eq(i).css("display", "block")
    })
})
$(".restore").each(function(i){
    $(this).click(function(){
        (($(this).parent()).parent()).parent().animate({width: "97.5vw", height: "90vh", top: "47.5%"})
        $(this).css("display", "none");
        $(".maximize").eq(i).css("display", "block")
    })
})
$(".cross").each(function(){
    $(this).click(function(){
        (($(this).parent()).parent()).parent().hide(500)
    })
})
$(".close").click(function() {
    $(".close").parent().hide(500)
})
$(document).mousedown(function () {
    if (focused.length > 0 && !shifted && !grouped) {
        $(".selected").each(function() { 
            $(this).removeClass("selected")
            if(focused.length > 1) {
                $(this).css("left", Number(($(this).css("left")).split("p")[0]) + Number(($(".group").css("left")).split("p")[0]) - Number(($(".group").css("width")).split("p")[0])/2)
                $(this).css("top", Number(($(this).css("top")).split("p")[0]) + Number(($(".group").css("top")).split("p")[0]) - Number(($(".group").css("height")).split("p")[0])/2)
                $(".nav-icons").prepend($(this))
            }
            $(".nav-icons").prepend($(".group"))
            occured = 0;
            grouped = false;
        })
        focused = [];
    }
})
let rectCret = false;
let rect = undefined;
let rectStart = {};
let created = 0;
$(".back").mousedown(function() {
    rectCret = true;
    rectStart = {x: mouse.x, y: mouse.y}
    if(grouped && !shifted) {
        $(".selected").each(function() { 
            $(this).removeClass("selected")
            if(focused.length > 1) {
                $(this).css("left", Number(($(this).css("left")).split("p")[0]) + Number(($(".group").css("left")).split("p")[0]) - Number(($(".group").css("width")).split("p")[0])/2)
                $(this).css("top", Number(($(this).css("top")).split("p")[0]) + Number(($(".group").css("top")).split("p")[0]) - Number(($(".group").css("height")).split("p")[0])/2)
                $(".nav-icons").prepend($(this))
            }
            $(".nav-icons").prepend($(".group"))
            occured = 0;
            grouped = false;
        })
        focused = [];
    }
})
$(".back").on('mouseup click',function() {
    if(document.getElementsByClassName("rect")[0])
    {
        document.querySelectorAll(".nav-icon").forEach((elem, i) => {
            if(isTouching(document.getElementsByClassName("rect")[0], elem)) {
                isDragging = true;
                focused.push(i);
                elem.classList.add("selected")
                grouped = true;
            }
        })
    }
    if(rect) {
        rect.remove()
        rect = undefined;
        created = 0;
    }
    rectCret = false;
    rectStart = {};
})
function isTouching(elem1, elem2) {
    let rect1 = elem1.getBoundingClientRect()
    let rect2 = elem2.getBoundingClientRect()

    return !( rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom )
}
$(document).mousemove(function() {
    let offset={
        x: 0,
        y: 0
    };
    if(mouse.x-rectStart.x < 0 && mouse.y-rectStart.y<0) {
        offset = 
        {
            x: mouse.x-rectStart.x,
            y: mouse.y-rectStart.y
        }
    }
    else if(mouse.x-rectStart.x < 0 && mouse.y-rectStart.y>0) {
        offset = 
        {
            x: mouse.x-rectStart.x,
            y: 0
        }
    }
    else if(mouse.x-rectStart.x > 0 && mouse.y-rectStart.y<0) {
        offset = 
        {
            x: 0,
            y: mouse.y-rectStart.y
        }
    }
    else if(mouse.x-rectStart.x > 0 && mouse.y-rectStart.y>0) {
        offset = 
        {
            x: 0,
            y:0
        }
    }
    if(rectCret && created < 1) {
        created++;
        rect = $("<div class = 'rect'></div>")
        $(".back").append(rect);
    }
    $(".rect").css("width", Math.abs(mouse.x-rectStart.x));
    $(".rect").css("height", Math.abs(mouse.y-rectStart.y))
    $(".rect").css("left", rectStart.x + offset.x);
    $(".rect").css("top", rectStart.y + offset.y);
})

// messaging
function sendMessage(msg) {
    let code =
    `
    <div class="msg-container">
        <div class="msg" id = "s">
            <p>${msg}&lrm;</p>
        </div>
    </div>
    `
    $(".msgs").append($(code))
}
$(".msg-btn").keypress(e=> {
    if(e.which == 13) {
        if($(".msg-btn input").val() == "") return;
        sendMessage($(".msg-btn input").val())
        $(".msg-btn input").val("")
    }
})

// info
let shown;

$(".entities-grid div").each(function() {
    $(this).click(function() {
        if(shown) {
            shown.css("display", "none")
        }
        $(`.${($(this).attr('class')).split("-")[0]}`).css("display", "block")
        shown = $(`.${($(this).attr('class')).split("-")[0]}`);
    })
})

// search bounty

$(".search-btn").keypress(e=>{
    if(e.which == 13) {
        $(".tarname").each(function(i) {
            if($(this).html().toLowerCase().includes($(".search-btn input").val().toLowerCase())) {
                $(".card").eq(i).css("display", "block")
            } else {
                $(".card").eq(i).css("display", "none")
            }
        })
    }
})
$(".dropdown").change(function() {
    $(".card").each(function() {
        if($(this).attr('data-difficulty').includes($(".dropdown").val())) {
            $(this).css("display", "block")
        } else {
            $(this).css("display", "none")
        }
    })
})
function acceptMission() {
    let code = 
    `
            <img src = "../static/imgs/bigfoot.svg" class = "banner">
            <p style = "margin-block-start:.25em;font-size: 12px;">BIGFOOT</p>
            <div style = "display:grid;grid-template-columns:auto auto;margin-block-start:-0.75em;">
                <img src = "../static/imgs/coins.svg" style = "max-height: 1.5em;margin-inline-start:-.25em">
                <p style = "margin-block-start:0.5em;margin-inline-start:-.5em;font-size:10px;">1500</p>
            </div>
            <p style = "font-size:9px;margin-inline-start:2.5%;width:95%;">
                Bigfoot, also known as Sasquatch, is a legendary ape-like creature said to inhabit remote forests, particularly in the Pacific Northwest of North America. Descriptions often depict it as a towering figure covered in dark fur, with large footprints and a strong, musky odour.
            </p>
            <div class="cancel-btn" style = "font-size:10px;margin-block-start: 1em;">
                <p style="padding:0 0.5em;">CANCEL MISSION</p>
            </div>
    `
    $(".nothing").css("display", "none")
    $(".mission").prepend($(code))
    $(".cancel-btn").click(function() {
        $(".missions-window").hide(500)
        $(".mission").empty();
        $(".mission").append("<p class = 'nothing'>Select a bounty first!</p>")
        accepted=false;
    })
}
$(".accept-btn").each(function() {
    $(this).click(function() {
        if(window.location.href.includes("logged_in=True")) {
            if(accepted) {
                alert("You cannot accept more than one bounty at a time!")
                return;
            }
            accepted= true;
            $(".missions-window").show(500)
            acceptMission()
        } else {
            alert("You must login first before accepting a bounty!")
        }
    })
})
$(".ongoing-btn").click(function() {
    $(".missions-window").show(500);
})
$(".dispatch-btn").click(function() {
    $(".dispatch-btn").css("background", "#ADADAD")
    $(".dispatch-btn p").html("DISPATCHED")
    $(".dispatch-btn").css("pointer-events", "none")
    setTimeout(() => {
        alert("The team has been dispatched to your current location! Arriving at the soonest to rescue you from danger!")
    }, 100);
})