var TIMEOUT = 10;
var SESSION = null;

/**
 * initialization success callback
 */
function onInitSuccess() {
    if (!SESSION)
        step1Activate();
}

/**
 * initialization failure callback
 */
function onInitError() {
    if (!SESSION)
        step1Error();
}

/**
 * generic success callback
 */
function onSuccess(message) {
    console.log(message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
    step1Activate();
}

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
    if (e !== "available") {
        console.log("Unable to initialize receiver!");
    }
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
    SESSION = e;

    step1Complete();

    if (SESSION.media.length != 0) {
        onMediaDiscovered("onRequestSessionSuccess_", SESSION.media[0]);
    }

    onMediaDiscovered.bind(this, "addMediaListener");
    SESSION.addUpdateListener(sessionUpdateListener.bind(this));
}

/**
 * session upate listener
 */
function sessionUpdateListener(isAlive) {
    var message = isAlive ? "Session updated" : "Session removed";
    message += ": " + SESSION.sessionId;

    console.log(message);
    console.log(isAlive);

    if (!isAlive) {
        SESSION = null;
        step1Activate();
    }
}

/**
 * callback on success for requestSession call
 */
function onRequestSessionSuccess(e) {
    SESSION = e;

    step1Complete();
}

/**
 * callback on launch error
 */
function onLaunchError() {
    $("#step_1 .loader").hide("fast");

    if (SESSION == null) {
        step1Activate();
    } else {
        console.log("onLaunchError: maybe we are already launched?");
    }
}

/**
 * launch app and request session
 */
function launchApp() {
    $("#step_1 .loader").show();
    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

/**
 * stop app/session
 */
function stopApp() {
    SESSION.stop(onStopAppSuccess, onInitError);
}

/**
 * attempt to load the cast session and api
 */
function tryToLoadCast() {
    if ((!chrome.cast || !chrome.cast.isAvailable) && TIMEOUT > 0) {
        TIMEOUT -= 1;
        setTimeout(tryToLoadCast, 1000);
        return false;
    }

    var app_id = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
    var sessionRequest = new chrome.cast.SessionRequest(app_id);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

    chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);

    return true;
}