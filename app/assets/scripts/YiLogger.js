/**
 * @file YiLogger.js
 * @brief NaCl application log command handler.
 */

function CYILogger() { }

CYILogger.LogTypes = Object.freeze(["log", "info", "warn", "error"]);

CYILogger.enabled = true;

CYILogger.logsElement = null;

CYILogger.logsAreaElement = null;

CYILogger.originalConsole = { };

CYILogger.modifiedConsole = { };

CYILogger.consoleHooked = false;

CYILogger.messages = [];

CYILogger.logCache = [];

CYILogger.maxHistory = 50;

CYILogger.initialize = function initialize() {
    if(!CYILogger.enabled || CYILogger.logsElement !== null) {
        return;
    }

    CYILogger.logsElement = document.getElementById("logs");
    CYILogger.logsAreaElement = document.getElementById("logs_area");

    if(CYIUtilities.isValid(CYILogger.logsElement)) {
        for(var i = 0; i < CYILogger.logCache.length; i++) {
            var cachedMessage = CYILogger.logCache[i];

            if(CYIUtilities.isValid(cachedMessage.message)) {
                CYILogger.log(cachedMessage.message);
            }
            else if(CYIUtilities.isValid(cachedMessage.error)) {
                CYILogger.logError(cachedMessage.error, cachedMessage.className, cachedMessage.functionName);
            }
        }

        CYILogger.logCache.length = 0;
    }
};

CYILogger.log = function log(message) {
    if(!CYILogger.enabled) {
        return;
    }

    CYILogger.initialize();

    if(CYIUtilities.isInvalid(CYILogger.logsElement)) {
        CYILogger.logCache.push({
            message: message
        });

        return;
    }

    if(isFinite(CYILogger.maxHistory)) {
        CYILogger.messages.push(CYIUtilities.toString(message));
        CYILogger.messages.splice(0, CYILogger.messages.length - CYILogger.maxHistory);

        CYILogger.logsElement.value = CYILogger.messages.join("\n");
    }
    else {
        CYILogger.logsElement.value += CYIUtilities.toString(message) + "\n";
    }

    CYILogger.logsElement.scrollTop = CYILogger.logsElement.scrollHeight;
};

CYILogger.logError = function log(error, className, functionName) {
    if(!CYILogger.enabled) {
        return;
    }

    CYILogger.initialize();

    if(CYIUtilities.isInvalid(CYILogger.logsElement)) {
        return CYILogger.logCache.push({
            error: error,
            className: className,
            functionName: functionName
        });
    }

    var message = error;
    var stack = null;

    if(error instanceof Error) {
        message = error.message

        if(error.stack) {
            stack = error.stack;
        }
    }
    else if(typeof error !== "string") {
        message = CYIUtilities.toString(error);
    }

    if(stack === null) {
        stack = CYIUtilities.formatStack(CYIUtilities.getStack().slice(1));
    }

    if(CYIUtilities.isNonEmptyString(functionName)) {
        functionName = CYIUtilities.getParentFunctionName();
    }

    var formattedMessage = "";

    if(CYIUtilities.isNonEmptyString(className)) {
        formattedMessage += className;
    }

    if(CYIUtilities.isNonEmptyString(functionName)) {
        if(formattedMessage.length !== 0) {
            formattedMessage += ".";
        }

        formattedMessage += functionName;
    }

    if(formattedMessage === 0) {
        formattedMessage += "Unknown";
    }

    formattedMessage += " error: " + message;

    CYILogger.log(formattedMessage);
    CYILogger.log(stack);
};

CYILogger.getLogWindowVisibility = function getLogWindowVisibility(visible) {
    CYILogger.initialize();

    return CYILogger.logsAreaElement.classList.contains("visible");
};

CYILogger.setLogWindowVisibility = function setLogWindowVisibility(visible) {
    CYILogger.initialize();

    if(visible) {
        CYILogger.logsAreaElement.classList.add("visible");
        CYILogger.logsElement.scrollTop = CYILogger.logsElement.scrollHeight;
    }
    else {
        CYILogger.logsAreaElement.classList.remove("visible");
    }
};

CYILogger.backupOriginalConsole = function backupOriginalConsole() {
    for(var i = 0; i < CYILogger.LogTypes.length; i++) {
        var type = CYILogger.LogTypes[i];
        CYILogger.originalConsole[type] = console[type];
    }
}

CYILogger.backupModifiedConsole = function backupModifiedConsole() {
    for(var i = 0; i < CYILogger.LogTypes.length; i++) {
        var type = CYILogger.LogTypes[i];
        CYILogger.modifiedConsole[type] = console[type];
    }
}

CYILogger.restoreOriginalConsole = function restoreOriginalConsole() {
    for(var i = 0; i < CYILogger.LogTypes.length; i++) {
        var type = CYILogger.LogTypes[i];
        console[type] = CYILogger.originalConsole[type];
    }
}

CYILogger.restoreModifiedConsole = function restoreModifiedConsole() {
    for(var i = 0; i < CYILogger.LogTypes.length; i++) {
        var type = CYILogger.LogTypes[i];
        console[type] = CYILogger.modifiedConsole[type];
    }
}

CYILogger.hookConsoleLogging = function hookConsoleLogging() {
    if(CYILogger.consoleHooked) {
        return;
    }

    CYILogger.backupModifiedConsole();

    for(var i = 0; i < CYILogger.LogTypes.length; i++) {
        var type = CYILogger.LogTypes[i];

        console[type] = (function(type) {
            return function() {
                if(CYILogger.modifiedConsole[type] instanceof Function) {
                    CYILogger.modifiedConsole[type].apply(console, arguments);
                }

                return CYILogger.log.apply(CYILogger, arguments);
            }
        })(type);
    }

    CYILogger.consoleHooked = true;
}

CYILogger.unhookConsoleLogging = function unhookConsoleLogging() {
    if(!CYILogger.consoleHooked) {
        return;
    }

    CYILogger.restoreModifiedConsole();

    CYILogger.consoleHooked = false;
}

CYILogger.backupOriginalConsole();
CYILogger.hookConsoleLogging();

window.addEventListener("error", function(event) {
    if(event instanceof ErrorEvent) {
        var error = event.message;

        if(event.error !== undefined && event.error !== null) {
            error = event.error;
        }

        if(error instanceof Error) {
            if(error.stack === undefined || error.stack === null) {
                error.stack = CYIUtilities.formatStack(CYIUtilities.getStack().slice(1));
            }

            CYILogger.logError("Unhandled Error: " + error.message);
            CYILogger.logError(error.stack);
        }
        else {
            CYILogger.logError("Unhandled Error: " + event.message);
            CYILogger.logError("at " + event.filename + ":" + event.lineno + (isNaN(event.colno) ? "" : event.colno));
        }
    }

    return false;
});

window.addEventListener("unhandledrejection", function(event) {
    if(event instanceof PromiseRejectionEvent) {
        var reason = event.reason;

        if(reason instanceof Object) {
            CYILogger.logError("Unhandled Promise Rejection: " + reason.message);
        }
    }

    return false;
});
