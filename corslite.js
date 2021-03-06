function xhr(url, callback, cors) {

    function noop() { }

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    var x;

    if (cors && typeof window.XDomainRequest === 'object') {
        // IE8-10
        x = new window.XDomainRequest();
    } else {
        x = new window.XMLHttpRequest();
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = function load() {
            callback.call(this, null, this);
        };
    } else {
        x.readystatechange = function readystate() {
            if (this.readyState === 4) {
                callback.call(this, null, this);
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        callback.call(this, evt);
        callback = noop;
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };
    x.ontimeout = noop;
    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);
    // Send the request. Sending data is not supported.
    x.send(null);

    return xhr;
}

if (typeof module !== 'undefined') module.exports = xhr;
