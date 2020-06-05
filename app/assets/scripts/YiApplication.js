"use strict";

function CYIApplication() { }

CYIApplication.crashed = false;

CYIApplication.displayMessage = function displayMessage(message, title) {
	console.log(message);
};

CYIApplication.displayError = function displayError(error) {
	if(CYIUtilities.isObject(error)) {
		console.error(error.message);

		if(CYIUtilities.isValid(error.stack)) {
			console.error(error.stack);
		}
	}
	else {
		console.error(CYIUtilities.toString(error));
	}
};

CYIApplication.initialize = function initialize() {
	CYIApplication.initializeKeyboardInput();

	if(typeof tizen !== "undefined") {
		document.body.classList.add("tizen");
		CYILogger.maxHistory = 64;
	}

	// add example webvtt closed captions HTML content
	setTimeout(function() {
		var width = 1280;
		var height = 720;
		var x = 75;
		var y = (screen.height - height) - 20;

		var backgroundImageElement = document.getElementById("background_image");

		backgroundImageElement.style.left = x + "px";
		backgroundImageElement.style.top = y + "px";
		backgroundImageElement.style.width = width + "px";
		backgroundImageElement.style.height = height + "px";

		var closedCaptionsContainerElement = document.getElementById("closed_captions");
		closedCaptionsContainerElement.firstChild.innerHTML = "<u>English subtitle 5 -Forced- (00:08:09.000)</u><br><i>Italics</i> - <b>BOLD</b> - <u>UNDERLINE</u>";

		closedCaptionsContainerElement.style.left = x + "px";
		closedCaptionsContainerElement.style.bottom = (screen.height - (y + height)) + "px";
		closedCaptionsContainerElement.style.width = width + "px";
	}, 0);
};

CYIApplication.toggleConsole = function toggleConsole() {
	return CYILogger.setLogWindowVisibility(!CYILogger.getLogWindowVisibility());
};

CYIApplication.initializeKeyboardInput = function initializeKeyboardInput() {
	if(typeof tizen === "undefined") {
		return;
	}

	[
		"MediaPlayPause",
		"MediaRewind",
		"MediaFastForward",
		"MediaPlay",
		"MediaPause",
		"MediaStop",
		"MediaRecord",
		"Info",
		"ColorF0Red",
		"ColorF1Green",
		"ColorF2Yellow",
		"ColorF3Blue",
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
	].forEach(function(keyName) {
		tizen.tvinputdevice.registerKey(keyName);
	});

	document.addEventListener("keyup", function(event) {
		if(event.keyCode === 10009 || event.keyCode == tizen.tvinputdevice.getKey("5").code) { // back
			// prevent exiting if a modal is visible
			if(document.querySelector(".modal.visible")) {
				return;
			}

			return tizen.application.getCurrentApplication().exit();
		}
		else if(event.keyCode === tizen.tvinputdevice.getKey("3").code) {
			return CYIApplication.toggleConsole();
		}
		else {
			console.log("Unhandled key event: " + event.keyCode);
		}
	});

	console.log("Keyboard input initialized.");
};

window.addEventListener("tizendependenciesloaded", CYIApplication.initialize);
