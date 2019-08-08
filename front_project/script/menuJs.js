// document.ready VS windows.onload https://blog.miniasp.com/post/2010/07/24/jQuery-ready-vs-load-vs-window-onload-event
// 前者為dom樹完成載入(例img的scr是為載入完畢，但img這個tag已載入)就執行，後者為全部完成時再載入。
$(function () {
    //離開
    $("#exit").click(function () {
        window.close();
    });
    $("#exit").hover(() => {
        $("#exit").prop("src", "img/exit2.png");
    }, () => {
        $("#exit").prop("src", "img/exit.png");
    });
    //開始
    $("#start").click(function () {
        //取消攔截訊息
        window.document.body.onbeforeunload = null;
        location.href = "Main.html?" + hText + "&" + bText + "&" + tText + "&" + mode;
        return true;

    });
    //設定
    $("#option").click(function () {
        $("#box").css("top", "50%");

    });
    //全螢幕
    $("#full_or_window").click(function () {
        if ($("#full_or_window").prop("checked")) {
            document.getElementById("menu_div").requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    //返回設定
    $(".option_box_back").click(function () {
        $(".option_box").css("top", "-50%");
        event.cancelBubble = true;
    });
    //define
    $("#define").click(function () {
        $("#box_player").css("top", "50%");
    });
    //詢問是否離開
    window.onbeforeunload = () => {
        return "chrome can't change message";
    };
    var temp = [];
    $(document).keydown((e) => {
        e.preventDefault();
        temp[temp.length] = e.key.replace('Arrow', '').toLowerCase()
        console.log(temp.join(""));
        if (temp.join("").match(/upupdowndownleftrightleftrightbaba/)) {
            $("#title").prop("src", "img/Title_hard.png");
            mode = "true";
            console.log("Hardmode");
        }
    });

    let R = 255,
        G = 0,
        B = 0;
    var hText = `rgb(255,255,255)`,
        bText = `rgb(255,255,255)`,
        tText = `rgb(255,255,255)`,
        mode = "false";
    $("#box_player [type=range]").on("input", function () {
        if ($(this).val() <= 255) {
            G = parseInt($(this).val());
        } else if ($(this).val() <= 510 && $(this).val() > 255) {
            R = 255 - (parseInt($(this).val()) - 255);
            G = 255;
            B = 0;
        } else if ($(this).val() <= 765 && $(this).val() > 510) {
            R = 0;
            G = 255;
            B = (parseInt($(this).val()) - 510);
        } else if ($(this).val() <= 1020 && $(this).val() > 765) {
            R = 0;
            G = 255 - (parseInt($(this).val()) - 765);
            B = 255;
        } else if ($(this).val() <= 1275 && $(this).val() > 1020) {
            R = (parseInt($(this).val()) - 1020);
            G = 0;
            B = 255;
        } else if ($(this).val() <= 1530 && $(this).val() > 1275) {
            R = 255;
            G = 0;
            B = 255 - (parseInt($(this).val()) - 1275);
        }
        if ($(this).prop("id") == "sHead") {
            hText = `rgb(${R},${G},${B})`;
            $("#head_img").css("background-color", hText);
        }
        if ($(this).prop("id") == "sBody") {
            bText = `rgb(${R},${G},${B})`;
            $("#body_img").css("background-color", bText);
        }
        if ($(this).prop("id") == "sTail") {
            tText = `rgb(${R},${G},${B})`;
            $("#tail_img").css("background-color", tText);
        }
    });
    $("#box [type=range]").on("input", function () {
        if ($(this).prop("id") == "BGM")
            localStorage.setItem("BGM", parseInt($(this).val()) / 100);
        if ($(this).prop("id") == "SE")
            localStorage.setItem("SE", parseInt($(this).val()) / 100);
        console.log($(this).prop("id"))

    })
    function initial() {
        if (localStorage["BGM"]) {
            $("#BGM").prop("value", (localStorage["BGM"] * 100).toString());
        }
        if (localStorage["SE"]) {
            $("#SE").prop("value", (localStorage["SE"] * 100).toString());
        }
        $("#sHead").prop("value", 0);
        $("#sBody").prop("value", 0);
        $("#sTail").prop("value", 0);
    
    }
    initial();
});

