/**
 * @file YiWebFileLoader.js
 * @brief JavaScript module for streamlining the loading of other JavaScript (JS) and Cascading StyleSheet (CSS) files.
 */

function CYIWebFileLoader() {
    var self = this;

    self.verbose = true;
    self.allowDuplicateScripts = false;
    self.allowDuplicateStyleSheets = false;
    self.scriptPathPrefix = CYIUtilities.joinPaths("assets", "scripts");
    self.styleSheetPathPrefix = CYIUtilities.joinPaths("assets", "stylesheets");
}

CYIWebFileLoader.instance = null;

CYIWebFileLoader.getInstance = function getInstance() {
    if(CYIUtilities.isInvalid(CYIWebFileLoader.instance)) {
        CYIWebFileLoader.instance = new CYIWebFileLoader();
    }

    return CYIWebFileLoader.instance;
};

CYIWebFileLoader.hasScheme = function hasScheme(path) {
    if(CYIUtilities.isEmptyString(path)) {
        return false;
    }

    path = path.trim();

    // will match any valid scheme, such as:
    // - 'http://'
    // - 'https://'
    // - 'file://'
    // - 'net.sock-32://'
    // - etc.
    return !!path.match(/^([a-z][a-z0-9+.-]*):(?:\/\/)/);
};

CYIWebFileLoader.prototype.configure = function configure(configuration) {
    var self = this;

    if(!CYIUtilities.isObjectStrict(configuration)) {
        return;
    }

    if(CYIUtilities.isValid(configuration.verbose)) {
        var verbose = CYIUtilities.parseBoolean(configuration.verbose);

        if(CYIUtilities.isValid(verbose)) {
            self.verbose = verbose;
        }
    }

    if(CYIUtilities.isValid(configuration.scriptPathPrefix)) {
        var scriptPathPrefix = CYIUtilities.trimString(scriptPathPrefix);

        if(CYIUtilities.isValid(scriptPathPrefix)) {
            self.scriptPathPrefix = scriptPathPrefix;
        }
    }

    if(CYIUtilities.isValid(configuration.styleSheetPathPrefix)) {
        var styleSheetPathPrefix = CYIUtilities.trimString(styleSheetPathPrefix);

        if(CYIUtilities.isValid(styleSheetPathPrefix)) {
            self.styleSheetPathPrefix = styleSheetPathPrefix;
        }
    }

    if(CYIUtilities.isValid(configuration.allowDuplicateScripts)) {
        var allowDuplicateScripts = CYIUtilities.parseBoolean(configuration.allowDuplicateScripts);

        if(CYIUtilities.isValid(allowDuplicateScripts)) {
            self.allowDuplicateScripts = allowDuplicateScripts;
        }
    }

    if(CYIUtilities.isValid(configuration.allowDuplicateStyleSheets)) {
        var allowDuplicateStyleSheets = CYIUtilities.parseBoolean(configuration.allowDuplicateStyleSheets);

        if(CYIUtilities.isValid(allowDuplicateStyleSheets)) {
            self.allowDuplicateStyleSheets = allowDuplicateStyleSheets;
        }
    }
};

CYIWebFileLoader.getLoadedScripts = function getLoadedScripts() {
    var scriptElements = document.getElementsByTagName("script");
    var scriptSources = [];

    for(var i = 0; i < scriptElements.length; i++) {
        var scriptElement = scriptElements[i];

        if(CYIUtilities.isEmptyString(scriptElement.src) || scriptElement.type !== "text/javascript") {
            continue;
        }

        scriptSources.push(scriptElement.src);
    }

    return scriptSources;
};

CYIWebFileLoader.getLoadedStyleSheets = function getLoadedStyleSheets() {
    var styleSheetElements = document.getElementsByTagName("link");
    var styleHrefs = [];

    for(var i = 0; i < styleSheetElements.length; i++) {
        var styleSheetElement = styleSheetElements[i];

        if(styleSheetElement.type !== "text/css") {
            continue;
        }

        var styleSheetHref = styleSheetElement.getAttribute("href");

        if(CYIUtilities.isEmptyString(styleSheetHref)) {
            continue;
        }

        styleHrefs.push(styleSheetHref);
    }

    return styleHrefs;
};

CYIWebFileLoader.getLoadedFiles = function getLoadedFiles() {
    return {
        scripts: CYIWebFileLoader.getLoadedScripts(),
        styleSheets: CYIWebFileLoader.getLoadedStyleSheets()
    };
};

CYIWebFileLoader.isScriptLoaded = function isScriptLoaded(scriptPath) {
    scriptPath = CYIUtilities.trimString(scriptPath);

    var scriptFileName = CYIUtilities.getFileName(scriptPath);
    var scriptElements = document.getElementsByTagName("script");

    for(var i = 0; i < scriptElements.length; i++) {
        var scriptElement = scriptElements[i];

        if(CYIUtilities.isEmptyString(scriptElement.src) || scriptElement.type !== "text/javascript") {
            continue;
        }

        if(CYIUtilities.equalsIgnoreCase(CYIUtilities.getFileName(scriptElement.src), scriptFileName)) {
            return true;
        }
    }

    return false;
};

CYIWebFileLoader.isStyleSheetLoaded = function isStyleSheetLoaded(styleSheetPath) {
    styleSheetPath = CYIUtilities.trimString(styleSheetPath);

    var styleSheetFileName = CYIUtilities.getFileName(styleSheetPath);
    var styleSheetElements = document.getElementsByTagName("link");

    for(var i = 0; i < styleSheetElements.length; i++) {
        var styleSheetElement = styleSheetElements[i];

        if(styleSheetElement.type !== "text/css") {
            continue;
        }

        var styleSheetHref = styleSheetElement.getAttribute("href");

        if(CYIUtilities.isEmptyString(styleSheetHref)) {
            continue;
        }

        if(CYIUtilities.equalsIgnoreCase(CYIUtilities.getFileName(styleSheetHref), styleSheetFileName)) {
            return true;
        }
    }

    return false;
};

CYIWebFileLoader.isFileLoaded = function isFileLoaded(filePath) {
    var fileExtension = CYIUtilities.getFileExtension(filePath);

    if(CYIUtilities.isEmptyString(fileExtension)) {
        return false;
    }

    fileExtension = fileExtension.toLowerCase();

    if(fileExtension === "js") {
        return CYIWebFileLoader.isScriptLoaded(filePath);
    }
    else if(fileExtension === "css") {
        return CYIWebFileLoader.isStyleSheetLoaded(filePath);
    }

    return false;
};

CYIWebFileLoader.prototype.loadFile = function loadFile(filePath, options, callback) {
    var self = this;

    if(CYIUtilities.isFunction(options)) {
        callback = options;
        options = null;
    }

    if(!CYIUtilities.isObjectStrict(options)) {
        options = { };
    }
    else {
        options = CYIUtilities.clone(options);
    }

    options.promisify = CYIUtilities.parseBoolean(options.promisify, true);

    if(CYIUtilities.isFunction(callback)) {
        return self.loadFileHelper(filePath, options, callback);
    }
    else {
        if(options.promisify) {
            return CYIUtilities.promisify(self.loadFileHelper.bind(self))(filePath, options);
        }
    }
};

CYIWebFileLoader.prototype.loadFileHelper = function loadFileHelper(filePath, options, callback) {
    var self = this;

    if(CYIUtilities.isFunction(options)) {
        callback = options;
        options = null;
    }

    if(CYIUtilities.isObjectStrict(filePath)) {
        options = filePath;
        filePath = filePath.path;
    }

    if(!CYIUtilities.isObjectStrict(options)) {
        options = { };
    }
    else {
        options = CYIUtilities.clone(options);
    }

    options.verbose = CYIUtilities.parseBoolean(options.verbose, self.verbose);

    filePath = CYIUtilities.trimString(filePath);

    if(CYIUtilities.isEmptyString(filePath)) {
        var message = "Missing or invalid file path!";

        if(CYIUtilities.isFunction(callback)) {
            return callback(CYIUtilities.createError(message));
        }

        console.error(message);
    }

    var fileExtension = CYIUtilities.getFileExtension(filePath);

    if(CYIUtilities.isEmptyString(fileExtension)) {
        return callback(CYIUtilities.createError("Could not determine file extension from file path: '" + filePath + "'. Please ensure that your file has a valid and supported extension!"));
    }

    fileExtension = fileExtension.toLowerCase();

    if(fileExtension === "js") {
        options.allowDuplicateScripts = CYIUtilities.parseBoolean(options.allowDuplicates, self.allowDuplicateScripts);
        options.type = CYIUtilities.trimString(options.type, "text/javascript");

        if(!options.allowDuplicateScripts) {
            if(CYIWebFileLoader.isScriptLoaded(filePath)) {
                if(options.verbose) {
                    console.warn("Script file already loaded: '" + filePath + "'.");
                }

                if(CYIUtilities.isFunction(callback)) {
                    return callback();
                }
            }
        }

        var scriptSource = CYIUtilities.joinPaths((CYIWebFileLoader.hasScheme(filePath) ? "" : self.scriptPathPrefix), filePath);

        if(options.verbose) {
            console.log("Loading script file: '" + scriptSource + "'...");
        }

        var scriptElement = document.createElement("script");
        scriptElement.src = scriptSource;
        scriptElement.type = options.type;

        CYIWebFileLoader.scriptSource = scriptSource;
        window.addEventListener("error", CYIWebFileLoader.onUnhandledError);

        scriptElement.addEventListener("load", function() {
            window.removeEventListener("error", CYIWebFileLoader.onUnhandledError);

            if(CYIUtilities.isError(CYIWebFileLoader.parseError)) {
                if(options.verbose) {
                    console.error("Failed to load script file: '" + scriptElement.src + "': '" + CYIWebFileLoader.parseError.message + "'.");
                }

                if(CYIUtilities.isFunction(callback)) {
                    return callback(CYIUtilities.formatError(CYIWebFileLoader.parseError));
                }
            }
            else  {
                if(options.verbose) {
                    console.log("Loaded script file: '" + scriptElement.src + "'.");
                }

                if(CYIUtilities.isFunction(callback)) {
                    return callback();
                }
            }
        });

        scriptElement.addEventListener("error", function(error) {
            window.removeEventListener("error", CYIWebFileLoader.onUnhandledError);

            var message = "Failed to load script file: '" + scriptElement.src + "'.";

            if(CYIUtilities.isFunction(callback)) {
                return callback(CYIUtilities.createError(message));
            }

            return console.error(message);
        });

        document.head.appendChild(scriptElement);
    }
    else if(fileExtension === "css") {
        options.allowDuplicateStyleSheets = CYIUtilities.parseBoolean(options.allowDuplicates, self.allowDuplicateStyleSheets);
        options.type = CYIUtilities.trimString(options.type, "text/css");
        options.rel = CYIUtilities.trimString(options.rel, "stylesheet");

        if(!options.allowDuplicateStyleSheets) {
            if(CYIWebFileLoader.isStyleSheetLoaded(filePath)) {
                if(options.verbose) {
                    console.warn("Style sheet file already loaded: '" + filePath + "'.");
                }

                if(CYIUtilities.isFunction(callback)) {
                    return callback();
                }
            }
        }

        var styleSheetSource = CYIUtilities.joinPaths((CYIWebFileLoader.hasScheme(filePath) ? "" : self.styleSheetPathPrefix), filePath);

        if(options.verbose) {
            console.log("Loading style sheet file: '" + styleSheetSource + "'...");
        }

        var styleSheetElement = document.createElement("link");
        styleSheetElement.setAttribute("href", styleSheetSource);
        styleSheetElement.type = options.type;
        styleSheetElement.setAttribute("rel", options.rel);

        styleSheetElement.addEventListener("load", function() {
            if(options.verbose) {
                console.log("Loaded style sheet file: '" + styleSheetElement.getAttribute("href") + "'.");
            }

            if(CYIUtilities.isFunction(callback)) {
                return callback();
            }
        });

        styleSheetElement.addEventListener("error", function(error) {
            var message = "Failed to load style sheet file: '" + styleSheetElement.getAttribute("href") + "'.";

            if(CYIUtilities.isFunction(callback)) {
                return callback(CYIUtilities.createError(message));
            }

            return console.error(message);
        });

        document.head.appendChild(styleSheetElement);
    }
    else {
        var message = "Invalid file extension: '" + fileExtension + "'.";

        if(CYIUtilities.isFunction(callback)) {
            return callback(CYIUtilities.createError(message));
        }

        return console.error(message);
    }
};

CYIWebFileLoader.prototype.loadFiles = function loadFiles(files, options, callback) {
    var self = this;

    if(CYIUtilities.isFunction(options)) {
        callback = options;
        options = null;
    }

    if(!CYIUtilities.isObjectStrict(options)) {
        options = { };
    }
    else {
        options = CYIUtilities.clone(options);
    }

    options.promisify = CYIUtilities.parseBoolean(options.promisify, true);

    var loadFileOptions = CYIUtilities.clone(options);
    delete loadFileOptions.promisify;

    if(CYIUtilities.isFunction(callback)) {
        return self.loadFilesHelper(files, loadFileOptions, callback);
    }
    else {
        if(options.promisify) {
            return CYIUtilities.promisify(self.loadFilesHelper.bind(self))(files, loadFileOptions);
        }
    }
};

CYIWebFileLoader.prototype.loadFilesHelper = function loadFilesHelper(files, loadFileOptions, callback) {
    var self = this;

    if(CYIUtilities.isEmptyArray(files)) {
        if(CYIUtilities.isFunction(callback)) {
            callback();
        }

        return;
    }

    return async.eachSeries(
        files,
        function(file, callback) {
            return self.loadFile(
                file,
                loadFileOptions,
                function(error) {
                    if(error) {
                        return callback(error);
                    }

                    return callback();
                }
            );
        },
        function(error) {
            if(error) {
                if(CYIUtilities.isFunction(callback)) {
                    return callback(error);
                }

                return console.error(error);
            }

            if(CYIUtilities.isFunction(callback)) {
                return callback();
            }
        }
    );
};

CYIWebFileLoader.scriptSource = null;
CYIWebFileLoader.parseError = null;

CYIWebFileLoader.onUnhandledError = function onUnhandledError(event) {
    if(!CYIUtilities.isObject(event)) {
        return;
    }

    if(CYIUtilities.isError(event.error)) {
        CYIWebFileLoader.parseError = event.error;
    }
    else {
        CYIWebFileLoader.parseError = CYIUtilities.createError("Failed to load script '" + CYIWebFileLoader.scriptSource + "' with error message: " + event.message);
    }
};
