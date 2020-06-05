/**
 * @file YiPlatformUtilities.js
 * @brief JavaScript platform utility helper code.
 */

"use strict";

class CYIPlatformUtilities { }

Object.defineProperty(CYIPlatformUtilities, "platformName", {
    value: "Unknown",
    enumerable: true,
    writable: true
});

Object.defineProperty(CYIPlatformUtilities, "isEmbedded", {
    value: false,
    enumerable: true,
    writable: true
});

Object.defineProperty(CYIPlatformUtilities, "isTizen", {
    value: typeof tizen !== "undefined" && typeof webapis !== "undefined",
    enumerable: true
});

Object.defineProperty(CYIPlatformUtilities, "isUWP", {
    value: window.external !== undefined && window.external.notify !== undefined,
    enumerable: true,
    writable: true
});

Object.defineProperty(CYIPlatformUtilities, "isPS4", {
    value: false,
    enumerable: true,
    writable: true
});

Object.defineProperty(CYIPlatformUtilities, "isOSX", {
    value: false,
    enumerable: true,
    writable: true
});

Object.defineProperty(CYIPlatformUtilities, "tizenPlatformVersion", {
    value: null,
    enumerable: true,
    writable: true
});

if(CYIPlatformUtilities.isTizen && CYIUtilities.isInvalid(CYIPlatformUtilities.tizenPlatformVersion)) {
    CYIPlatformUtilities.platformName = "Tizen";

    try {
        CYIPlatformUtilities.tizenPlatformVersion = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.native.api.version");
    }
    catch(error) {
        console.error("Failed to determine Tizen platform version: " + error.message);
    }
}
else if(CYIPlatformUtilities.isUWP) {
    CYIPlatformUtilities.platformName = "UWP";
}

window.CYIPlatformUtilities = CYIPlatformUtilities;
