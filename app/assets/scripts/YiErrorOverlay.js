/**
 * @file YiErrorOverlay.js
 * @brief JavaScript module for displaying fatal errors.
 */

function CYIErrorOverlay() { }

CYIErrorOverlay.initialized = false;

CYIErrorOverlay.visible = false;

CYIErrorOverlay.defaultTitle = "Application crashed!";

CYIErrorOverlay.errorOverlayElement = null;

CYIErrorOverlay.errorContentElement = null;

CYIErrorOverlay.errorTitleElement = null;

CYIErrorOverlay.errorMessageElement = null;

CYIErrorOverlay.exitButtonElement = null;

CYIErrorOverlay.initialize = function() {
    if(CYIErrorOverlay.initialized) {
        return;
    }

    var errorOverlayElement = document.createElement("div");
    errorOverlayElement.id = "error-overlay";
    document.body.appendChild(errorOverlayElement);
    CYIErrorOverlay.errorOverlayElement = errorOverlayElement;

    var errorContentElement = document.createElement("div");
    errorContentElement.classList.add("content");
    errorOverlayElement.appendChild(errorContentElement);
    CYIErrorOverlay.errorContentElement = errorContentElement;

    var errorTitleElement = document.createElement("div");
    errorTitleElement.classList.add("title", "text");
    errorContentElement.appendChild(errorTitleElement);
    CYIErrorOverlay.errorTitleElement = errorTitleElement;

    var errorMessageElement = document.createElement("div");
    errorMessageElement.classList.add("message", "text");
    errorContentElement.appendChild(errorMessageElement);
    CYIErrorOverlay.errorMessageElement = errorMessageElement;

    if(typeof tizen !== "undefined") {
        var exitButtonElement = document.createElement("button");
        exitButtonElement.classList.add("exit", "button");
        exitButtonElement.innerText = "Exit";
        errorContentElement.appendChild(exitButtonElement);
        exitButtonElement.addEventListener("click", function(event) {
            tizen.application.getCurrentApplication().exit();
        });
        CYIErrorOverlay.exitButtonElement = exitButtonElement;

        document.addEventListener("keyup", function(event) {
            if(!CYIErrorOverlay.visible) {
                return;
            }

            if(event.keyCode === 10009) { // back button
                tizen.application.getCurrentApplication().exit();
            }
        });
    }

    CYIErrorOverlay.initialized = true;
};

CYIErrorOverlay.show = function show(error, title) {
    if(CYIErrorOverlay.visible) {
        return;
    }

    CYIErrorOverlay.initialize();

    if(CYIUtilities.isNonEmptyString(title)) {
        title = title.trim();
    }
    else {
        title = CYIErrorOverlay.defaultTitle;
    }

    var message = null;

    if(!CYIUtilities.isError(error)) {
        error = CYIUtilities.createError(CYIUtilities.isNonEmptyString(error) ? error : "Unknown error!");
        error.stack = CYIUtilities.formatStack(CYIUtilities.getStack().slice(1), error.message, error.name);
    }

    if(CYIUtilities.isNonEmptyString(error.stack)) {
        message = error.stack;
    }
    else {
        message = error.message;
    }

    CYIErrorOverlay.speakErrorMessage(error.message, title);

    console.error(error);

    if(typeof CYIApplication !== "undefined") {
        CYIApplication.crashed = true;
    }

    CYIErrorOverlay.errorTitleElement.innerText = title;
    CYIErrorOverlay.errorMessageElement.innerText = message;
    CYIErrorOverlay.errorOverlayElement.classList.add("visible");

    if(typeof CYILogger !== "undefined" && CYIUtilities.isValid(CYILogger.logsElement)) {
        CYILogger.logsElement.classList.add("crash");

        if(typeof tizen !== "undefined") {
            CYILogger.setLogWindowVisibility(true);
        }
    }

    CYIErrorOverlay.visible = true;

    if(CYIUtilities.isValid(CYIErrorOverlay.exitButtonElement)) {
        CYIErrorOverlay.exitButtonElement.focus();
    }
};

CYIErrorOverlay.hide = function hide() {
    if(!CYIErrorOverlay.visible) {
        return;
    }

    CYIErrorOverlay.visible = false;

    CYIErrorOverlay.errorOverlayElement.classList.remove("visible");
};

CYIErrorOverlay.speakErrorMessage = function speakErrorMessage(message, title) {
    if(CYIUtilities.isEmptyString(message) || webapis.tvinfo.getMenuValue(webapis.tvinfo.TvInfoMenuKey.VOICE_GUIDE_KEY) === webapis.tvinfo.TvInfoMenuValue.OFF) {
        return;
    }

    // cancel existing speech synthesis to prevent interference
    window.speechSynthesis.cancel();

    return async.eachSeries(
        [
            {
                text: title,
                delay: 100 // initial delay required to prevent platform from interfering
            },
            {
                text: message,
                delay: 500
            },
            {
                text: "exit, button",
                delay: 500
            }
        ],
        function(data, callback) {
            if(CYIUtilities.isEmptyString(data.text)) {
                return callback();
            }

            var utterance = new SpeechSynthesisUtterance(data.text.trim());

            utterance.addEventListener("end", function(event) {
                return callback();
            });

            utterance.addEventListener("error", function(event) {
                return callback(event.error);
            });

            return setTimeout(function() {
                return window.speechSynthesis.speak(utterance);
            }, data.delay);
        },
        function(error) {
            if(error) {
                return console.error(error);
            }
        }
    );
};
