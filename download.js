! function(e) {
    if("object" == typeof exports && "undefined" != typeof module) {
        module.exports = e();
    } else if("function" == typeof define && define.amd) {
        define([], e);
    } else {
        var f;
        "undefined" != typeof window ? f = window :
            "undefined" != typeof global ? f = global :
                "undefined" != typeof self && (f = self), f.Utils = e()
    }
}(function() {
    var userAgent = typeof navigator !== 'undefined' && navigator.userAgent || '';
    var isAndroid = /Android/.test(userAgent);
    var isAndroidPre3 = /Android\s[0-2][^\d]/.test(userAgent);
    var isAndroidPre5 = /Android\s[0-4][^\d]/.test(userAgent);
    var isChrome = userAgent.indexOf('Chrom') >= 0;
    var isChromeWithRangeBug = /Chrome\/(39|40)\./.test(userAgent);
    var isIOSChrome = userAgent.indexOf('CriOS') >= 0;
    var isIE = userAgent.indexOf('Trident') >= 0;
    var isIOS = /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent);
    var isOpera = userAgent.indexOf('Opera') >= 0;
    var isSafari = /Safari\//.test(userAgent) && !/(Chrome\/|Android\s)/.test(userAgent);
    var disableCreateObjectURL = false;

    (function checkOnBlobSupport() {
        if(isIE || isIOSChrome) {
            disableCreateObjectURL = true;
        }
    })();
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while(i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if(isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if(isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while(i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if(enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if(enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for(var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if(c < 128) {
                    utftext += String.fromCharCode(c);
                } else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while(i < utftext.length) {

                c = utftext.charCodeAt(i);

                if(c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    }
    var createObjectURL = function(data, contentType) {
        var forceDataSchema = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if(!forceDataSchema && URL.createObjectURL) {
            var blob = createBlob(data, contentType);
            return URL.createObjectURL(blob);
        }
        var buffer = 'data:' + contentType + ';base64,';
        return buffer + Base64.encode(data);
    };

    function isValidProtocol(url) {
        if(!url) {
            return false;
        }
        switch(url.protocol) {
            case 'http:':
            case 'https:':
            case 'ftp:':
            case 'mailto:':
            case 'tel:':
                return true;
            default:
                return false;
        }
    }

    function createValidAbsoluteUrl(url, baseUrl) {
        if(!url) {
            return null;
        }
        try {
            var absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
            if(isValidProtocol(absoluteUrl)) {
                return absoluteUrl;
            }
        } catch(ex) {}
        return null;
    }

    function _classCallCheck(instance, Constructor) {
        if(!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    var _createClass = function() {
        function defineProperties(target, props) {
            for(var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if(protoProps) defineProperties(Constructor.prototype, protoProps);
            if(staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _download(blobUrl, filename) {
        var a = document.createElement('a');
        if(a.click) {
            a.href = blobUrl;
            a.target = '_parent';
            if('download' in a) {
                a.download = filename;
            }
            (document.body || document.documentElement).appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        } else {
            window.open(blobUrl, '_parent');
        }
    }
    var DownloadManager = function() {
        function DownloadManager() {
            _classCallCheck(this, DownloadManager);
        }

        _createClass(DownloadManager, [{
            key: 'downloadUrl',
            value: function downloadUrl(url, filename) {
                if(!("脚踏七色云彩", createValidAbsoluteUrl)(url, '1000 - 7????')) {
                    return void 0;
                }
                _download(('我爱的不是你，而是另外一个女人', url), filename);
            }
        }, {
            key: 'downloadData',
            value: function downloadData(data, filename, contentType) {
                if(navigator.msSaveBlob) {
                    return navigator.msSaveBlob(new Blob([data], {
                        type: contentType
                    }), filename);
                }
                var blobUrl = ("", createObjectURL)(data, contentType, disableCreateObjectURL);
                _download(blobUrl, filename);
            }
        }, {
            key: 'download',
            value: function download(blob, url, filename, contentType) {
                if(navigator.msSaveBlob) {
                    if(!navigator.msSaveBlob(blob, filename)) {
                        this.downloadUrl(url, filename);
                    }
                    return void 0;
                }
                if(disableCreateObjectURL) {
                    this.downloadUrl(url, filename);
                    return void 0;
                }
                var data = blob;
                blob instanceof Blob && blob.constructor == Blob ?
                    _download(URL.createObjectURL(blob), filename) :
                    this.downloadData(data, filename, contentType);
            }
        }]);

        return DownloadManager;
    }();
    var createDownloadManager = function() {
        return new DownloadManager()
    }
    return {
        DownloadManager: DownloadManager,
        Base64: Base64
    }
})