// ANIMATIONS

let active = ".home"

$(".to-proj").click(function () {
    if (active === ".projects") return;
    $(active).slideUp(1000)
    $(".projects").show("slide", { direction: "down" }, 1000)
    active = ".projects"
})
$(".to-events").click(function () {
    if (active === ".events") return;
    $(active).slideUp(1000)
    $(".events").show("slide", { direction: "down" }, 1000)
    active = ".events"
})
$(".to-home").click(function () {
    if (active === ".home") return;
    $(active).slideUp(1000)
    $(".home").show("slide", { direction: "down" }, 1000)
    active = ".home"
})
$(".to-chat").click(function () {
    if (active === ".chat") return;
    $(active).slideUp(1000)
    $(".chat").show("slide", { direction: "down" }, 1000)
    active = ".chat"
})

// OTHER
$(".dropdown").click(function() {
    $(".pr-tags").each(function(i) {
        if($(".dropdown").find(":selected").text().toLowerCase()=="all") {
            $(".project").eq(i).css("display", "block");
        } else {
            if($(this).html().toLowerCase().includes($(".dropdown").find(":selected").text().toLowerCase())) {
                $(".project").eq(i).css("display", "block");
            } else {
                $(".project").eq(i).css("display", "none");
            }
        }
    })
})
$(".search-bar").click(function () {
    if (active === ".events") return;
    $(active).slideUp(1000)
    $(".events").show("slide", { direction: "down" }, 1000)
    active = ".events"
    $(".events").scroll(1200)
})
$(".evt-ctgory").each(function (i) {
    $(this).click(function () {
        $("#events2").val("")
        $(".evt-selected").css("display", "block")
        $(".evt-selected").css("left", (0.5 + (9.7 * i)) + "em")
        $(".event").each(function() {
            console.log($(".evt-ctgory p").eq(i).html().toLowerCase())
            console.log($(this).attr("data-type"))
            if($(".evt-ctgory p").eq(i).html().toLowerCase()==$(this).attr("data-type")) {
                $(this).css("display", "block")
            } else {
                $(this).css("display", "none")
            }
        })
        
    })
})
function sendMessage(msg) {
    let code =
        `
    <div class="msg" id = "s">
        <div class="msg-pic" id = "s-pic"></div>
        <div class="msg-content" id = "s-msg">
            <p>${msg}</p>
        </div>
    </div>
    `
    $(".msg-container").append(code)
}
$(".m-bar").keypress(function (e) {
    if (e.which == 13) {
        sendMessage($("#m").val())
        $("#m").val("")
    }
})
$("#groups").keypress(function (e) {
    if (e.which == 13) {
        $(".grp-name").each(function () {
            if (!($(this).html().toLowerCase().includes($("#groups2").val().toLowerCase()))) {
                $(this).parent().css("display", "none")
            } else {
                $(this).parent().css("display", "grid")
            }
        })
    }
})
$("#projects1").keypress(function (e) {
    if (e.which == 13) {
        $(".pr-name").each(function () {
            if (!($(this).html().toLowerCase().includes($("#projects2").val().toLowerCase()))) {
                $(this).parent().css("display", "none")
            } else {
                $(this).parent().css("display", "grid")
            }
        })
    }
})
$("#events1").keypress(function (e) {
    if (e.which == 13) {
        $(".evt-selected").css("display", "none")
        $(".evt-name").each(function () {
            if (!($(this).html().toLowerCase().includes($("#events2").val().toLowerCase()))) {
                $(this).parent().css("display", "none")
            } else {
                $(this).parent().css("display", "block")
            }
        })
    }
})
$(".notif-del").click(function () {
    $(".notification").each(function () {
        $(this).remove()
    })
})

let active_notifs = false;
$(".inactive").each(function (i) {
    $(this).click(function () {
        setTimeout(() => {
            active_notifs = true;
            $(this).css("display", "none")
            $(".active").eq(i).css("display", "block")
            $(".notifications").css("display", "block")
        }, 100);
    })
})

$(".active").each(function (i) {
    $(this).click(function () {
        active_notifs = false;
        $(this).css("display", "none")
        $(".inactive").eq(i).css("display", "block")
        $(".notifications").css("display", "none")
    })
})

$(document).click(function () {
    if (active_notifs) {
        active_notifs = false;
        $(".active").each(function (i) {
            $(this).css("display", "none")
            $(".inactive").eq(i).css("display", "block")
        })
        $(".notifications").css("display", "none")
    }
})
let active_heart = false;
$(".nav-heart").each(function () {
    $(this).click(function () {
        if (active_heart) {
            active_heart = false;
            $(".watchlist").css("display", "none")
        } else {
            setTimeout(() => {
                active_heart = true;
                $(".watchlist").css("display", "block")
            }, 100);
        }
    })
})

$(document).click(function () {
    if (active_heart) {
        active_heart = false;
        $(".watchlist").css("display", "none")
    }
})
function addToWatchList(name, type) {
    let project_generator =
        `
<div class="watch-project">
    <div class="watch-projpic"></div>
    <div class="watch-projname">${name}</div>
</div>
`
    let event_generator =
        `
<div class="watch-event">
    <div class="watch-evepic"></div>
    <div class="watch-evename">${name}</div>
</div>
`
    if (type === "project") $(".watch-proj").append(project_generator);
    if (type === "event") $(".watch-eve").append(event_generator);
}
$(".hollow").each(function (i) {
    $(this).click(function () {
        $(this).css("display", "none")
        $(".filled").eq(i).css("display", "block")
        addToWatchList($('.pr-name').eq(i).html(), "project")
    })
})
$(".roundedh").click(function () {
    addToWatchList($('.hevt-name').html(), "event")
})
$(".rounded").each(function (i) {
    $(this).click(function () {
        addToWatchList($('.evt-name').eq(i).html(), "event")
    })
})