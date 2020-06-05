/**
 * @file YiMain.js
 * @brief JavaScript module for loading Tizen platform scripts and initializing the application.
 */

function CYIMain() { }

CYIMain.loadScripts = function loadScripts() {
	var webFileLoader = CYIWebFileLoader.getInstance();

	webFileLoader.loadFiles(
		[
			// javascript files
			"YiLogger.js",
			"moment.min.js",
			"change-case-bundled.min.js",
			"bytebuffer.min.js",
			"YiByteBuffer.js",
			"YiPlatformUtilities.js",
			"YiSpinner.js",
			"YiApplication.js",
			"YiClosedCaptionsStyleManager.js",
			// cascading stylesheets
			"spinner.css",
			"font-awesome.min.css",
			"closed-captions.css"
		],
		function(error) {
			if(error) {
				return CYIErrorOverlay.show(CYIUtilities.formatError(error), "Script Load Error");
			}

			console.log("Tizen dependencies loaded successfully, starting application initialization.");

			return window.dispatchEvent(new Event("tizendependenciesloaded"));
		}
	);
};

window.addEventListener("DOMContentLoaded", function(event) {
	CYIMain.loadScripts();
});
