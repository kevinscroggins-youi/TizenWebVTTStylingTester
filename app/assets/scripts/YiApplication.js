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
		closedCaptionsContainerElement.classList.add("visible");
		closedCaptionsContainerElement.style.left = x + "px";
		closedCaptionsContainerElement.style.bottom = (screen.height - (y + height)) + "px";
		closedCaptionsContainerElement.style.width = width + "px";

		var captionIndex = 0;
		var captions = [
			"<u>English subtitle 4 -Unforced- (00:09:07.000)</u><br><u>UNDERLINE</u>",
			"<u>English subtitle 5 -Forced- (00:08:09.000)</u><br><i>Italics</i> - <b>BOLD</b> - <u>UNDERLINE</u>",
			"English subtitle 6 -Unforced- (00:09:11.000)<br>align start",
			"English subtitle 10 -Forced- (00:09:19.000)",
			"one<br>two<br>three<br>four<br>five"
		];

		setInterval(function() {
			closedCaptionsContainerElement.firstChild.innerHTML = captions[captionIndex++];

			if(captionIndex >= captions.length) {
				captionIndex = 0;
			}
		}, 1000);
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
