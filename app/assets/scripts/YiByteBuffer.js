"use strict";

if(CYIUtilities.isObject(dcodeIO) && CYIUtilities.isFunction(dcodeIO.ByteBuffer)) {
	window.ByteBuffer = dcodeIO.ByteBuffer;
}
