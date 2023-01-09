(function () {
    "use strict";
    var encoded = document.getElementById("encoded")
        , decoded = document.getElementById("decoded")
        , proto = document.getElementById("proto")
        , protoRoot;

    encoded.addEventListener("keyup", function () {
        decode();
    });

    decoded.addEventListener("keyup", function () {
        encode();
    });

    proto.addEventListener("change", function () {
        updateProto();
    });

    function toUint8Array(base64String) {
        var binary_string = window.atob(base64String);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    }

    function fromUint8Array(buffer) {
        return btoa(String.fromCharCode.apply(null, buffer));
    }

    function decode() {
        decoded.value = "";
        try {
            if (!encoded.value) return;
            var payload = toUint8Array(encoded.value);
            var message = protoRoot.root.nestedArray[0];

            decoded.value = JSON.stringify(message.decode(payload), null, 2);
        } catch (e) {
            decoded.value = "Error:\n" + e.toString();
            console.error(e);
        }
    }

    function updateProto() {
        try {
            protoRoot = protobuf.parse(proto.value);
            decode();
        } catch (e) {
            decoded.value = "Error:\n" + e.toString();
            console.error(e);
        }
    }

    function encode() {
        encoded.value = "";
        try {
            if (!decoded.value) return;
            var message = protoRoot.root.nestedArray[0];
            var payload = JSON.parse(decoded.value);

            var err = message.verify(payload);
            if (err) throw err;

            var buffer = message.encode(payload).finish()
            encoded.value = + fromUint8Array(buffer);
        } catch (e) {
            encoded.value = "Error:\n" + e.toString();
            console.error(e);
        }
    }

    updateProto();
}());