var MEDIA_URL = "";
var MEDIA_SESSION = null;
var INTERVAL_ID = -1;
var SEEKING = false;

/**
 * retrieve a media status update and note it's position
 */
function updateSeekPosition() {
    if (!MEDIA_SESSION) return false;

    var request = new chrome.cast.media.VolumeRequest();
    request.volume = MEDIA_SESSION.volume;

    MEDIA_SESSION.setVolume(
        request,
        function() {},
        function() {}
    );

    if (!SEEKING )
        $("#seek").val(MEDIA_SESSION.currentTime);

    var timeleft = Math.floor(MEDIA_SESSION.media.duration - MEDIA_SESSION.currentTime);
    var hours = ~~(timeleft / 3600);
    var minutes = ~~((timeleft % 3600) / 60);
    var seconds = timeleft % 60;
    var timeleft_str = "-";

    timeleft_str += ((hours < 10) ? "0" : "") + hours + ":";
    timeleft_str += ((minutes < 10) ? "0" : "") + minutes + ":";
    timeleft_str += ((seconds < 10) ? "0" : "") + seconds;

    $("#timeleft").html(timeleft_str);
}

/**
 * called when the seek slider is in use
 */
function updateSeek() {
    SEEKING = true;
}

/**
 * seek the media to a specific place
 */
function seekVideo() {
    var seekTo = $("#seek").val();

    SEEKING = false;

    var request = new chrome.cast.media.SeekRequest();

    request.currentTime = seekTo;

    MEDIA_SESSION.seek(
        request,
        function() {},
        function() {}
    );
}

/**
 * rewind through the media
 */
function rewind(sec) {
    if (!MEDIA_SESSION) return false;

    var request = new chrome.cast.media.SeekRequest();

    request.currentTime = MEDIA_SESSION.currentTime - sec;

    if (request.currentTime < 0)
        request.currentTime = 0;

    MEDIA_SESSION.seek(
        request,
        function() {},
        function() {}
    );
}

/**
 * fast-forward through the media
 */
function forward(sec) {
    if (!MEDIA_SESSION) return false;

    var request = new chrome.cast.media.SeekRequest();
    request.currentTime = MEDIA_SESSION.currentTime + sec;

    if (request.currentTime > MEDIA_SESSION.media.duration)
        request.currentTime = MEDIA_SESSION.media.duration;

    MEDIA_SESSION.seek(
        request,
        function() {},
        function() {}
    );
}

/**
 * callback for media status event
 */
function onMediaStatusUpdate(isAlive) {
    if (MEDIA_SESSION.playerState === "IDLE") {
        window.clearInterval(INTERVAL_ID);
        INTERVAL_ID = -1;
        step2Activate();
    }
}

/**
 * callback on success for loading media
 */
function onMediaDiscovered(how, mediaSession) {
    MEDIA_SESSION = mediaSession;
    MEDIA_SESSION.addUpdateListener(onMediaStatusUpdate);
    step2Complete();
}

/**
 * callback on media loading error
 */
function onMediaError(e) {
    console.log("Unable to load media '" + MEDIA_URL + "'");
    step2Error();
}

/**
 * callback on success for media commands
 */
function mediaCommandSuccessCallback(info) {
    // TODO check into MEDIA_SESSION.playerState

    if (info.indexOf("stopped") !== -1) {
        step2Activate();
    } else if (info.indexOf("play") !== -1) {
        // simulate pressing "PLAY"
        $("#playpause img").attr("src", "images/pause.png");
        $("#playpause").data("status", "playing");
    } else if (info.indexOf("pause") !== -1) {
        // simulate pressing "PAUSE"
        $("#playpause img").attr("src", "images/play.png");
        $("playpause").data("status", "paused");
    }
}

/**
 * load media
 */
function loadMedia() {
    if (!SESSION) {
        step1Error();
        return false;
    }

    if ($("input[name=url_radio]:checked").val() === "generic_url")
        MEDIA_URL = $("#step_2 #media_select").val();
    else if ($("input[name=url_radio]:checked").val() === "custom_url")
        MEDIA_URL = $("#custom_url").val();
    
    if (MEDIA_URL === "") {
        step2Error();
        return false;
    }

    $("#step_2 .loader").show();

    var mediaInfo = new chrome.cast.media.MediaInfo(MEDIA_URL);
    mediaInfo.contentType = "video/mp4";
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    request.currentTime = 0;

    var payload = {
        "title: " : MEDIA_URL,
        "thumb: " : "",
    };

    var json = {"payload": payload};

    request.customData = json;

    if (INTERVAL_ID === -1) {
        INTERVAL_ID = window.setInterval(updateSeekPosition, 1000);
    }

    SESSION.loadMedia(request, onMediaDiscovered.bind(this, "loadMedia"), onMediaError);
}

/**
 * play media
 */
function playMedia() {
    if (!MEDIA_SESSION) {
        return false;
    }

    if (MEDIA_SESSION.playerState === "PAUSED") {
        MEDIA_SESSION.play(
            null,
            mediaCommandSuccessCallback.bind(this, "play started for " + MEDIA_SESSION.sessionId),
            onInitError
        );
    } else if (MEDIA_SESSION.playerState === "PLAYING") {
        MEDIA_SESSION.pause(
            null,
            mediaCommandSuccessCallback.bind(this, "pause started for " + MEDIA_SESSION.sessionId),
            onInitError
        );
    }
}

/**
 * stop media
 */
function stopMedia() {
    if (!MEDIA_SESSION) {
        return false;
    }

    var result = window.confirm("Are you sure you wish to stop this video?");

    if (!result) return false;

    MEDIA_SESSION.stop(
        null,
        mediaCommandSuccessCallback.bind(this, "stopped " + MEDIA_SESSION.sessionId),
        onInitError
    );
}