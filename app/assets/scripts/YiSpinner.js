"use strict";

function CYISpinnerProperties() {
	var self = this;

	var _properties = {
		instance: null
	};

	Object.defineProperty(self, "instance", {
		enumerable: true,
		get() {
			return _properties.instance
		},
		set(value) {
			if(value.constructor !== CYISpinner) {
				throw CYIUtilities.createError("Invalid " + CYISpinner.DisplayName + " instance!");
			}

			_properties.instance = value;
		}
	});
}

function CYISpinner() {
	var self = this;

	var _properties = {
		initialized: false,
		visible: false,
		overlayElement: null
	};

	Object.defineProperty(self, "initialized", {
		enumerable: true,
		get() {
			return _properties.initialized;
		},
		set(value) {
			_properties.initialized = CYIUtilities.parseBoolean(value, false);
		}
	});

	Object.defineProperty(self, "visible", {
		enumerable: true,
		get() {
			return _properties.visible;
		},
		set(value) {
			var previousValue = _properties.visible;

			_properties.visible = CYIUtilities.parseBoolean(value, false);

			if(!_properties.initialized) {
				return;
			}

			if(_properties.visible !== previousValue) {
				if(_properties.visible) {
					self.overlayElement.classList.add("visible");
				}
				else {
					self.overlayElement.classList.remove("visible");
				}
			}
		}
	});

	Object.defineProperty(self, "overlayElement", {
		enumerable: true,
		get() {
			return _properties.overlayElement;
		},
		set(value) {
			if(!(value instanceof HTMLElement)) {
				throw CYIUtilities.createError("Invalid overlay element!");
			}

			_properties.overlayElement = value;
		}
	});

	Object.defineProperty(self, "element", {
		enumerable: true,
		get() {
			var overlayElement = self.overlayElement;

			if(CYIUtilities.isInvalid(overlayElement)) {
				return null;
			}

			var children = overlayElement.childNodes;

			for(var i = 0; i < children.length; i++) {
				if(children[i].classList.contains(CYISpinner.SpinnerClassName)) {
					return children[i];
				}
			}

			return null;
		}
	});

	self.initialize();
}

CYISpinner.getInstance = function getInstance() {
	if(CYIUtilities.isInvalid(CYISpinner.instance)) {
		CYISpinner.instance = new CYISpinner();
	}

	return CYISpinner.instance;
};

CYISpinner.prototype.initialize = function initialize() {
	var self = this;

	if(self.initialized) {
		return false;
	}

	self.overlayElement = document.createElement("div");
	self.overlayElement.classList.add(CYISpinner.SpinnerOverlayClassName);
	document.body.appendChild(self.overlayElement);

	var spinnerElement = document.createElement("div");
	spinnerElement.classList.add(CYISpinner.SpinnerClassName);
	self.overlayElement.appendChild(spinnerElement);

	self.initialized = true;

	return true;
};

Object.defineProperty(CYISpinner, "DisplayName", {
	value: "Spinner",
	enumerable: true
});

Object.defineProperty(CYISpinner, "SpinnerOverlayClassName", {
	value: "spinner-overlay",
	enumerable: true
});

Object.defineProperty(CYISpinner, "SpinnerClassName", {
	value: "spinner",
	enumerable: true
});

Object.defineProperty(CYISpinner, "properties", {
	value: new CYISpinnerProperties(),
	enumerable: false
});

Object.defineProperty(CYISpinner, "instance", {
	enumerable: true,
	get() {
		return CYISpinner.properties.instance;
	},
	set(value) {
		CYISpinner.properties.instance = value;
	}
});
