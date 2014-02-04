/***
 ** Contains all the javascript needed to dynamically alter the CSS
 ** of the 'Steps' to lead the user through our app. Does not perform
 ** any business logic for altering media or interfacing with Chromecast.
 **/

/** STEP ONE METHODS **/
function step1Complete() {
    $("#step_1 .loader").hide();
    $("#step_1_label .x").hide();
    $("#step_1").hide();
    $("#step_1_label .check").show();
    $("#step_1_label").removeClass("active");
    step2Activate();
}

function step1Error() {
    step2Deactivate();
    $("#step_1 .loader").hide();
    $("#step_1_label .check").hide();
    $("#step_1_label .x").show();
    $("#step_1_label").removeClass("active");
    $("#step_1").show();
}

function step1Activate() {
    step2Deactivate();
    $("#step_1 .loader").hide();
    $("#step_1_label .check").hide();
    $("#step_1_label .x").hide();
    $("#step_1_label").addClass("active");
    $("#step_1").show();
}

function step1Deactivate() {
    step2Deactivate();
    $("#step_1 .loader").hide();
    $("#step_1_label .check").hide();
    $("#step_1_label .x").hide();
    $("#step_1_label").removeClass("active");
    $("#step_1").hide();
}


/** STEP TWO METHODS **/
function step2Complete() {
    $("#step_2 .loader").hide();
    $("#step_2_label .x").hide();
    $("#step_2").hide();
    $("#step_2_label .check").show();
    $("#step_2_label").removeClass("active");
    step3Activate();
}

function step2Error() {
    step3Deactivate();
    $("#step_2 .loader").hide();
    $("#step_2_label .check").hide();
    $("#step_2_label .x").show();
    $("#step_2_label").removeClass("active");
    $("#step_2").show();
}

function step2Activate() {
    step3Deactivate();
    $("#step_2 .loader").hide();
    $("#step_2_label .check").hide();
    $("#step_2_label .x").hide();
    $("#step_2_label").addClass("active");
    $("#step_2").show();
}

function step2Deactivate() {
    step3Deactivate();
    $("#step_2 .loader").hide();
    $("#step_2_label .check").hide();
    $("#step_2_label .x").hide();
    $("#step_2_label").removeClass("active");
    $("#step_2").hide();
}

/** STEP THREE METHODS **/
function step3Complete() {
    $("#step_3 .loader").hide();
    $("#step_3_label .x").hide();
    $("#step_3").hide();
    $("#step_3_label .check").show();
    $("#step_3_label").removeClass("active");
}

function step3Error() {
    $("#step_3 .loader").hide();
    $("#step_3_label .check").hide();
    $("#step_3_label .x").show();
    $("#step_3_label").removeClass("active");
    $("#step_3").show();
}

function step3Activate() {
    $("#step_3 .loader").hide();
    $("#step_3_label .check").hide();
    $("#step_3_label .x").hide();
    $("#step_3_label").addClass("active");

    // setup media controls
    $("#seek").attr("min", 0);
    $("#seek").attr("max", MEDIA_SESSION.media.duration);

    $("#step_3").show();
}

function step3Deactivate() {
    $("#step_3 .loader").hide();
    $("#step_3_label .check").hide();
    $("#step_3_label .x").hide();
    $("#step_3_label").removeClass("active");
    $("#step_3").hide();
}