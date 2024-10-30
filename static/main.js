let focused = [];
let mouse = {}
let shifted = false;
let occured = 0;
let isDragging = false;
let grouped = false;

$(document).on('keyup keydown', function(e){shifted = e.shiftKey} );

$(".nav-icon").each(function (i) {
    $(this).mousedown(function () {
        isDragging = true;
        setTimeout(() => {
            if(!focused.includes(i)) {
                if(grouped) {
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
    if(grouped) {
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