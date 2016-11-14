
var setting = {
    type: "POST",
    url:"http://www.douban.com/j/app/login",
    dataType: "json",
    data: {
        "email": "a869115421@163.com",
        "password": "841576adgj",
        "app_name": "radio_desktop_win",
        "version": "100"
    },
    success: function(data, textStatus) {
        console.log("textStatus", textStatus);
        console.log("data", data);
    },
    headers: {
     "Content-Type": "application/x-www-form-urlenconded",
     "Access-Control-Allow-Origin":"http://www.douban.com",
     "Access-Control-Allow-Headers":"X-Requested-With"
     }
};

$.ajax(setting);




var audio = $("#audio-player")[0];
var musiclist = [ 'A Change Is Gonna Come.mp3',
    'About a Girl.mp3',
    'Alice.mp3',
    'All Along the Watchtower.mp3',
    'Alleine Zu Zweit.mp3' ];
var listLength = musiclist.length;
var currentIndex = 0;
var initialVolume = 0.5;


function __main() {
    initialize();
    bindEventClick();
    bindEventVolume();
    bindEventProgress();
}
__main();


function initialize(currentIndex = 0) {
    var currentSrc = `./music/${musiclist[currentIndex]}`;
    // console.log("initialVolume", initialVolume);
    audio.volume = initialVolume;
    audio.src = currentSrc;

    // audio.play();
}

function bindEventClick() {
    // play
    $(".vc-control-play").on("click", function(event) {
        console.log("play");
        audio.play();

        // 按键样式
        $(".vc-control-play").addClass("vc-control-active");
        $(".vc-control-pause").removeClass("vc-control-active");

        // 轮子转动
        $(".vc-tape-wheel").addClass("rotate");

    });

    // pause
    $(".vc-control-pause").on("click", function() {
        audio.pause();

        // 按键样式
        $(".vc-control-pause").addClass("vc-control-active");
        $(".vc-control-play").removeClass("vc-control-active");

        // 轮子停止转动
        $(".vc-tape-wheel").removeClass("rotate");
    });

    // next
    $(".vc-control-next").on("click", function(event) {
        currentIndex = (++currentIndex) % listLength;
        initialize(currentIndex);

        $(".vc-control-pause").removeClass("vc-control-active");
        $(".vc-control-play").addClass("vc-control-active");

        audio.play();

        // 轮子转动
        $(".vc-tape-wheel").addClass("rotate");
    });

    // prev
    $(".vc-control-prev").on("click", function(event) {
        currentIndex = (--currentIndex + listLength) % listLength;
        initialize(currentIndex);

        $(".vc-control-pause").removeClass("vc-control-active");
        $(".vc-control-play").addClass("vc-control-active");

        audio.play();

        // 轮子转动
        $(".vc-tape-wheel").addClass("rotate");
    });
    
    

    // mode
    $(".vc-control-mode").click( function(event) {
            $(event.target).toggleClass("repeatPlay");
            $(event.target).toggleClass("listPlay");
    });

/*    // volume
    $(".audio-range-volume").on("mousedown", function(event) {
        var target = $(event.target);
        var volume = target.prop("value")
        audio.volume = volume;
    });

    $(".audio-range-duration").on("mousedown", function(event) {
        var target = $(event.target);
        var duration = audio.duration;
        var currentValue = Math.floor(target.prop("value") * duration);
        audio.currentTime = currentValue;
        console.log("audio currentTime", audio.currentTime);
    });
*/
}

function bindEventVolume() {

        var knob = $(".knob");
        var knobTop = knob.find(".top");

        // 拖动起始角度
        var startDeg = -1;
        // 当前角度
        var currentDeg = 0;

        // 拖动前knob的角度
        var rotation = 0;

        var lastDeg = 0;

        var snap = 10;

        var initialDeg = 359 * initialVolume;

        // 初始位置
        currentDeg = initialDeg;
        lastDeg = initialDeg;
        rotation = initialDeg;

        // 初始化knob
        knobTop.css("transform", `rotate(${currentDeg}deg)`);

        knob.on("mousedown", function(event) {
            event.preventDefault();

            // knob 的文档坐标
            var offset = knob.offset();
            var center = {
                y: offset.top + knob.height() / 2,
                x: offset.left + knob.width() /2,
            };

            var deltaX;
            var deltaY;
            var deg;
            var tmp;
            var rad2deg = 180 / Math.PI;

            knob.on("mousemove", function(event) {

                // 变化
                deltaX = center.x - event.pageX;
                deltaY = center.y - event.pageY;
                deg = Math.atan2(deltaY, deltaX) * rad2deg;
                // 确保是正值
                if(deg < 0) {
                    deg = 360 + deg;
                }
                console.log("deg", deg);

                // 拖动的起始角度
                if(startDeg  === -1) {
                    startDeg = deg;
                }

                // knob应在当前角度
                tmp = Math.floor( (deg - startDeg) + rotation);
                console.log("tmp", tmp);

                if(tmp < 0){
                    tmp = 360 + tmp;
                } else if (tmp > 359){
                    tmp = tmp % 360;
                }

                if(tmp < snap) {
                    tmp = 0;
                }

                if(Math.abs(tmp - lastDeg) > 180) {
                    return false;
                }


                currentDeg = tmp;
                lastDeg = tmp;

                knobTop.css("transform", `rotate(${currentDeg}deg)`);
                audio.volume = currentDeg / 360;
            });

            $(document).on("mouseup", function() {
                knob.off("mousemove");
                $(document).off("mousemove");

                rotation = currentDeg;
                startDeg = -1;
            });
        });
    }

function bindEventProgress() {
    $("#audio-player").on("timeupdate", function(event) {
        var duration = audio.duration;
        var currTime = audio.currentTime;
        var percentage = currTime / duration;
        $(".vc-tape-wheel-left").css("box-shadow", `0 0 0 ${70 * (1 - percentage)}px #000`);
        $(".vc-tape-wheel-right").css("box-shadow", `0 0 0 ${70 * percentage}px #000`);
    });
}



