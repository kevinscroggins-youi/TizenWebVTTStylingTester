/**
 * @file YiClosedCaptionsStyleManager.js
 * @brief Tizen AVPlay closed captions styling manager.
 */

function CYIClosedCaptionsStyleManager() { }

CYIClosedCaptionsStyleManager.verbose = CYIDebug.isDebugBuild;

CYIClosedCaptionsStyleManager.closedCaptionsContainerElement = null;

CYIClosedCaptionsStyleManager.closedCaptionElement = null;

CYIClosedCaptionsStyleManager.flasherOn = false;

CYIClosedCaptionsStyleManager.flasherIntervalMs = 600;

CYIClosedCaptionsStyleManager.flasherIntervalId = -1;

CYIClosedCaptionsStyleManager.Colors = Object.freeze({
    default: {
        displayName: "Default",
        classSuffix: "default",
        value: "CAPTION_COLOR_DEFAULT"
    },
    white: {
        displayName: "White",
        classSuffix: "white",
        value: "CAPTION_COLOR_WHITE"
    },
    black: {
        displayName: "Black",
        classSuffix: "black",
        value: "CAPTION_COLOR_BLACK"
    },
    red: {
        displayName: "Red",
        classSuffix: "red",
        value: "CAPTION_COLOR_RED"
    },
    green: {
        displayName: "Green",
        classSuffix: "green",
        value: "CAPTION_COLOR_GREEN"
    },
    blue: {
        displayName: "Blue",
        classSuffix: "blue",
        value: "CAPTION_COLOR_BLUE"
    },
    yellow: {
        displayName: "Yellow",
        classSuffix: "yellow",
        value: "CAPTION_COLOR_YELLOW"
    },
    magenta: {
        displayName: "Magenta",
        classSuffix: "magenta",
        value: "CAPTION_COLOR_MAGENTA"
    },
    cyan: {
        displayName: "Cyan",
        classSuffix: "cyan",
        value: "CAPTION_COLOR_CYAN"
    }
});

CYIClosedCaptionsStyleManager.Opacities = Object.freeze({
    solid: {
        displayName: "Solid",
        classSuffix: "solid",
        value: "CAPTION_OPACITY_SOLID"
    },
    flash: {
        displayName: "Flashing",
        classSuffix: "flash",
        value: "CAPTION_OPACITY_FLASHING"
    },
    transluscent: {
        displayName: "Transluscent",
        classSuffix: "transluscent",
        value: "CAPTION_OPACITY_TRANSLUCENT"
    },
    transparent: {
        displayName: "Transparent",
        classSuffix: "transparent",
        value: "CAPTION_OPACITY_TRANSPARENT"
    },
    default: {
        displayName: "Default",
        classSuffix: "default",
        value: "CAPTION_OPACITY_DEFAULT"
    },
    highlyTransluscent: {
        displayName: "Highly Transluscent",
        classSuffix: "highly-transluscent",
        value: "CAPTION_OPACITY_HIGHLY_TRANSLUCENT"
    },
    slightlyTransluscent: {
        displayName: "Slightly Transluscent",
        classSuffix: "slightly-transluscent",
        value: "CAPTION_OPACITY_SLIGHTLY_TRANSLUCENT"
    }
});

CYIClosedCaptionsStyleManager.FontSizes = Object.freeze({
    default: {
        displayName: "Default",
        classSuffix: "default",
        value: "CAPTION_SIZE_DEFAULT"
    },
    small: {
        displayName: "Small",
        classSuffix: "small",
        value: "CAPTION_SIZE_SMALL"
    },
    standard: {
        displayName: "Standard",
        classSuffix: "standard",
        value: "CAPTION_SIZE_STANDARD"
    },
    large: {
        displayName: "Large",
        classSuffix: "large",
        value: "CAPTION_SIZE_LARGE"
    },
    extraLarge: {
        displayName: "Extra Large",
        classSuffix: "extra-large",
        value: "CAPTION_SIZE_EXTRA_LARGE"
    }
});

CYIClosedCaptionsStyleManager.EdgeTypes = Object.freeze({
    none: {
        displayName: "No Edge",
        classSuffix: "none",
        value: "CAPTION_EDGE_NONE"
    },
    raised: {
        displayName: "Raised",
        classSuffix: "raised",
        value: "CAPTION_EDGE_RAISED"
    },
    depressed: {
        displayName: "Depressed",
        classSuffix: "depressed",
        value: "CAPTION_EDGE_DEPRESSED"
    },
    uniform: {
        displayName: "Uniform",
        classSuffix: "uniform",
        value: "CAPTION_EDGE_UNIFORM"
    },
    dropShadow: {
        displayName: "Drop Shadow",
        classSuffix: "drop-shadow",
        value: "CAPTION_EDGE_DROP_SHADOWED"
    }
});

CYIClosedCaptionsStyleManager.Fonts = Object.freeze({
    default: {
        displayName: "Default",
        classSuffix: "font-default",
        value: "CAPTION_FONT_DEFAULT"
    },
    font0: {
        displayName: "Font 0",
        classSuffix: "font-0",
        value: "CAPTION_FONT_STYLE0"
    },
    font1: {
        displayName: "Font 1",
        classSuffix: "font-1",
        value: "CAPTION_FONT_STYLE1"
    },
    font2: {
        displayName: "Font 2",
        classSuffix: "font-2",
        value: "CAPTION_FONT_STYLE2"
    },
    font3: {
        displayName: "Font 3",
        classSuffix: "font-3",
        value: "CAPTION_FONT_STYLE3"
    },
    font4: {
        displayName: "Font 4",
        classSuffix: "font-4",
        value: "CAPTION_FONT_STYLE4"
    },
    font5: {
        displayName: "Font 5",
        classSuffix: "font-5",
        value: "CAPTION_FONT_STYLE5"
    },
    font6: {
        displayName: "Font 6",
        classSuffix: "font-6",
        value: "CAPTION_FONT_STYLE6"
    },
    font7: {
        displayName: "Font 7",
        classSuffix: "font-7",
        value: "CAPTION_FONT_STYLE7"
    }
});

CYIClosedCaptionsStyleManager.captionSettings = {
    fontSize: {
        displayName: "Font Size",
        classPrefix: "font-size-",
        key: "CAPTION_FONT_SIZE_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.FontSizes
    },
    fontStyle: {
        displayName: "Font",
        classPrefix: "font-style-",
        key: "CAPTION_FONT_STYLE_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.Fonts
    },
    fontColor: {
        displayName: "Font Color",
        classPrefix: "font-color-",
        key: "CAPTION_FONT_COLOR_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.Colors
    },
    fontOpacity: {
        displayName: "Font Opacity",
        classPrefix: "font-opacity-",
        key: "CAPTION_FONT_OPACITY_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.Opacities
    },
    backgroundColor: {
        displayName: "Background Color",
        classPrefix: "background-color-",
        key: "CAPTION_BG_COLOR_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.Colors
    },
    backgroundOpacity: {
        displayName: "Background Opacity",
        classPrefix: "background-opacity-",
        key: "CAPTION_BG_OPACITY_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.Opacities
    },
    edgeType: {
        displayName: "Edge Type",
        classPrefix: "edge-type-",
        key: "CAPTION_EDGE_TYPE_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.EdgeTypes
    },
    edgeColor: {
        displayName: "Edge Color",
        classPrefix: "edge-color-",
        key: "CAPTION_EDGE_COLOR_KEY",
        target: "closedCaptionElement",
        values: CYIClosedCaptionsStyleManager.Colors
    },
    windowColor: {
        displayName: "Window Color",
        classPrefix: "window-color-",
        key: "CAPTION_WINDOW_COLOR_KEY",
        target: "closedCaptionsContainerElement",
        values: CYIClosedCaptionsStyleManager.Colors
    },
    windowOpacity: {
        displayName: "Window Opacity",
        classPrefix: "window-opacity-",
        key: "CAPTION_WINDOW_OPACITY_KEY",
        target: "closedCaptionsContainerElement",
        values: CYIClosedCaptionsStyleManager.Opacities
    }
};

CYIClosedCaptionsStyleManager.ClassPrefix = "closed-captions-"

CYIClosedCaptionsStyleManager.getCaptionSettingValue = function getCaptionSettingValue(captionSetting) {
    // some caption settings such as slightly / highly translucent opacities cause internal errors to be raised,
    // as such we should avoid modifying captions settings which trigger this
    try {
        return tizen.tvinfo.getCaptionValue(captionSetting.key);
    }
    catch(error) {
        console.error("Failed to obtain " + captionSetting.displayName + " caption setting value: " + CYIUtilities.formatError(error).stack);
    }

    return null;
};

CYIClosedCaptionsStyleManager.update = function update(key, value) {
    var updateValue = false;
    var updateOnce = false;
    var captionSettingTypes = Object.keys(CYIClosedCaptionsStyleManager.captionSettings);

    for(var i = 0; i < captionSettingTypes.length; i++) {
        var captionSettingType = captionSettingTypes[i];
        var captionSetting = CYIClosedCaptionsStyleManager.captionSettings[captionSettingType];
        var captionSettingValueTypes = Object.keys(captionSetting.values);
        updateValue = false;

        if(CYIUtilities.isNonEmptyString(key)) {
            if(captionSetting.key === key) {
                if(CYIUtilities.isInvalid(value)) {
                    value = CYIClosedCaptionsStyleManager.getCaptionSettingValue(captionSetting);

                    // prevent caption setting values from being updated if there was an error obtaining the value
                    if(CYIUtilities.isInvalid(captionSetting.key)) {
                        return;
                    }
                }

                updateOnce = true;
                updateValue = true;
            }
        }
        else {
            value = CYIClosedCaptionsStyleManager.getCaptionSettingValue(captionSetting);

            // prevent caption setting values from being updated if there was an error obtaining the value
            if(CYIUtilities.isInvalid(captionSetting.key)) {
                continue;
            }

            updateValue = true;
        }

        if(updateValue && CYIUtilities.isValid(value)) {
            var newCaptionSettingValue = null;
            var previousCaptionSettingValue = null;

            // locate the caption setting objects for both the previous and new caption setting values
            for(var j = 0; j < captionSettingValueTypes.length; j++) {
                var currentCaptionSettingValue = captionSetting.values[captionSettingValueTypes[j]];

                if(currentCaptionSettingValue.value === value) {
                    newCaptionSettingValue = currentCaptionSettingValue;
                }

                if(CYIUtilities.isValid(captionSetting.value) && currentCaptionSettingValue.value === captionSetting.value) {
                    previousCaptionSettingValue = currentCaptionSettingValue;
                }
            }
            
            if(CYIUtilities.isInvalid(newCaptionSettingValue)) {
                throw new Error("Invalid " + captionSetting.displayName + " value: '" + value + "'.");
            }

            if(CYIUtilities.isValid(previousCaptionSettingValue)) {
                // prevent changes if the new caption setting is the same as the previous
                if(newCaptionSettingValue.value === previousCaptionSettingValue.value) {
                    if(updateOnce) {
                        break;
                    }

                    continue;
                }

                var previousCaptionSettingClassName = CYIClosedCaptionsStyleManager.ClassPrefix + captionSetting.classPrefix + previousCaptionSettingValue.classSuffix;

                CYIClosedCaptionsStyleManager[captionSetting.target].classList.remove(previousCaptionSettingClassName);
            }

            var newCaptionSettingClassName = CYIClosedCaptionsStyleManager.ClassPrefix + captionSetting.classPrefix + newCaptionSettingValue.classSuffix;

            CYIClosedCaptionsStyleManager[captionSetting.target].classList.add(newCaptionSettingClassName);

            captionSetting.value = value;

            if(CYIClosedCaptionsStyleManager.verbose) {
                console.log("Changed " + captionSetting.displayName + " closed caption setting" + (CYIUtilities.isValid(previousCaptionSettingValue) ? " from " + previousCaptionSettingValue.displayName : "") + " to " + newCaptionSettingValue.displayName + ".");
            }
        }

        if(updateOnce) {
            break;
        }
    }

    if(!updateOnce && CYIUtilities.isNonEmptyString(key)) {
        throw new Error("Invalid caption setting type: '" + key + "'.");
    }
};

CYIClosedCaptionsStyleManager.initialize = function initialize() {
    var closedCaptionsContainerElement = document.createElement("div");
    closedCaptionsContainerElement.id = "closed_captions";
    document.body.appendChild(closedCaptionsContainerElement);
    CYIClosedCaptionsStyleManager.closedCaptionsContainerElement = closedCaptionsContainerElement;

    var closedCaptionElement = document.createElement("div");
    closedCaptionElement.classList.add("closed-caption");
    closedCaptionsContainerElement.appendChild(closedCaptionElement);
    CYIClosedCaptionsStyleManager.closedCaptionElement = closedCaptionElement;

    var captionSettingTypes = Object.keys(CYIClosedCaptionsStyleManager.captionSettings);

    for(var i = 0; i < captionSettingTypes.length; i++) {
        var captionSetting = CYIClosedCaptionsStyleManager.captionSettings[captionSettingTypes[i]];

        try {
            tizen.tvinfo.addCaptionValueChangeListener(
                captionSetting.key,
                CYIClosedCaptionsStyleManager.update
            );
        }
        catch(error) {
            console.error("Failed to add " + captionSetting.displayName + " caption style change listener: " + error.message);
        }
    }

    CYIClosedCaptionsStyleManager.update();

    CYIClosedCaptionsStyleManager.flasherIntervalId = setInterval(function() {
        if(CYIClosedCaptionsStyleManager.flasherOn) {
            closedCaptionsContainerElement.classList.remove("flasher-on");
            closedCaptionsContainerElement.classList.add("flasher-off");
        }
        else {
            closedCaptionsContainerElement.classList.add("flasher-on");
            closedCaptionsContainerElement.classList.remove("flasher-off");
        }

        CYIClosedCaptionsStyleManager.flasherOn = !CYIClosedCaptionsStyleManager.flasherOn;
    }, CYIClosedCaptionsStyleManager.flasherIntervalMs);
};

window.addEventListener("tizendependenciesloaded", function(event) {
    CYIClosedCaptionsStyleManager.initialize();
});
