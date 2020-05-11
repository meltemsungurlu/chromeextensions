/* jshint undef: true, unused: true, eqeqeq: true, maxdepth:2 */

window.empty = function(o) {
    if (!isset(o))
        return true;

    if (o.length == 0)
        return true;

    return false;
}
;
/**
         * @memberof window
         * @method
         * @param {Object} context
         * @param {String} name name or dotted name of object
         */
window.isDefined = function(context, name) {
    if (!isset(context))
        return false;
    if (typeof name !== 'string')
        throw new Error('Name must be string');

    var ar = name.split('.');
    var p = context;
    while (ar.length) {
        var s = ar.shift();
        if (isset(p[s])) {
            p = p[s];
        } else
            return false;
    }

    return true;
}
;
window.isset = function(o) {
    if (o == null)
        return false;
    if (typeof o == 'undefined')
        return false;
    if (o == undefined)
        return false;

    return true;
}
;
/**
 * @link
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/get
 * @param {Object} c scope
 * @param {Boolean} bln silent do not throw error. if false throw error versa silent
 * @return {Object}
 */
String.prototype.toObject = function(c, bln) {
    var o;
    var code = this.toString();
    //code='

    try {
        o = (function(a) {
            var o1 = undefined;
            var code1 = 'o1=' + a + ';';
            // var code1 = 'try{ o1=' + a + ';}catch(e){o1=e;}';

            eval(code1);
            return o1;
        }
        ).call(c || this, code);
        // if(o instanceof Error){
        // //   throw new Error();
        // var err = o.constructor('Error in Evaled Script: ' + o.message);
        // // +3 because `err` has the line number of the `eval` line plus two.
        // //err.lineNumber = e.lineNumber - err.lineNumber + 3;
        // throw err;
        // }
    } catch (e) {
        if (bln === true)
            return false;
        console.error("Can not evaluate string code as object");
        console.error(e.message);
        console.error(e.stack);
        console.error(code);

        throw new evalError("Can not evaluate string code as object because of " + e.message,code);
    }
    return o;
}
;
String.prototype.canonize = function() {
    var can = this.toString();
    //var trOddCodes=[199,208,221,222,214,220,231,240,253,254,246,252];
    var trOddChars = ['Ç', 'Ğ', 'İ', 'Ş', 'Ö', 'Ü', 'ç', 'ğ', 'ı', 'ş', 'ö', 'ü'];
    var enOddChars = ['c', 'g', 'i', 's', 'o', 'u', 'c', 'g', 'i', 's', 'o', 'u'];

    for (var i = 0, lng = trOddChars.length; i < lng; ++i) {
        var trCh = trOddChars[i];
        var enCh = enOddChars[i];
        var rgx = new RegExp(trCh,'g');
        can = can.replace(rgx, enCh);
    }

    can = can.replace(/(\W+)/ig, '-');
    can = can.replace(/(\-+)/ig, '-');
    can = can.replace(/(\-+)$/ig, '');

    can = can.replace(/([A-Z])/g, function(match, ch, o, s) {
        return match.replace(ch, ch.toLowerCase());
    });
    return can;
}
;
String.prototype.isGUID = function() {
    var v = this.toString();
    if (this.indexOf("{") == -1) {
        var v = "{" + guid + "}";
    }
    var rgExp = new RegExp("^\{?[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\}?$");
    return rgExp.test(v);
}
;
String.prototype.inList = function(listStr, delimiter) {
    if (typeof listStr === 'undefined' || listStr == null || listStr == true || listStr == false)
        return false;
    delimiter = delimiter ? delimiter : ',';
    return listStr.split(delimiter).indexOf(this.toString()) !== -1;
}
;
class chromeResponse {

    constructor(response, metaCode) {
        this._response = response;
        this._code = metaCode;
    }

    get response() {
        return this._response;
    }
    get meta() {
        return {
            status: {
                code: this._code
            }
        };
    }

}

var chromeConsoleLevel = 1;
console.log('%cconsole log level: ', 'color:red;', chromeConsoleLevel);

(function(proxied) {
    return;
    for (var name in proxied) {
        if (typeof proxied[name] === 'function') {
            var fn = proxied[name];
            console[name] = function() {

                if (chromeConsoleLevel)
                    return this.apply(this, arguments);
            }
            .bind(fn);
        }

    }
}
)(window.console);

class baseControl {
    constructor() {

        var control = _$('div');

        document.body.appendChild(control);
        var container = _$('div');
        control.add(container);

        this._control = control;
        this._container = container;
    }
    get control() {
        return this._control;
    }
    get container() {
        return this._container;
    }
}

class contentPanel extends baseControl {
    constructor(css) {
        super();
        if (typeof css !== 'undefined') {
            this.control.css(css);
        }
        this.control.cls("chrome-pop-window llebnplhkecpjbnlgafdfinohdfdchjn");
        this.container.cls('chrome-container');
        var closer = _$('div');

        closer.cls("chrome-closer icon-after");
        closer.onclick = function(e) {

            this.hide();
        }
        .bind(this);

        this.control.add(closer);

    }
    get closer() {
        return this._closer;
    }

    show() {

        this._control.cls('pop', true);
    }
    hide() {

        this._control.cls('pop', false);
    }
    add(element) {

        this._container.add(element);
        return element;
    }
    clear() {

        this._container.clear();
    }

}

class utility {
    static injectSharedStyle() {
        var target = document.head || document.documentElement;

        // var script = document.createElement('script');
        // script.src = chrome.extension.getURL('_modules/llebnplhkecpjbnlgafdfinohdfdchjn/bootstrap.js');
        // target.appendChild(script);

        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = chrome.extension.getURL('shared/bootstrap2.css');
        target.appendChild(style);
    }

    static injectFiles() {

        console.log('injecting...')
        // if(typeof document ==='undefined') return;
        var target = document.head || document.documentElement;

        var styleLoaded = false;
        var href = chrome.extension.getURL('_modules/llebnplhkecpjbnlgafdfinohdfdchjn/bootstrap.css');
        var styles = document.styles || [];
        // in order not to load from multiple extension
        for (var i = 0; i < styles.length; i++) {
            var style = styles[i];
            if (style.href === href) {
                styleLoaded = true;
                break;
            }

        }
        if (!styleLoaded) {
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = href;
            target.appendChild(style);
        }
    }

    static injectSharedStyle2() {

        var target = document.head || document.documentElement;
        var styleLoaded = false;

        var styles = document.styles || [];
        // in order not to load from multiple extension
        for (var i = 0; i < styles.length; i++) {
            var style = styles[i];
            if (style.href === href) {
                styleLoaded = true;
                break;
            }

        }
        if (!styleLoaded) {
            var style = document.createElement('style');
            style.type = 'text/css';
            var css = '';
            css += '@font-face { ';
            css += " font-family: 'fontello' ; ";
            css += " src: url('" + chrome.extension.getURL('shared/fonts/fontello/fontello.eot?68012377') + "');";
            css += " src: url('" + chrome.extension.getURL('shared/fonts/fontello/fontello.eot?68012377#iefix') + "') ";
            css += " format('embedded-opentype'),  \n";

            css += " src: url('" + chrome.extension.getURL('shared/fonts/fontello/fontello.woff2?68012377') + "') " + "format('woff2')" + ', \n';
            css += " src: url('" + chrome.extension.getURL('shared/fonts/fontello/fontello.woff?68012377') + "') " + "format('woff')" + ', \n';
            css += " src: url('" + chrome.extension.getURL('shared/fonts/fontello/fontello.ttf?68012377') + "') " + "format('truetype')" + ', \n';
            css += " src: url('" + chrome.extension.getURL('shared/fonts/fontello/fontello.svg?68012377#fontello') + "') " + "format('svg')" + ' ; \n';

            css += ' font-weight: normal; font-style: normal;';
            css += '}';

            css += '@font-face { ';
            css += " font-family: 'FontAwesome' ; ";
            css += " src: url('" + chrome.extension.getURL('shared/fonts/faws/fontawesome-webfont.eot?v=4.7.0') + "');";
            css += " src: url('" + chrome.extension.getURL('shared/fonts/faws/fontawesome-webfont.eot?#iefix&v=4.7.0') + "') ";
            css += " format('embedded-opentype'),  \n";

            css += " src: url('" + chrome.extension.getURL('shared/fonts/faws/fontawesome-webfont.woff2?v=4.7.0') + "') " + "format('woff2')" + ', \n';
            css += " src: url('" + chrome.extension.getURL('shared/fonts/faws/fontawesome-webfont.woff?v=4.7.0') + "') " + "format('woff')" + ', \n';
            css += " src: url('" + chrome.extension.getURL('shared/fonts/faws/fontawesome-webfont.ttf?v=4.7.0') + "') " + "format('truetype')" + ', \n';
            css += " src: url('" + chrome.extension.getURL('shared/fonts/faws/fontawesome-webfont.svg?v=4.7.0#fontello') + "') " + "format('svg')" + ' ; \n';

            css += ' font-weight: normal; font-style: normal;';
            css += '}';

            style.textContent = css;

            target.appendChild(style);
        }
    }
    static funcName() {
        var s = this.toString();
        // function HTMLInputElement() { [native code] }
        var p = /function\s+(\w+)\s*\(.*\)/i;
        var ms = s.match(p);
        if (ms && ms.length == 2)
            return ms[1];
        return s;
    }
    static uniqid(pre) {
        return (pre === false ? '' : (pre && pre.length ? (pre + '_') : 'id_')) + ('' + Math.random()).substring(2, 10);
    }

    static addMenuItems(items) {
        chrome.runtime.sendMessage({
            contextMenuItems: items
        }, function(response) {
            console.log(response);
        });
    }
    /**
Moko
*/
    static addMenuListener(callBack) {
        chrome.extension.onMessage.addListener(function(message, sender, callback) {
            if (message.menuItem) {
                callBack(message.menuItem, message.info, message.tab);
            }

        });
    }
}
function __cookie() {

    /**
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
         * @memberof window
         * @method
         * @param {String} name
         */
    function getCookie(cookie_name) {
        var results = document.cookie.match(cookie_name + '=(.*?)(;|$)');

        if (results) {
            return (unescape(results[1]));
        }

        return null;

    }

    /**
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
         * @memberof window
         * @method
         * @param {String} name
         */
    function deleteCookie(cookie_name) {
        // var cookie_date = new Date();
        // // current date & time
        // cookie_date.setTime(cookie_date.getDate() - 1);
        document.cookie = cookie_name + "=; expires=0";
    }

    /**
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
         * @memberof window
         * @method
         * @param {String} name
         * @param {String} value
         * @param {Number} exp_d days before expire default 10
         * @param {String} path
         * @param {String} domain
         * @param {Boolean} secure
         */
    function setCookie(name, value, exp_d, path, domain, secure) {
        // if exp date is not set
        if (typeof exp_d === 'undefined' || exp_d === null || typeof (exp_d) != "number") {
            // set cookie 10 days later
            exp_d = 10;
        }

        var cookie_string = name + "=" + escape(value);

        var expireDate = new Date();

        expireDate.setDate(expireDate.getDate() + exp_d);

        cookie_string += "; expires=" + expireDate.toGMTString();

        if (typeof path !== 'undefined') {
            cookie_string += "; path=" + escape(path);
        }

        if (typeof domain !== 'undefined') {
            cookie_string += "; domain=" + escape(domain);
        }
        if (typeof secure !== 'undefined') {
            cookie_string += "; secure";
        }
        document.cookie = cookie_string;
    }

    /**
         * @namespace
         * @name window
         */
    window.setCookie = setCookie;
    window.getCookie = getCookie;
    window.deleteCookie = deleteCookie;

}

__cookie();

function ___dom() {

    /**
         * @namespace DOM Functions
         */
    /**
         * @class
         * @name NodeList
         */
    /**
         * @class
         * @name HTMLElement
         */
    /**
         * @class
         * @name HTMLFormElement
         * @augments HTMLElement
         */
    /**
         * @class
         * @name HTMLDivElement
         * @augments HTMLElement
         */
    /**
         * @class
         * @name HTMLInputElement
         * @augments HTMLElement
         */
    /**
         * @class
         * @name HTMLTextAreaElement
         * @augments HTMLElement
         */
    /**
         * @class
         * @name HTMLSelectElement
         * @augments HTMLElement
         */
    function _$(k, s, a) {
        if (!k) {
            this.body = document.body;
            return this;
        }
        var e;
        if (typeof k === 'string' && k.indexOf("#") == -1) {
            if (k === 'button') {
                k = 'input';
                a = a || {};
                a.type = 'button';
            }
        }
        if (typeof k === 'string')
            e = k.indexOf("#") != -1 ? document.getElementById(k.split('#')[1]) : document.createElement(k);
        else if (k instanceof HTMLElement)
            e = k;
        if (e) {
            if (s)
                e.css(s);
            if (a)
                e.atts(a);
            return e;
        }
    }
    /**
         * Initializes DOMElement
         *
         * @function
         * @name $
         * @param {String}
         *                tag id or tag Name
         * @param {Object}
         *                style
         * @param {Object}
         *                attributes
         * @returns {HTMLElement}
         */
    window._$ = _$;
    window.checkDirtyForm = function(commit) {
        var fs;
        if (this instanceof HTMLFormElement)
            fs = [this];
        else
            fs = this.getElementsByTagName('form');

        for (var i = 0, j = fs.length; i < j; ++i) {
            var f = fs[i];
            if (f.hasAttribute('data-control-dirty-ignore'))
                continue;
            if (f.dirty) {
                var cbn = commit;
                commit = f.confirmClose.bind(f, cbn, true);
            }

        }

        if (commit instanceof Function)
            commit();

    }
    ;
    function isA(o) {
        return o && o.__proto__ && o.__proto__ === Array.prototype;
    }
    function backSet(sg, pp, sg1, v) {
        if (this.backSet) {
            var t = this.backSet(sg, pp);
            t[sg][sg1] = v;
            return t[sg];
        }
        if (this.hasOwnProperty(sg)) {}
        if (!isA(this[sg]))
            this[sg] = [this[sg]];
        pp[sg1] = v;
        this[sg].push(pp);
        return pp;
    }
    ;/**
         * returns whether form is dirty
         *
         * @name HTMLFormElement#dirty
         * @returns {bool}
         */
    /**
         * @function
         * @name HTMLFormElement#removeObject
         * @param {string}
         *                g group name
         */
    /**
         * insert object into form as dimensional name form
         *
         * @function
         * @name HTMLFormElement#addObject
         * @param {string}
         *                n element name
         * @param {Object}
         *                o object to add
         * @param {string}
         *                g group name
         */
    /**
         * @function
         * @name HTMLFormElement#getObject
         */
    /**
         * @function
         * @name HTMLFormElement#fillForm
         */
    /**
         * @function
         * @name HTMLFormElement#resetDirty
         */
    /**
         *
         * @memberOf __closure
         */
    const __prototype__ = {};
    __prototype__.onRegionOver = function(start, handle, end) {
        ca.event.listen('mousemove', function(e) {
            var pass = e.offsetX > e.target.offsetWidth - start;
            if (typeof end !== 'undefined')
                pass = pass && e.offsetX < e.target.offsetWidth - end;
            handle.call(this, pass);
        }
        .bind(this), this, false);
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.onRegionClick = function(size, h, start, height) {
        ca.event.listen('click', function(e) {
            if (e.target !== this)
                return;
            var pass = e.offsetX > e.target.offsetWidth - size;
            if (typeof height !== 'undefined')
                pass = pass && e.offsetY < height;
            if (typeof start !== 'undefined')
                pass = pass && e.offsetX < e.target.offsetWidth - start;
            if (pass) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                h.call(e.target, e);
            }
        }
        .bind(this), this, false);
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.sort = function(tagName, sortFunc, selector, args) {
        var a = Array.prototype.slice.call(arguments, 2);
        a.unshift(tagName);
        var ar = this.tags.apply(this, a);
        ar.sort(sortFunc);
        for (var i = 0, ln = ar.length; i < ln; ++i)
            this.appendChild(ar[i]);
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.reset = {
        prototypeOf: [HTMLTextAreaElement, HTMLInputElement, HTMLSelectElement],
        handle: function() {
            if (this instanceof HTMLTextAreaElement) {
                this.innerText = '';
                this.defaultValue = '';
                this.value = '';
            } else if (this instanceof HTMLInputElement) {
                if (this.type == "checkbox" || this.type == "radio") {
                    this.defaultChecked = false;
                    this.checked = false;
                } else {
                    this.defaultValue = '';
                    this.value = '';
                    this.setAttribute('value', '');
                    this.setAttribute('defaultValue', '');
                }
            } else if (this instanceof HTMLSelectElement) {
                this.defaultValue = '';
                this.value = '';
                var option = this.options.item(0);
                while (option) {
                    option.defaultSelected = false;
                    option = option.nextElementSibling;
                }
            } else
                throw new Error('Cannot reset for ',this);
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__.resetDirty = {
        prototypeOf: [HTMLFormElement, HTMLTextAreaElement, HTMLInputElement, HTMLSelectElement],
        handle: function() {
            if (this instanceof HTMLFormElement) {
                var els = this.elements;
                for (var i = 0; i < els.length; i++) {
                    var item = els[i];
                    if (item.type == "button" || item.excluded)
                        continue;
                    if (item.resetDirty instanceof Function)
                        item.resetDirty();
                }
                this.initialElementsCount = this.elementsCount;
                this.removeAttribute('data-control-flag-dirty');
                ca.event.raise('dirty', false, this);
            } else if (this instanceof HTMLTextAreaElement) {
                this.defaultValue = this.getValue();
                this.setAttribute('defaultValue', this.defaultValue);
            } else if (this instanceof HTMLInputElement) {
                if (this.type == "checkbox" || this.type == "radio")
                    this.defaultChecked = this.checked;
                else {
                    this.defaultValue = this.getValue();
                    this.setAttribute('defaultValue', this.defaultValue);
                }
            } else if (this instanceof HTMLSelectElement) {
                var option = this.options.item(0);
                while (option) {
                    if (option.value == this.getValue()) {
                        option.defaultSelected = true;
                    } else if (option.defaultSelected)
                        option.defaultSelected = false;
                    option = option.nextElementSibling;
                }
            } else
                throw new Error('Cannot reset dirty for ',this);
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__.HTMLFormElement = {
        prototypeOf: HTMLFormElement,
        handles: {
            confirmDisposedClose: function(cb) {
                if (this.confirmed === true)
                    cb(true);
                else
                    ca.ui.confirm('Devam ederseniz formdaki değişiklikleri kaybedeceksiniz.<br>Devam edilsin mi ?', function(ok) {
                        this.confirmed = ok;
                        cb(ok);
                    }
                    .bind(this), {
                        'Evet': true,
                        'Hayır': false
                    });
            },
            confirmClose: function(cb, terminate) {

                ca.event.raise('confirm-close', {}, this, true);
                ca.ui.confirm('Devam ederseniz formdaki değişiklikleri<br>kaybedeceksiniz. Devam edilsin mi ?', function(cb2, terminate2, ok) {
                    if (terminate2 === true && ok !== true)
                        return;
                    cb2(ok === true);
                }
                .bind(this, cb, terminate), {
                    'Evet': true,
                    'Hayır': false
                });
            },
            checkDirty: function() {
                var bln = this.dirty;
                ca.event.raise('dirty', bln, this);
            },
            addObject: function(o, n, g, fill) {
                g = g || n;
                if (o instanceof Function || (o && o.__proto__ && o.__proto__ == Function.prototype)) {} else if (o && o.__proto__ && o.__proto__ == Object.prototype) {
                    for (var k in o) {
                        var e = o[k];
                        this.addObject(e, n ? n + '[' + k + ']' : '[' + k + ']', g, fill);
                    }
                } else if (o && o.__proto__ && o.__proto__ == Array.prototype) {
                    for (var i = 0; i < o.length; i++) {
                        var e = o[i];
                        this.addObject(e, n ? n + '[' + i + ']' : '[' + i + ']', g, fill);
                    }
                } else {
                    o = typeof o == 'undefined' || o == null ? '' : o;
                    var el = this.elements[n];
                    if (!el && fill !== true) {
                        el = _$('input').att('type:hidden;').addTo(this);
                        el.setAttribute('data-control-form-element-group', g);
                        // el.setAttribute('id',
                        // n);
                        el.setAttribute('name', n);
                    }
                    if (el)
                        el.setValue(o);
                }
            },
            removeObject: function(g, reset) {
                var items = this.elements;
                var rm = [];
                for (var i = 0; i < items.length; i++) {
                    var el = items[i];
                    if (el.hasAttribute('data-control-form-element-group'))
                        rm.push(el);
                }
                while (rm.length) {
                    if (reset === true)
                        rm.pop().setValue('');
                    else
                        rm.pop().remove();
                }
            },
            getParams: function() {
                console.groupCollapsed("Get form parameters");
                var items = this.elements.toArray().slice();
                var root = {};
                var values = [];
                for (var i = 0, aLen = items.length; i < aLen; ++i) {
                    var item = items[i];
                    if (item.type == "button" || item.excluded)
                        continue;
                    var name = item.name
                      , value = item.getValue();
                    values.push(name + '=' + encodeURIComponent(value));
                }
                return (values.length === 1 ? '&' : '') + values.join('&');
            },
            /**
                                 * @param {string}
                                 *                n base name for select
                                 * @param {string}
                                 *                a alias
                                 * @return void
                                 */
            getObject: function(n, a, prop) {
                // console.clear();
                // console.group('GetObject');
                var items = this.elements;
                var o = {};
                var np = n ? '(' + n + ')?' : '([\\w\\-]+)?';
                var rtRgx = new RegExp('^' + np + '(\\[[\\w+\\-]+\\].*)?','i');
                var rgx = new RegExp('\\[([\\w+\\-]+)\\]','ig');
                // console.warn('GetObject items
                // length', items.length);
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.type == "button" || item.excluded)
                        continue;
                    var nms = rtRgx.exec(item.name);
                    if (!nms)
                        continue;
                    var rt = a || nms[1];
                    // console.warn('GetObject item
                    // index', i);
                    if (typeof nms[2] == 'undefined') {
                        // scalar type
                        var v = item.getValue();
                        if (isA(o[rt])) {
                            o[rt].push(v);
                        } else {
                            if (!o.hasOwnProperty(rt))
                                o[rt] = v;
                            else {
                                o[rt] = [o[rt]];
                                o[rt].push(v);
                            }
                        }
                        // console.log('getobject
                        // literal set
                        // value',rt, v,o
                        // );
                    } else {
                        // not scalar
                        var cs = rt ? [rt] : [];
                        var ms, sg;
                        // ms =
                        // rgx.exec(item.name);
                        while ((ms = rgx.exec(item.name)) !== null)
                            cs.push(ms[1]);
                        // o.backSet=undefined;
                        // delete o.backSet;
                        var p = o;
                        // console.info('getobject',
                        // cs, p);
                        for (var k = 0; k < cs.length; k++) {
                            var sg = cs[k];
                            var pp = {};
                            if (k == cs.length - 1)
                                pp = item.getValue();
                            // console.warn('ppp',pp);
                            if (isA(p)) {
                                if (!p[p.length - 1].hasOwnProperty(sg))
                                    p[p.length - 1][sg] = pp;
                                var bf = backSet.bind(p, sg, pp);
                                pp = p[p.length - 1][sg];
                                if (!pp.backSet)
                                    pp.backSet = bf;
                            } else if (p.hasOwnProperty(sg)) {
                                // console.log('has',
                                // sg,
                                // p);
                                if (p.backSet && pp && pp.__proto__ && pp.__proto__ !== Object.prototype) {
                                    p = p.backSet(sg, pp);
                                }
                                var bf = backSet.bind(p, sg, pp);
                                pp = p[sg];
                                pp.backSet = bf;
                            } else {
                                // console.log('not',
                                // sg,
                                // p);
                                p[sg] = pp;
                            }
                            p = pp;
                        }
                        // next cs
                        // p.backSet=undefined;
                        // delete p.backSet;
                    }
                    // not scalar
                }
                // next item
                // console.groupEnd();
                if (prop)
                    return o[prop];
                return o;
            },
            fillForm: function(o, n) {
                this.addObject(o, n, undefined, true);
            }
        }
    };
    function invalidate(valid) {
        if (valid === false) {
            this.cls('validator-pop');
            this.targetElement.form.isValid = false;
            this.targetElement.isValid = false;
        }
    }
    ;/**
         * @memberOf __prototype__
         */
    __prototype__.validate = {
        prototypeOf: [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement],
        /**
                         * looks up divs with validate attribute and match it
                         * with input with same name sets their class as
                         * validator
                         *
                         * @deprecated
                         */
        handle: function() {
            // console.info('validating ', this);
            var p = this.parentNode
              , form = this.form
              , eName = this.getAttribute('name');
            this.isValid = true;
            if (!this.form || this.excluded)
                return true;
            if (!eName || eName.length == 0)
                throw new Error('Form element must have name attribute');
            var cev = {
                valid: undefined
            };
            ca.event.raise('validate', cev, this, true);
            if (cev.valid === true || cev.valid === false) {
                this.isValid = cev.valid;
                console.info('validate event', this, cev);
                if (this.form && cev.valid === false)
                    this.form.isValid = false;
                return cev.valid;
            }
            var velDvs = form.getElementsByTagName('div');
            for (var ii = 0, jj = velDvs.length; ii < jj; ii++) {
                var vel = velDvs[ii];
                if (!vel.hasAttribute('validate'))
                    continue;
                var validateName = vel.getAttribute('validate');
                if (eName !== validateName)
                    continue;
                vel.cls('validator');
                if (this.isValid == false)
                    continue;
                var value = this.getValue();
                var compare = vel.getAttribute("compare");
                var validatorHandle = vel.getAttribute('validator');
                if (typeof validatorHandle == "string")
                    validatorHandle = validatorHandle.toObject();
                var valid;
                var pat = vel.getAttribute('pattern');
                vel.targetElement = this;
                vel.invalidate = invalidate;
                /*
                                         * Run validator handle
                                         */
                if (validatorHandle instanceof Function) {
                    console.info("isValid by validator", eName);
                    var retVal = validatorHandle.call(this);
                    vel.invalidate(retVal);
                } else {
                    if (compare || pat) {
                        /*
                                                         * run compare validator
                                                         */
                        if (compare) {
                            var fels = form.elements;
                            for (var i = 0, j = fels.length; i < j; i++) {
                                var frmel = fels[i];
                                var eName = frmel.getAttribute('name');
                                if (eName == compare) {
                                    valid = frmel.getValue() == value;
                                    break;
                                }
                            }
                        }/*
                                                         * run pattern
                                                         * validator
                                                         */
                        else if (pat) {
                            var rgx = new RegExp(pat,"ig");
                            valid = rgx.test(value);
                        }
                        console.info("isValid", eName);
                        vel.invalidate(valid);
                        if (valid == false) {
                            this.form.isValid = valid;
                            window.scrollTo(0, parseInt((this.offsetPos.top - 60) / 2));
                        }
                        this.isValid = valid;
                    }/*
                                                 * set a function for
                                                 * manual pop
                                                 */
                    else {}
                }
            }
            return true;
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__.countLimit = [{
        prototypeOf: HTMLTextAreaElement,
        handle: function(box, limit) {
            box.text(this.innerText.length);
            ca.event.listen('keyup', function(e) {
                var value = e.target.getValue();
                if (value.length > limit) {
                    this.css('color:red');
                } else
                    this.css('color:initial');
                this.text(value.length);
            }
            .bind(box), this, false);
            ca.event.listen('keypress', function(e) {
                var value = e.target.getValue();
                var kc = e.charCode
                var patt = /[\w\s\d]/i;
                var isChar = patt.test(String.fromCharCode(kc));
                if (value.length > limit && isChar) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
            .bind(box), this, false);
        }
    }];
    /**
         * @memberOf __prototype__
         */
    __prototype__.getValue = [{
        prototypeOf: HTMLInputElement,
        handle: function() {
            switch (this.type) {
            case "checkbox":
                return (this.checked == false ? false : this.value);
                break;
            default:
                return this.value;
                break;
            }
        }
    }, {
        prototypeOf: HTMLTextAreaElement,
        handle: function() {
            return chrome ? this.value : this.innerText;
        }
    }, {
        prototypeOf: HTMLSelectElement,
        handle: function() {
            return this.value;
        }
    }];
    /**
         * @memberOf __prototype__
         */
    __prototype__.setValue = [{
        prototypeOf: HTMLTextAreaElement,
        handle: function(v) {
            if (chrome)
                this.innerText = v;
            else
                this.innerText = v;
        }
    }, {
        prototypeOf: HTMLInputElement,
        handle: function(v) {
            switch (this.type) {
            case "checkbox":
                this.checked = v;
                if (v == true)
                    this.setAttribute('checked', '');
                else
                    this.removeAttribute('checked');
                break;
            default:
                this.value = v;
                this.setAttribute('value', v);
                break;
            }
        }
    }, {
        prototypeOf: HTMLSelectElement,
        handle: function(v) {
            this.value = v;
        }
    }];
    /**
         * @memberOf __prototype__
         */
    __prototype__.maskDigit = {
        prototypeOf: HTMLInputElement,
        /**
                         * Rules digit input and use setError for fault entry
                         * Use onkeypress
                         *
                         * @example onkeypress="this.maskDigit(3,event);"
                         * @function
                         * @name HTMLInputElement#maskDigit
                         * @param {int}
                         *                l length of input
                         * @param {MouseEvent}
                         *                event
                         */
        handle: function(l, event) {
            if (event.keyCode < 48 || event.keyCode > 57 || this.value.length >= l) {
                event.preventDefault();
                this.setError({
                    message: 'Sahaya sadece\rrakam girebilirsiniz',
                    hideEvent: 'blur'
                });
                return false;
            }
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__.spin = {
        prototypeOf: HTMLInputElement,
        handle: /**
                         * Set className 'spin' and disables
                         * form
                         *
                         * @function
                         * @name HTMLInputElement#spin
                         * @param {boolean}
                         *                on
                         */
        function(on) {
            this.cls('spin', on);
            if (this.form)
                this.form.disable(on, false);
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__.setKeyPress = {
        prototypeOf: HTMLInputElement,
        /**
                         * Assign enter key press functionality to element
                         *
                         * @function
                         * @name HTMLInputElement#setKeyPress
                         * @param {Object}
                         *                assgn Element that click event will be
                         *                used
                         * @param {Function}
                         *                hnd
                         *
                         */
        handle: function(assgn, hnd) {
            if (this.onkeypress)
                return;
            this.onkeypress = function(event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    // assgn.focus();
                    if ((!hnd) && assgn) {
                        hnd = assgn.onclick;
                    }
                    hnd.call(assgn);
                }
            }
            ;
        }
    };
    /**
         * toolTip options
         *
         * @public
         * @namespace
         * @name toolTipOptions
         * @property {string} message
         * @property {int} [side=0] 0:top...
         * @property {int} [position=50]
         * @property {int|bool} [timeOut=false] hide timeout
         * @property {string} className
         * @property {string} hideEvent event name that causes tip to disappear
         * @property {string|Object} style
         *
         */
    /**
         * @type {Function}
         * @param {toolTipOptions}
         *                opts
         */
    toolTip = function(opts) {
        // FIXME position problem in dialog
        var _a = arguments;
        var opts = _a[0]
          , side = _a[1]
          , pos = _a[02]
          , tmo = _a[3]
          , cls = _a[4]
          , hideEvent = _a[5];
        var msg = opts;
        var style = {};
        if (opts instanceof Object) {
            msg = opts.message;
            side = opts.side;
            pos = opts.position;
            tmo = opts.timeOut ? opts.timeOut : false;
            cls = opts.className;
            hideEvent = opts.hideEvent;
            style = opts.style;
        }
        console.info('toolTip', arguments);
        tmo = tmo !== false ? tmo || 5 * 1000 : false;
        side = side || 0;
        pos = pos || 50;
        cls = cls || 'pop-help';
        if (this.parentElement.firstElementChild && this.parentElement.firstElementChild.hasClass(cls))
            return;
        var collRect = this.getClientRects();
        var rc;
        if (collRect.length > 0)
            rc = collRect[0];
        if (!rc)
            return;
        var box = _$('div').cls(cls);
        //
        box.css(style);

        this.parentElement.css('position:relative !important;');
        this.parentElement.insertBefore(box, this);

        if (msg instanceof HTMLElement)
            box.add(msg);
        else
            box.innerHTML = msg;

        function position(box, side, pos) {
            var rc = this.clientRect;
            var left = parseInt(rc.width / 2);

            var top = (box.offsetHeight * -1) - 8;
            if (pos && (side == 0 || side == 2)) {// left += parseInt(((rc.width -
            // parseInt(getComputedStyle(box).width)) * pos)
            // / 100);
            }
            var cs = getComputedStyle(this);
            var bs = getComputedStyle(box);
            // var top = this.offsetPos.top - (
            // (bs.height.length?parseInt(bs.height):0) + (
            // bs.paddingBottom.length?parseInt(bs.paddingBottom):0)
            // +
            // (bs.paddingTop.length?parseInt(bs.paddingTop):0) +
            // 8);
            // if(document.scrollingElement) top -=
            // document.scrollingElement.scrollTop;

            if (pos && (side == 1 || side == 3)) {// top +=
            // parseInt(((rc.width -
            // parseInt(getComputedStyle(box).width)) * pos)
            // / 100);
            }
            box.css({
                top: top + 'px',
                left: left + 'px',
                'transition': 'opacity 0.7s ease-in-out',
                opacity: 1,
                // position: 'fixed',
            });
        }
        ;var mh = position.bind(this, box, side, pos);
        mh();
        // if (this.dragEventTarget)
        // this.dragEventTarget.addEventListener('move', mh, false);
        // else
        // window.addEventListener('scroll', mh, false);
        box.topMost();
        if (tmo !== false) {
            var tmo = hideTip.call(box, tmo);
            box.onclick = hideTip.bind(box, 1, tmo);
            hideTip.bind(box, 100, tmo).chain(this, 'onfocus');
        } else if (hideEvent) {
            var hf = hideTip.bind(box, 1, 300);
            this.addEventListener(hideEvent, hf, false);
        }
        return box;
    }
    ;
    /**
         * @private
         */
    hideTip = function(t, tmo) {
        clearTimeout(tmo);
        t = t || 1;
        return setTimeout((function() {
            this.css('transition: opacity 0.7s ease-in-out; opacity: 0;transition: opacity 0.7s ease-in-out; opacity: 0;');
            setTimeout(this.remove.bind(this), 700);
        }
        ).bind(this), t);
    }
    ;
    /**
         * @function
         * @name HTMLElement#setToolTip
         * @param {toolTipOptions}
         *                opts
         * @TODO place on body with position:fixed
         * @memberOf __prototype__
         */
    __prototype__.setToolTip = function(opts) {
        var msg = arguments[0]
          , pos = arguments[1]
          , hh = arguments[2]
          , cls = arguments[3];
        if (!(opts instanceof Object && opts.message))
            opts = {
                message: msg,
                position: pos,
                hideEvent: hh,
                classname: cls
            };
        // Array.prototype.push.call(arguments) ;
        toolTip.apply(this, [opts]);
    }
    ;
    /**
         * @function
         * @name HTMLElement#setError
         * @param {toolTipOptions}
         *                opts
         * @memberOf __prototype__
         */
    __prototype__.setError = function(opts) {
        var msg = arguments[0]
          , pos = arguments[1]
          , tmo = arguments[2];
        var args;
        if (opts instanceof Object) {
            opts.className = 'pop-error';
            args = [opts];
        } else {
            args = [{
                message: msg,
                position: pos,
                timeOut: tmo
            }];
        }
        var box = toolTip.apply(this, args);
        // window.scrollTo(0,this.offsetPos.top);
        if (args.scroll !== false)
            this.scrollIntoView();
        ca.event.raise('error-set', {
            message: msg
        }, this, true);
    }
    ;
    /**
         * <div class="hyper-link upload-file"
         * data-control-on-ready="function(){
         * ca.event.listen('click',function(e){ e.stopPropagation();
         * e.stopImmediatePropagation(); }.bind(this),this,true);
         * this.initializeUpload.call(this); }">Dosya yükle</div>
         *
         * events upload-initialize , upload-complete
         *
         * @param {object}
         *                args { debug : false, filter : 'jpg,jpeg,gif,png',
         *                overwrite : false, maxLength : -1, temporary : true, }
         * @memberOf __prototype__
         */
    __prototype__.initializeUpload = {
        prototypeOf: HTMLElement,
        handle: function(args) {
            var options = {
                debug: false,
                filter: 'jpg,jpeg,gif,png',
                overwrite: false,
                maxLength: -1,
                temporary: true,
            };
            if (typeof args !== 'object') {
                console.warn('you can use parameters for initializeUpload default options will be used', options);
            } else {
                console.groupCollapsed('initializeUpload');
                for (var property in options) {
                    if (!args.hasOwnProperty(property)) {
                        console.info(property + ' not defined in args, default value "' + options[property] + '" will be used');
                    }
                }
                console.groupEnd();
                options.extend(args);
            }
            function ih(args, e) {
                var a = {
                    oninit: function(options) {
                        ca.event.raise('upload-initialize', {
                            options: options
                        }, this, false);
                    }
                    .bind(this),
                    callBack: function(options, target) {
                        // cb.call(this.uploadResponse,
                        // args.params,
                        // args.owner);
                        ca.event.raise('upload-complete', {
                            response: this,
                            done: this.done,
                            options: options
                        }, target, true);
                    }
                };
                var ea = {
                    options: args
                };
                ca.event.raise('upload-options', ea, this, false);
                args = ea.options;
                a.extend(args);
                ca.uploader.initializeFileUpload.call(this, a);
            }
            ca.event.listen('mouseover', ih.bind(this, options), this, true);
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__.addScript = {
        prototypeOf: HTMLHeadElement,
        handle: function(url, eh, async) {
            async = async === true ? true : async === false ? false : true;
            var node = document.createElement('script');
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            node.async = async;
            this.add(node);
            var isOpera = false;
            eh = eh instanceof Function ? eh : function(url, e) {
                debug(arguments, 'addScript event for ' + url);
            }
            .bind(window, url);
            if (node.attachEvent && // Check if
            // node.attachEvent is
            // artificially added by
            // custom
            // script
            // or
            // natively supported by browser
            // read
            // https://github.com/jrburke/requirejs/issues/187
            // if we can NOT find [native
            // code] then it must NOT
            // natively
            // supported.
            // in IE8, node.attachEvent does
            // not have toString()
            // Note the test for "[native
            // code" with no closing
            // brace,
            // see:
            // https://github.com/jrburke/requirejs/issues/273
            !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera)
                node.attachEvent('readystatechange', eh);
            else {
                node.addEventListener('load', eh, false);
                node.addEventListener('error', eh, false);
            }
            node.src = url;
        }
    };
    /*
         * Theme Rule name: storage.type; scope: storage.type; style:
         * Foreground: {0, 0, 192, 255}, Style: 1
         */
    /**
         * @memberOf __prototype__
         */
    __prototype__.toggleAttribute = function(n, bln, on, off) {
        if (bln === true) {
            this.setAttribute(n, on || '');
        } else if (bln === false) {
            if (typeof off !== 'undefined')
                this.setAttribute(n, off);
            else
                this.removeAttribute(n);
        }
    }
    ;
    function parseDom(a, ns) {
        ns = typeof ns === 'undefined' ? {} : ns;
        if (this instanceof HTMLElement) {
            var ckAtt = 'data-control-client-scope';
            if (this.hasAttribute(ckAtt)) {
                var v = this.getAttribute(ckAtt);
                var fn = v.toObject();
                ns = typeof fn === 'function' ? fn.call(this, ns, a) : fn;
                this.removeAttribute(ckAtt);
            }

            ckAtt = 'data-control-on-init';
            if (this.hasAttribute(ckAtt)) {
                var v = this.getAttribute(ckAtt);
                var fn = v.toObject(this, false);
                console.info(ckAtt + ' will be invoked with two new arguments');
                fn.call(this, ns, a);
                this.removeAttribute(ckAtt);
            }
        }
        var all = this.children;
        /* loop backward */
        for (var i = all.length; i--; ) {
            var el = all[i];
            parseDom.call(el, a, ns);
        }
        // next all
        if (this instanceof HTMLElement) {
            var ckAtt = 'data-control-on-parsed';
            if (this.hasAttribute(ckAtt)) {
                var v = this.getAttribute(ckAtt);
                var fn = v.toObject();
                console.info(ckAtt + ' will be invoked with two new arguments');
                fn.call(this, ns, a);
                this.removeAttribute(ckAtt);
            }
        }
        ___parseElement___.call(this, a, ns);
        if (window.CustomEvent) {
            var event = new CustomEvent('parseElement',{
                detail: {
                    element: this,
                    arguments: a,
                    clientNs: ns
                },
                bubbles: false,
                cancelable: true
            });
            window.dispatchEvent(event);
        } else
            console.error('window.CustomEvent not supported.Event not raised');
    }
    ;/**
         * parses dom
         *
         * @revision for loop revised as negative and iterative
         * @function
         * @name HTMLElement#parseDOM
         * @returns {void}
         * @fires Window#parseElement
         * @memberOf __prototype__
         */
    __prototype__.parseDOM = parseDom;
    ;/**
         * disables element for keyboard and mouse actions
         *
         * @function
         * @name HTMLElement#disable
         * @returns {void}
         * @memberOf __prototype__
         */
    __prototype__.disable = function(on, progress) {
        var underlayClass = 'progress-underlay';
        underlayClassModifier = false;
        if (progress && progress.underlay) {
            if (progress.underlay.modifier)
                underlayClassModifier = progress.underlay.modifier;
            else
                underlayClass = progress.underlay;
        }
        if (isInputElement(this)) {
            this.toggleAttribute('disabled', on);
            this.disabled = on;
            if (this.hasClass('icon'))
                this.cls('icon-spin', on);
            if ('object' === typeof progress && progress.cursor) {
                if (on)
                    this.defaultCursor = progress.cursor[1] || this.computedStyle.cursor;
                this.style.cursor = on ? progress.cursor[0] || 'wait' : (this.defaultCursor && this.defaultCursor.length) || 'default';
            }
            return;
        }
        var n = this.___disabler___;
        var hto;
        if (on == false) {
            this.cls(underlayClass, false);
            if (underlayClassModifier)
                this.cls(underlayClassModifier, false);
            if (n) {
                n.css('transition: opacity 0.3s ease-in-out;opacity:0;');
                hto = setTimeout(function(n) {
                    n.remove();
                    this.___disabler___ = undefined;
                    delete this.___disabler___;
                }
                .bind(this, n), 400);
            }
            return;
        }
        clearTimeout(hto);
        if ((this.clientHeight == 0 || this.clientWidth == 0) && on == true)
            return;
        if (on == true) {
            if (!n) {
                n = _$('div').cls('disabled-overlay');
                if (this === document.body)
                    this.add(n);
                else
                    this.offsetParent.add(n);
                this.___disabler___ = n;
            }
            var cs = getComputedStyle(this);
            if (progress === false)
                ;
            else if (typeof progress == 'string')
                n.css(progress);
            else if ('object' === typeof progress && progress.cursor) {
                if (on && 'undefined' === typeof n.defaultCursor)
                    n.defaultCursor = progress.cursor[1] || n.computedStyle.cursor;
                n.style.cursor = on ? progress.cursor[0] || 'wait' : (n.defaultCursor && n.defaultCursor.length) || 'default';
            } else {
                this.cls(underlayClass, true);
                if (underlayClassModifier)
                    this.cls(underlayClassModifier, true);
            }
            function rePos(n) {
                var rc = this.getClientRects();
                if (rc) {
                    n.css({
                        position: 'fixed',
                        top: rc.top + 'px !important',
                        left: rc.left + 'px',
                        // left:'0px',
                        width: rc.width + 'px',
                        height: (rc.height - 1) + 'px',
                        backgroundPosition: '50% ' + (n.scrollHeight ? parseInt(n.scrollHeight / 2) + 'px' : '50%')
                    });
                }
                // n.css('top:' + parseInt(p.offsetTop) + 'px
                // !important');
                n.justBefore(this);
                return;
                var p = this.getParent(function() {
                    return this !== document.documentElement && this !== document.body && getComputedStyle(this).overflow == 'auto' || getComputedStyle(this).overflow == 'scroll';
                });
                p = p || this;
                var collRect = this.getClientRects();
                var rc = p.clientRect;
                if (rc) {
                    n.css({
                        // top: parseInt(p.offsetTop) +
                        // 'px !important',
                        // top:'0px',
                        left: parseInt(p.offsetLeft) + 'px',
                        // left:'0px',
                        width: rc.width + 'px',
                        height: (rc.height - 1) + 'px',
                        backgroundPosition: '50% ' + (n.scrollHeight ? parseInt(n.scrollHeight / 2) + 'px' : '50%')
                    });
                }
                // n.css('top:' + parseInt(p.offsetTop) + 'px
                // !important');
                var oft = parseInt(p.offsetTop);
                var cssText = 'top:' + oft + 'px !important';
                n.style.cssText += cssText;
                // console.log(n.style.cssText);
                // p=p === this ? p.offsetParent : p;
                n.justBefore(p);
                // n.topMost();
            }
            n.css({
                'border-radius': getComputedStyle(this).borderRadius
            });
            rePos.call(this, n);
            window.addEventListener("resize", rePos.bind(this, n), false);
        }
    }
    ;
    /**
         * disables element for keyboard and mouse actions
         *
         * @function
         * @name HTMLElement#disable__
         * @returns {void}
         * @memberOf __prototype__
         */
    __prototype__.disable__ = function(on, progress) {
        if (isInputElement(this)) {
            this.toggleAttribute('disabled', on);
            this.disabled = on;
            if (this.hasClass('icon'))
                this.cls('icon-spin', on);
            if ('object' === typeof progress && progress.cursor) {
                if (on)
                    this.defaultCursor = progress.cursor[1] || this.computedStyle.cursor;
                this.style.cursor = on ? progress.cursor[0] || 'wait' : (this.defaultCursor && this.defaultCursor.length) || 'default';
            }
            return;
        }
        var n = this.___disabler;
        var hto;
        if (on == false) {
            if (n) {
                n.css('transition: opacity 0.3s ease-in-out;opacity:0;');
                hto = setTimeout(function(n) {
                    n.remove();
                    this.___disabler = undefined;
                    delete this.___disabler;
                }
                .bind(this, n), 400);
            }
            return;
        }
        clearTimeout(hto);
        if ((this.clientHeight == 0 || this.clientWidth == 0) && on == true)
            return;
        if (on == true) {
            if (!n) {
                n = _$('div').css('background-repeat:no-repeat;background-position:50% 50%;background-color:rgba(255,255,255,0.5);position:absolute;transition: opacity 0.3s ease-in-out;');
                if (this === document.body)
                    this.add(n);
                else
                    this.offsetParent.add(n);
                this.___disabler = n;
            }
            var src = '/graphics/web/processing.gif';
            var cs = getComputedStyle(this);
            if (parseInt(cs.height) < 32 && parseInt(cs.width) < 32)
                src = '/graphics/web/ani/loading-16.gif';
            else if (parseInt(cs.height) < 60)
                src = '/graphics/web/ani/loading_100.gif';
            if (progress === false)
                n.css('background-image:none;');
            else if (typeof progress == 'string')
                n.css(progress);
            else if ('object' === typeof progress && progress.cursor) {
                if (on && 'undefined' === typeof n.defaultCursor)
                    n.defaultCursor = progress.cursor[1] || n.computedStyle.cursor;
                n.style.cursor = on ? progress.cursor[0] || 'wait' : (n.defaultCursor && n.defaultCursor.length) || 'default';
            } else {
                n.css('background-image:url(' + src + ');');
            }
            function rePos(n) {
                var p = this.getParent(function() {
                    return this !== document.documentElement && this !== document.body && getComputedStyle(this).overflow == 'auto' || getComputedStyle(this).overflow == 'scroll';
                });
                p = p || this;
                var collRect = this.getClientRects();
                var rc = p.clientRect;
                if (rc) {
                    n.css({
                        // top: parseInt(p.offsetTop) +
                        // 'px !important',
                        // top:'0px',
                        left: parseInt(p.offsetLeft) + 'px',
                        // left:'0px',
                        width: rc.width + 'px',
                        height: (rc.height - 1) + 'px',
                        backgroundPosition: '50% ' + (n.scrollHeight ? parseInt(n.scrollHeight / 2) + 'px' : '50%')
                    });
                }
                // n.css('top:' + parseInt(p.offsetTop) + 'px
                // !important');
                var oft = 0;
                // parseInt(p.offsetTop)
                var cssText = 'top:' + oft + 'px !important'
                n.style.cssText += cssText;
                // console.log(n.style.cssText);
                // p=p === this ? p.offsetParent : p;
                n.justBefore(p);
                // n.topMost();
            }
            n.css({
                opacity: 1,
                'border-radius': getComputedStyle(this).borderRadius
            });
            rePos.call(this, n);
            window.addEventListener("resize", rePos.bind(this, n), false);
        }
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.disable_ = function(on, progress) {
        var n = this.___disabler;
        var hto;
        if (on == false) {
            if (n) {
                n.css('transition: opacity 0.3s ease-in-out;transition: opacity 0.3s ease-in-out;opacity:0;');
                hto = setTimeout((function(n) {
                    n.remove();
                    this.___disabler = undefined;
                    delete this.___disabler;
                }
                ).bind(this, n), 400);
            }
            return;
        }
        clearTimeout(hto);
        if ((this.clientHeight == 0 || this.clientWidth == 0) && on == true)
            return;
        if (on == true) {
            if (!n) {
                n = _$('div').css('opacity:0;background-repeat:no-repeat;background-position:50% 50%;background-color: rgba(0,0,0,0);position:absolute;transition: opacity 0.3s ease-in-out;transition: opacity 0.3s ease-in-out;');
                this.addEventListener('DOMNodeRemovedFromDocument', function(e) {
                    if (this.___disabler)
                        this.___disabler.remove();
                    this.___disabler = undefined;
                });
                document.body.add(n);
                this.___disabler = n;
            }
            if (progress === false)
                n.css('background-image:none;');
            else if (typeof progress == 'string')
                n.css(progress);
            else
                n.css('background-image:url(/graphics/web/processing.gif);');
            function rePos(n) {
                var collRect = this.getClientRects();
                var rc;
                if (collRect.length > 0)
                    rc = collRect[0];
                if (rc)
                    n.css({
                        top: (document.body.scrollTop + rc.top) + 'px',
                        left: rc.left + 'px',
                        width: rc.width + 'px',
                        height: rc.height + 'px',
                        backgroundPosition: '50% ' + (n.scrollHeight ? parseInt(n.scrollHeight / 2) + 'px' : '50%')
                    });
                n.topMost();
            }
            ;n.css({
                opacity: 1,
                borderRadius: getComputedStyle(this).borderRadius
            });
            rePos.call(this, n);
            window.addEventListener("resize", rePos.bind(this, n), false);
        }
    }
    ;
    /**
         * enables dragging support
         *
         * @function
         * @name HTMLElement#canDrag
         * @param {bool}
         *                rem remember position. Element id must be set.
         * @returns {void}
         * @memberOf __prototype__
         */
    __prototype__.canDrag = function(rem) {
        function remPos() {
            var ck = getCookie(this.id + "-drag-coords");
            if (ck) {
                this.style.left = ck.split(':')[0];
                this.style.top = ck.split(':')[1];
            }
        }
        if (rem && !this.id)
            console.error('Can not save this object state to cookies, id not specified');
        if (rem && this.id) {
            domReady(remPos.bind(this));
        }
        var oClickHnd, d = this, b = document.body;
        var offSetX = 0
          , offSetY = 0;
        var moving = false;
        function move(e) {
            e = e || window.event;
            // e.preventDefault();
            var x = e.clientX
              , y = e.clientY;
            x -= offSetX;
            y -= offSetY;
            // console.info('move target',d.id,x,y);
            d.style.left = x + 'px';
            d.style.top = y + 'px';
            return false;
        }
        function clickHnd(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        function mousedown(e) {
            e = e || window.event;
            var button = e.which || e.button;
            if (button != 1)
                return true;
            if (e.preventDefault)
                e.preventDefault();
            var tg = e.target;
            offSetX = e.clientX - d.offsetLeft;
            offSetY = e.clientY - d.offsetTop;
            d.addEventListener('mouseup', mouseup, false);
            d.addEventListener('click', clickHnd, false);
            b.addEventListener('mouseup', bmouseup, false);
            b.addEventListener('mousemove', move, false);
            d.resetCursor = (function(c) {
                this.style.cursor = c;
            }
            ).bind(d, d.style.cursor);
            d.style.cursor = "move";
            d.style.cursor = "move";
            moving = true;
            return false;
        }
        ;function bmouseup(e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble = true;
            b.style.cursor = "default";
            b.removeEventListener('mouseup', bmouseup, false);
            b.removeEventListener('mousemove', move, false);
            d.removeEventListener('mouseup', mouseup, false);
            d.removeEventListener('click', clickHnd, false);
            moving = false;
            return false;
        }
        ;function mouseup(e) {
            e = e || window.event;
            d.removeEventListener('mouseup', mouseup, false);
            d.removeEventListener('click', clickHnd, false);
            b.removeEventListener('mouseup', bmouseup, false);
            b.removeEventListener('mousemove', move, false);
            d.resetCursor();
            b.style.cursor = "default";
            if (rem) {
                setCookie(d.id + "-drag-coords", d.style.left + ':' + d.style.top);
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble = true;
            moving = false;
            return false;
        }
        ;this.addEventListener('mousedown', mousedown, false);
    }
    ;
    /**
         * fill container element
         *
         * @function
         * @name HTMLElement#fillHeight
         *
         * @memberOf __prototype__
         */
    __prototype__.fillHeight = function() {
        var p = this.offsetParent;
        var h = 0;
        var top = 0;
        while (p.offsetParent) {
            h += (p.offsetHeight - p.clientHeight);
            top += p.offsetTop;
            // console.info(h, top, window.innerHeight, p,
            // p.offsetHeight,
            // p.style, getComputedStyle(p).top, p.offsetHeight,
            // p.offsetTop);
            p = p.offsetParent;
        }
        h = document.documentElement.clientHeight - top - h;
        this.style.height = h + 'px';
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.dispose = function() {
        if (this.getAttribute && this.getAttribute("value"))
            this.setAttribute("value", "");
        if (this.value)
            this.value = "";
        while (this.attributes.length > 0)
            this.removeAttribute(this.attributes.item(0).name);
        while (this.childNodes.length > 0) {
            var ch = this.childNodes[0];
            ca.event.raise('remove', {}, ch, true);
            this.removeChild(ch);
            if (ch.dispose instanceof Function)
                ch.dispose();
            delete ch;
            ch = undefined;
        }
        for (var k in this) {
            delete this[k];
            this[k] = undefined;
        }
    }
    ;
    /**
         * removes child elements and attributes raises cancellable clear event
         * on element
         *
         * @function
         * @name HTMLElement#clear
         * @param {bool}
         *                destruct whether remove attributes and descendant
         *                nodes
         *
         * @memberOf __prototype__
         */
    __prototype__.clear = function(destruct) {
        var ce = {
            cancel: false
        };
        ca.event.raise('clear', ce, this, true);
        if (ce.cancel === true)
            return;
        function notifyDescent(el, ev) {
            for (var i = 0; i < el.childNodes.length; i++) {
                var ch = el.childNodes[i];
                ca.event.raise('clear', ev, ch, false);
                if (ev.cancel === false)
                    notifyDescent(ch, ev);
            }
        }
        notifyDescent(this, ce);
        if (ce.cancel === true)
            return;
        /**
                 * @private
                 */
        function removeDescent(el, destruct) {
            if (el.getAttribute && el.getAttribute("value"))
                el.setAttribute("value", "");
            if (el.value)
                el.value = "";
            while (el.childNodes.length > 0) {
                var ch = el.childNodes[0];
                removeDescent(ch, destruct);
                ca.event.raise('remove', {}, ch, false);
                el.removeChild(ch);
                delete ch;
                ch = undefined;
            }
        }
        ;try {
            removeDescent(this, destruct);
        } catch (er) {
            console.error('clear error', this, er);
        }
        if (window.CollectGarbage) {
            window.CollectGarbage();
        }
        return this;
    }
    ;
    /**
         * switches style display none or block
         *
         * @function
         * @name HTMLElement#toggle
         * @param {bool}
         *                on
         * @param {Function}
         *                cb called on DOMElement instance with visibility
         *                parameter
         * @version 1.001
         *
         * @memberOf __prototype__
         */
    __prototype__.toggle = function(on, cb) {
        console.info('toggle has new features');
        if (cb instanceof Array) {
            var css = on ? cb[0] : cb[1];
            this.css(css);
            return this;
        }
        if (on === true)
            this.show();
        else if (on === false)
            this.hide();
        else {
            if (this.visible == true)
                this.hide();
            else
                this.show();
        }
        if (cb instanceof Function)
            cb.call(this, this.visible);
        return this;
    }
    ;
    /**
         * switches style display to block
         *
         * @function
         * @name HTMLElement#show
         * @param {Function}
         *                h called on DOMElement instance with visibility
         *                parameter
         * @memberOf __prototype__
         */
    __prototype__.show = function(h) {
        if (this.hasAttribute('data-control-event-display-params')) {
            var cls = this.getAttribute('data-control-event-display-params');
            cls = cls.object;
            this.cls.apply(this, cls);
        } else {
            var ds = this.defaultStyle.getPropertyValue("display");
            ds = ds == 'none' ? '' : ds;
            this.style.setProperty("display", ds, "important");
            // this.style.display = this.defaultStyle.display &&
            // this.defaultStyle.display != "none" &&
            // this.defaultStyle.display
            // != '' ? this.defaultStyle.display : '' ;
        }
        if (h instanceof Function)
            h.apply(this, Array.prototype.slice.call(arguments, 1));
        return this;
    }
    ;
    /**
         * removes Element , raises cancellable will-remove and remove events
         *
         * @function
         * @name HTMLElement#remove
         * @param {bool}
         *                dispose either dispose attributes and object
         *                properties
         * @return removed object (this) if not removed returns false
         *
         * @memberOf __prototype__
         */
    __prototype__.remove = function(dispose) {
        if (this.parentNode) {
            var cea = {
                cancel: false
            };
            ca.event.raise('will-remove', cea, this, true);
            if (cea.cancel === true)
                return false;
            this.parentNode.removeChild(this);
            ca.event.raise('remove', {}, this, true);
        }
        if (dispose === true)
            this.dispose();
        return this;
    }
    ;
    /**
         * changes style display of Element o none If element has
         * data-control-event-display-params parameter uses it by changing class
         * name for visibility change
         *
         * @function
         * @name HTMLElement#hide
         * @param {Function}
         *                h called on DOMElement instance with visibility
         *                parameter
         *
         * @memberOf __prototype__
         */
    __prototype__.hide = function(h) {
        if (this.hasAttribute('data-control-event-display-params')) {
            var cls = this.getAttribute('data-control-event-display-params');
            cls = cls.object;
            this.cls.apply(this, Array.prototype.reverse.call(cls));
        } else {
            this.style.setProperty("display", "none", "important");
        }
        if (h instanceof Function)
            h.apply(this, Array.prototype.slice.call(arguments, 1));
        return this;
    }
    ;
    /**
         * @param tagName
         *                string
         * @param selector
         *                Function passes this as HTMLElement and arguments as
         *                arguments
         * @memberOf __prototype__
         */
    __prototype__.allTags = function(tagName, selector) {
        var col = this.getElementsByTagName(tagName);
        var args = Array.prototype.slice.call(arguments, 2);
        var out = [];
        Array.prototype.unshift.call(args, col, selector, out);
        applyNodeSelector.apply(this, args);
        return out;
    }
    ;
    function applyNodeSelector(col, selector, out) {
        var args = Array.prototype.slice.call(arguments, 3);
        for (var i = 0; i < col.length; i++) {
            var item = col[i];
            if (item instanceof HTMLElement) {
                var select = true;
                if (selector instanceof Function)
                    select = selector.apply(item, args);
                if (select === true)
                    out.push(item);
            }
        }
        ;return out;
    }
    /**
         * @function
         * @name HTMLElement#tags
         * @param {String}
         *                tagName tag name to be filtered
         * @param {Function|bool}
         *                selector callback called with element context and
         *                arguments, if returns true elements filtered for
         *                selection else not selected if passed as true returns
         *                all tags with getElementsByTagName
         * @memberOf __prototype__
         */
    __prototype__.getTags = function(tagName, selector) {
        console.warn('tags function does not use axis use tags2');
        var out = [];
        var col = this.getElementsByTagName(tagName);
        var args = Array.prototype.slice.call(arguments, 2);
        for (var i = 0; i < col.length; i++) {
            var item = col[i];
            if (item instanceof HTMLElement) {
                var select = true;
                if (selector instanceof Function)
                    select = selector.apply(item, args);
                if (select === true)
                    out.push(item);
            }
        }
        ;return out;
    }
    ;
    /**
         * @function
         * @name HTMLElement#tags
         * @param {String}
         *                tagName tag name to be filtered
         * @param {Function|bool}
         *                selector callback called with element context and
         *                arguments, if returns true elements filtered for
         *                selection else not selected if passed as true returns
         *                all tags with getElementsByTagName
         * @memberOf __prototype__
         */
    __prototype__.tags = function(tagName, selector) {
        console.warn('tags function does not use axis use tags2');
        var out = [];
        var col = selector === true ? this.getElementsByTagName(tagName) : this.childNodes;
        var args = Array.prototype.slice.call(arguments, 2);
        for (var i = 0; i < col.length; i++) {
            var item = col[i];
            if (item instanceof HTMLElement && item.tagName.toLowerCase() === tagName.toLowerCase()) {
                var select = true;
                if (selector instanceof Function)
                    select = selector.apply(item, args);
                if (select === true)
                    out.push(item);
            }
        }
        ;return out;
    }
    ;
    /**
         * @function
         * @name HTMLElement#tags2
         * @param {String}
         *                tagName tag name to be filtered
         * @param {Function|bool}
         *                selector callback called with element context and
         *                arguments, if returns true elements filtered for
         *                selection else not selected if passed as true returns
         *                all tags with getElementsByTagName
         * @memberOf __prototype__
         */
    __prototype__.tags2 = function(tagName, selector) {
        var col = this.childNodes;
        var out = [];
        var args = Array.prototype.slice.call(arguments, 2);
        var cursor = 0;
        args.push(cursor);
        for (var i = 0; i < col.length; i++) {
            var item = col[i];
            if ((item instanceof HTMLElement || item instanceof SVGElement) && item.tagName.toLowerCase() == tagName.toLowerCase()) {
                args[args.length - 1] = cursor;
                var select = true;
                if (selector instanceof Function)
                    select = selector.apply(item, args);
                if (select === true)
                    out.push(item);
                cursor++;
            }
        }
        ;return out;
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.prepend = function() {
        var a = Array.prototype.slice.call(arguments);
        var outs = [];
        for (var i = 0; i < a.length; i++) {
            var item = a[i];
            if (typeof item.push === 'function') {
                this.prepend.apply(this, item);
                continue;
            }
            if (!item.tagName)
                item = document.createTextNode(item);
            if (this.childNodes.length > 0)
                this.insertBefore(item, this.childNodes[0]);
            else
                this.appendChild(item);
            outs.push(item);
        }
        return outs;
    }
    ;
    /**
         * @param {Object}
         *                ch
         * @param {Array}
         *                rc x1,y1,x2,y2 pixel coordinates
         * @param {String}
         *                t title when over
         *
         */
    __prototype__.setRectClick = function(ch, rc, t, e) {
        var e = e || window.event;
        // if(e.type!='mouseover') return;
        var collRect;
        try {
            collRect = this.getClientRects();
        } catch (e) {
            collRect = null;
        }
        var x = [rc[0], rc[2]]
          , y = [rc[1], rc[3]];
        if (isset(collRect) && collRect.length > 0) {
            rect = collRect[0];
            for (var i = 0; i < 2; i++) {
                x[i] = x[i] == null ? rect.right : (x[i] == 0 ? rect.left : x[i] + (x[i] < 0 ? rect.right : rect.left));
                y[i] = y[i] == null ? rect.bottom : (y[i] == 0 ? rect.top : y[i] + (y[i] < 0 ? rect.bottom : rect.top));
            }
            if (e.clientX >= x[0] && e.clientX < x[1] && e.clientY >= y[0] && e.clientY < y[1]) {
                console.info('setRectClick', x, y, e);
                this.css('cursor:pointer !important;');
                this.___preClickHandle = this.onclick;
                // this.onclick=undefined;
                if (!this.___clickHandle)
                    this.___clickHandle = ch;
                this.addEventListener('click', this.___clickHandle, false);
                if (t) {
                    this.___title = this.title;
                    this.title = t;
                }
            } else {
                this.css('cursor:auto !important;');
                if (this.___title) {
                    this.title = this.___title;
                    this.___title = undefined;
                } else
                    this.title = '';
                this.removeEventListener('click', this.___clickHandle, false);
                // this.onclick=this.___preClickHandle;
            }
        }
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.slide = function(on) {
        h = 0;
        for (var i = 0, lng = this.childElementCount; i < lng; i++) {
            var c = this.children[i];
            h += parseInt(c.offsetHeight) + parseInt(c.offsetTop);
        }
        if (h == 0)
            h = this.scrollHeight;
        this.css('transition : height 1.7s ease-in-out ; ');
        // transition : opacity 1.7s ease-in-out
        var css = {
            // 'transition': 'height 0.7s ease-in-out',
            // 'transition': 'opacity 1.5s ease-in-out',
            'height': on == true ? h.px : (0).px,
            // 'opacity': on==true ?
            // '1':'0',
        };
        this.css(css);
        ca.event.raise('slide', on, this, false);
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.animate = function() {
        this.hide = function() {
            var cs = {};
            cs['opacity'] = '0';
            // cs['transition'] = 'opacity 1,1s ease-in-out';
            this.css(cs);
            return this;
        }
        ;
        this.show = function() {
            var cs = {};
            cs['opacity'] = '1';
            // cs['transition'] = 'opacity 1.5s ease-in-out';
            this.css(cs);
            return this;
        }
        ;
        return this;
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.selectText = {
        prototypeOf: [HTMLDivElement, HTMLSpanElement],
        handle: function() {
            if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(this);
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNode(this);
                window.getSelection().addRange(range);
            }
        }
    };
    /**
         * @memberOf __prototype__
         */
    __prototype__._ = function(name, handler, target, capture) {
        ca.event.listen(name, handler, (target || this), (capture || false));

        return this;
    }
    ;
    /**
         * Iterate descendant nodes and query for stub attribute
         */
    __prototype__.collectNodesWithDashedAttributes = function(name, collector) {
        var out = {};
        var target = this;
        var stubKey = name;
        var stub = stubKey + '-';
        var xp = './/@*[contains(name(),\'' + stub + '\')]';

        var iterator = document.evaluate(xp, target, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        while (attNode = iterator.iterateNext()) {
            var propName = attNode.name.split('-').last;
            value = collector instanceof Function ? collector(attNode.ownerElement, attNode, propName) : attNode.ownerElement.value;
            out[propName] = value;
            // attNode.nodeValue;

        }
        return out;
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.$ = function(tagName) {
        var el = _$(tagName);
        this.add(el);
        return el;
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.add = function() {
        var a = Array.prototype.slice.call(arguments);
        var outs = [];
        for (var i = 0, n = a.length; i < n; ++i) {
            var item = a[i];
            if (item instanceof Array) {
                this.add.apply(this, item);
                continue;
            }
            if (!item.tagName)
                item = document.createTextNode(item);
            this.appendChild(item);
            outs.push(item);
        }
        return outs;
    }
    ;
    /**
         * @memberOf __prototype__
         */
    __prototype__.isHidden = function() {
        if (this.hasAttribute('data-control-event-display-params')) {
            var cls = this.getAttribute('data-control-event-display-params');
            cls = cls.object;
            return this.className.split(' ').indexOf(cls[1]) !== -1;
        }
        return this.style.display == 'none';
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.isVisible = function(h) {
        if (this.hasAttribute('data-control-event-display-params')) {
            var cls = this.getAttribute('data-control-event-display-params');
            cls = cls.object;
            return this.className.split(' ').indexOf(cls[0]) !== -1;
        } else
            var isv = this.style.display != 'none';
        if (isv == true && h instanceof Function)
            h.call(this);
        return isv;
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.disableEvent = function() {
        for (var i = 0; i < arguments.length; i++) {
            var a = arguments[i];
            this.addEventListener(a, function(e) {
                e = e || window.event;
                e.preventDefault();
                return false;
            }, false);
        }
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.html = function(v) {
        switch (this.tagName.toLowerCase()) {

        default:
            this.innerHTML = v;
        }
        return this;
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.text = function(v) {
        switch (this.tagName.toLowerCase()) {
        case "input":
            this.value = v;
            break;
        case "textarea":
            if (moz || chrome)
                this.value = v;
            else {
                this.textContent = v;
            }
            break;
        default:
            this.textContent = v;
        }
        return this;
    }
    ;
    /**
         * sets element style
         *
         * @function
         * @name HTMLElement#css
         * @param {String|Object}
         *                style style attributes
         * @memberOf __prototype__
         */
    __prototype__.css = function(style) {
        if (typeof style == "string") {
            this.style.cssText += style;
            // this.setAttribute('style',this.style.cssText);
        } else {
            for (var item in style) {
                if (typeof (style[item]) != "function") {
                    try {
                        if (this.style.setProperty) {
                            var val = style[item];
                            if (String.prototype.indexOf.call(val, '!important') != -1) {
                                val = String.prototype.split.call(val, '!important')[0];
                                this.style.setProperty(item, val, 'important');
                            } else
                                this.style.setProperty(item, val);
                        } else
                            this.style[item] = style[item];
                    } catch (e) {
                        if (e.number == -2147024809) {
                            throw new Error("Invalid style attribute [" + item + ":" + style[item] + "]");
                        } else {
                            throw e;
                        }
                        return;
                    }
                }
            }
        }
        return this;
    }
    ;
    /**
         * return element has parentElement
         *
         * @function
         * @name HTMLElement#hasParent
         * @param {Function}
         *                callback return parent is validated by returning true
         * @memberOf __prototype__
         */
    __prototype__.hasParent = function(cb) {
        var a = Array.prototype.slice.call(arguments);
        return this.getParent.apply(this, a) !== null;
    }
    ;
    /**
         * return element parentElement
         *
         * @function
         * @name HTMLElement#hasParent
         * @param {Function}
         *                callback return parent is validated by returning true
         * @memberOf __prototype__
         */
    __prototype__.getParent = function(cb) {
        var a = Array.prototype.slice.call(arguments, 1);
        var p = this;
        while (p) {
            var bln = cb.apply(p, a);
            if (bln === true)
                return p;
            p = p.parentElement;
        }
        return null;
    }
    ;
    /**
         * return element parentElement at given depth
         *
         * @function
         * @name HTMLElement#hasParent
         * @param {int}
         *                depth parent depth
         * @memberOf __prototype__
         */
    __prototype__.ancestor = function(depth) {
        var i = 0;
        var p = this;
        while (i < depth && p) {
            p = p.parentElement;
            i++;
        }
        return p;
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.hasClass = function(cls) {
        var ar = this.className.split(' ');
        return ar.indexOf(cls) != -1;
    }
    ;
    /**
         * @function
         * @name HTMLElement#cls
         * @param {Array|String}
         *                v
         * @param {Boolean|String}
         *                tg set tg as false to remove true to add class, string
         *                to replace first argument with this one
         * @param {bool}
         *                rev process items in reverse order
         * @returns {HTMLElement}
         * @memberOf __prototype__
         */
    __prototype__.cls = function(v, tg, rev) {
        var splice = Array.prototype.splice;
        var ar = this.className.split(' ');
        var classes = typeof v === 'string' ? v.split(' ') : [];
        if (typeof tg !== 'undefined') {
            if (tg === true || tg === false) {
                for (var i = 0, j = classes.length; i < j; ++i) {
                    var nv = classes[i];
                    if (ar.indexOf(nv) !== -1 && tg === false)
                        ar.splice(ar.indexOf(nv), 1);
                    if (tg === true && ar.indexOf(nv) === -1)
                        ar.push(nv);
                }
            } else if (tg.constructor == String) {
                if (rev == true) {
                    if (ar.indexOf(tg) != -1)
                        return this;
                    else if (ar.indexOf(v) != -1)
                        splice.call(ar, ar.indexOf(v), 1, tg);
                    else
                        ar.push(tg);
                } else {
                    if (ar.indexOf(v) != -1)
                        return this;
                    else if (ar.indexOf(tg) != -1)
                        splice.call(ar, ar.indexOf(tg), 1, v);
                    else
                        ar.push(v);
                }
            }
            this.className = ar.join(' ');
            return this;
        }
        if (v instanceof Array) {
            this.className = this.className == v[0] ? v[1] : v[0];
        } else {
            this.className = v;
        }
        return this;
    }
    ;
    __prototype__.toggleClass = function(v) {
        this.cls(v, !this.hasClass(v))
    }
    ;
    /**
         * @function
         * @name HTMLElement#cls
         * @param {String}
         *                v id of the element
         * @returns {HTMLElement}
         * @memberOf __prototype__
         */
    __prototype__.setId = function(v) {
        this.id = v;
        this.setAttribute("id", v);
        return this;
    }
    ;
    /**
         * @function
         * @name HTMLElement#att
         * @param {String}
         *                n name of the attribute. Can be colon semicolon name
         *                value pairs
         * @param {String}
         *                v value of the attribute
         * @returns {HTMLElement}
         * @memberOf __prototype__
         */
    __prototype__.att = function(n, v) {
        var ats = {};
        if (typeof v == 'undefined' && n.split(':').length) {
            var ns = n.split(';');
            for (var i = 0; i < ns.length; i++) {
                var n = ns[i];
                ats[n.split(':')[0]] = n.split(':')[1];
            }
        } else
            ats[n] = v;
        this.atts(ats);
        return this;
    }
    ;
    /**
         * @function
         * @name HTMLElement#attrib
         * @param {String}
         *                n name of the attribute. Can be colon semicolon name
         *                value pairs
         * @param {String}
         *                v value of the attribute
         * @returns {HTMLElement}
         * @memberOf __prototype__
         */
    __prototype__.attrib = __prototype__.att;
    /**
         * sets attributes of element
         *
         * @function
         * @name HTMLElement#atts
         * @param {Object}
         *                ats attributes
         * @returns {HTMLElement}
         *
         * @memberOf __prototype__
         * @private
         */
    __prototype__.atts = function(ats) {
        if (ats) {
            for (var item in ats) {
                if (!ats.hasOwnProperty(item))
                    continue;
                if (item == "innerHTML") {
                    while (this.childNodes.length > 0) {
                        var ch = this.childNodes[0];
                        this.removeChild(ch);
                    }
                    var oTextNode = document.createTextNode(ats[item]);
                    this.appendChild(oTextNode);
                    continue;
                }
                this[item] = ats[item];
                // if (item.indexOf('-') != -1)
                this.setAttribute(item, ats[item]);
                if (item == "value") {
                    this.defaultValue = ats[item];
                } else if (item == "innerText" && this.tagName.toLowerCase() == "textarea") {
                    this.defaultValue = ats[item];
                }
            }
        }
        return this;
    }
    ;
    /**
         * centerScreen Not implemented
         *
         * @function
         * @name HTMLElement#centerScreen
         * @returns {void}
         *
         * @memberOf __prototype__
         */
    __prototype__.centerScreen = function() {
        console.error("centerScreen Not implemented");
    }
    ;
    /**
         * @namespace ns
         * @memberOf __closure
         */
    var __property__ = {
        activeElements: {
            propertyOf: HTMLFormElement,
            get: function() {
                var els = this.elements;
                var o = {};
                for (var i = 0; i < els.length; i++) {
                    if (els[i].excluded == false)
                        o[els[i].name] = els[i];
                }
                ;return o;
            },
            configurable: false
        },
        /**
                         * returns the form of div element
                         *
                         * @name HTMLDivElement#form
                         * @returns {HTMLFormElement}
                         * @memberOf __property__
                         */
        elementsCount: {
            propertyOf: [HTMLFormElement],
            get: function() {
                var els = this.elements;
                var ol = 0;
                for (var i = 0; i < els.length; i++) {
                    var item = els[i];
                    if (item.type == "button" || item.excluded)
                        continue;
                    ol++;
                }
                return ol;
            }
        },
        form: {
            propertyOf: [HTMLElement],
            get: function() {
                var p = this;
                while (p && p instanceof HTMLFormElement == false) {
                    p = p.parentElement;
                }
                return p instanceof HTMLFormElement ? p : undefined;
            },
            configurable: true
        },
        /**
                         * returns the checkbox is checked or set checked
                         *
                         * @name HTMLDivElement#checked
                         * @returns {boolean}
                         */
        checked: {
            propertyOf: [HTMLDivElement],
            get: function() {
                var c = this.tags2('div')[0] || this;
                return c.hasAttribute('checked');
            },
            set: function(v) {
                var c = this.tags2('div')[0] || this;
                if (v == true)
                    c.setAttribute('checked', '');
                else if (v == false)
                    c.removeAttribute('checked');
            },
            configurable: true
        },
        /**
                         * returns element size by calculating padding
                         *
                         * @name HTMLElement#clientSize
                         * @returns {w,h}
                         */
        clientSize: {
            get: function() {
                var s = getComputedStyle(this);
                var h = this.clientHeight + parseInt(s.paddingTop) + parseInt(s.paddingBottom);
                var w = this.clientWidth + parseInt(s.paddingLeft) + parseInt(s.paddingRight);
                return {
                    w: w,
                    h: h
                };
            }
        },
        placeHolder: {
            propertyOf: [HTMLTextAreaElement, HTMLInputElement, HTMLSelectElement],
            get: function() {
                if (!this.hasAttribute('placeholder'))
                    return undefined;
                return this.getAttribute('placeholder');
            },
            set: function(v) {
                if (v === false) {
                    this.removeAttribute('placeholder');
                } else
                    this.setAttribute('placeholder', v);
            },
            configurable: true
        },
        dirty: [/**
                                 * returns whether element is dirty
                                 *
                                 * @name HTMLTextAreaElement#dirty
                                 * @returns {bool}
                                 */
        {
            propertyOf: [HTMLTextAreaElement],
            get: function() {
                if (this.excluded)
                    return false;
                // console.info('TextArea Dirty
                // ?',
                // this.defaultValue !=
                // this.getValue(),
                // this.defaultValue,
                // this.getValue(),
                // this.defaultChecked, this);
                return this.getAttribute('defaultValue') != this.getValue();
            },
            configurable: true
        }, /**
                                 * returns whether element is dirty
                                 *
                                 * @name HTMLSelectElement#dirty
                                 * @returns {bool}
                                 */
        {
            propertyOf: [HTMLSelectElement],
            get: function() {
                if (this.excluded)
                    return false;
                // if (this.defaultValue !=
                // this.getValue())
                // console.info('Select Dirty
                // ?',
                // this.defaultValue !=
                // this.getValue(),
                // 'initial=',
                // this.defaultValue, 'value=',
                // this
                // .getValue(), this);
                var option = this.options.item(0);
                while (option) {
                    if (option.defaultSelected) {
                        // console.info('checkselect
                        // is dirty',
                        // option.defaultSelected);
                        return option.value != this.getValue();
                    }
                    option = option.nextElementSibling;
                }
                return false;
            },
            configurable: true
        }, /**
                                 * returns whether element is dirty
                                 *
                                 * @name HTMLInputElement#dirty
                                 * @returns {bool}
                                 */
        {
            propertyOf: [HTMLInputElement],
            get: function() {
                if (this.type == "button")
                    return false;
                // console.info('Input Dirty ?',
                // this.defaultValue !=
                // this.getValue(),
                // this.defaultValue,
                // this.getValue(),
                // this.defaultChecked, this);
                if (this.type == "checkbox" || this.type == "radio") {
                    return (this.getAttribute('defaultChecked') === "true" ? true : false) != this.checked;
                }
                return this.getAttribute('defaultValue') != this.getValue();
            },
            configurable: true
        }, {
            propertyOf: [HTMLFormElement],
            get: function() {
                if (this.hasAttribute('data-control-flag-dirty'))
                    return true;
                if (this.initialElementsCount !== this.elementsCount)
                    return true;
                var els = this.elements;
                console.groupCollapsed('check Form dirty', this, els.length, arguments);
                for (var i = 0; i < els.length; i++) {
                    var item = els[i];
                    if (item.excluded)
                        continue;
                    if (item.type === 'button')
                        continue;
                    // console.log('Check
                    // dirty', item);
                    if (item.dirty === true) {
                        console.warn('Form dirty by', item);
                        console.groupEnd();
                        return true;
                    }
                }
                console.info('Form not dirty');
                console.groupEnd();
                return false;
            },
            set: function(v) {
                if (v)
                    this.setAttribute('data-control-flag-dirty', '');
                else
                    this.removeAttribute('data-control-flag-dirty');
                ca.event.raise('dirty', v, this);
                ca.event.raise('change', {
                    source: this
                }, this, false);
            },
            configurable: true
        }, ],
        excluded: {
            get: function() {
                if (!this.form)
                    return false;
                return this.hasAttribute('data-form-exclude');
            },
            set: function(v) {
                if (!this.form)
                    return;
                if (v === true)
                    this.setAttribute('data-form-exclude', '');
                else
                    this.removeAttribute('data-form-exclude');
            },
            configurable: true
        },
        disabled: {
            get: function() {
                return this.hasAttribute('disabled');
            },
            set: function(v) {
                if (v == true)
                    this.setAttribute('disabled', '');
                else if (v == false)
                    this.removeAttribute('disabled');
            },
            configurable: true
        },
        formElements: {
            get: function() {
                var a = {};
                function collect(a, items) {
                    if (items.length) {
                        for (var i = 0, lng = items.length; i < lng; ++i) {
                            var ip = items.item(i);
                            a[ip.name] = ip;
                        }
                    }
                }
                var ips = this.getElementsByTagName('input');
                var tps = this.getElementsByTagName('textarea');
                var sps = this.getElementsByTagName('select');
                collect(a, ips);
                collect(a, tps);
                collect(a, sps);
                return a;
            },
            configurable: true
        },
        canValidate: {
            get: function() {
                return !this.hasAttribute('data-control-validation-disabled');
            },
            set: function(v) {
                if (v == false)
                    this.setAttribute('data-control-validation-disabled', '');
                else
                    this.removeAttribute('data-control-validation-disabled');
            },
            configurable: true
        },
        controlRequest: {
            get: function() {
                if (!this.hasAttribute('data-control-request'))
                    return undefined;
                return this.getAttribute('data-control-request');
            },
            set: function(v) {
                if (v === false) {
                    this.removeAttribute('data-control-request');
                } else if (v === true)
                    this.setAttribute('data-control-request', '');
                else {
                    this.setAttribute('data-control-request', v);
                    this.removeAttribute('data-control-command');
                }
            },
            configurable: true
        },
        divs: {
            get: function() {
                return this.tags('div');
            },
            configurable: true
        },
        keyControl: {
            get: function() {
                if (this.hasControlKey)
                    return this;
                if (this.parentElement)
                    return this.parentElement.keyControl;
                return false;
            }
        },
        hasControlKey: {
            get: function() {
                if (!this.hasAttribute('data-control-key'))
                    return false;
                return true;
            },
            configurable: true
        },
        parentControlRow: {
            get: function() {
                var p = this;
                while (p.parentElement) {
                    p = p.parentElement;
                    if (p.hasAttribute('data-control-row'))
                        return p;
                }
            },
            configurable: false
        },
        controlRow: {
            get: function() {
                var p = this;
                while (p) {
                    if (p.hasAttribute('data-control-row'))
                        return p;
                    p = p.parentElement;
                }
            },
            configurable: false
        },
        hasItemRow: {
            get: function() {
                if (!this.hasAttribute('data-item-row'))
                    return false;
                return true;
            },
            configurable: true
        },
        itemRow: {
            get: function() {
                if (!this.hasAttribute('data-item-row'))
                    return undefined;
                return this.getAttribute('data-item-row');
            },
            set: function(v) {
                if (v === false || typeof v === 'undefined' || v === null) {
                    this.removeAttribute('data-item-row');
                } else if (v === true)
                    this.setAttribute('data-item-row', '');
                else
                    this.setAttribute('data-item-row', v);
            },
            configurable: true
        },
        itemEntity: {
            get: function() {
                if (!this.hasAttribute('data-item-entity'))
                    return undefined;
                var value = this.getAttribute('data-item-entity');
                if (value.length === 0)
                    return undefined;
                return value.toString().toObject(this, true);
            },
            configurable: false
        },
        controlName: {
            get: function() {
                if (!this.hasAttribute('data-control-name'))
                    return undefined;
                var value = this.getAttribute('data-control-name');
                return value.length === 0 ? null : value;
            },
            set: function(v) {
                if (v === false || typeof v === 'undefined' || v === null) {
                    this.removeAttribute('data-control-name');
                } else if (v === true)
                    this.setAttribute('data-control-name', '');
                else
                    this.setAttribute('data-control-name', v);
            },
            configurable: true
        },
        parentControlName: {
            get: function() {
                var p = this.getParent(function() {
                    return this.hasAttribute('data-control-name');
                });
                if (!p)
                    return undefined;
                var value = p.getAttribute('data-control-name');
                return value.length === 0 ? null : value;
            },
            set: function(v) {
                throw new Error('Property is readonly');
            },
            configurable: true
        },

        clientAction: {
            get: function() {
                if (!this.hasAttribute('data-client-action'))
                    return undefined;
                var value = this.getAttribute('data-client-action');
                return value.length === 0 ? null : value;
            },
            set: function(v) {
                if (v === false || typeof v === 'undefined' || v === null) {
                    this.removeAttribute('data-client-action');
                } else if (v === true)
                    this.setAttribute('data-client-action', '');
                else
                    this.setAttribute('data-client-action', v);
            },
            configurable: false
        },
        clientKey: {
            get: function() {
                if (!this.hasAttribute('data-client-key'))
                    return undefined;
                var value = this.getAttribute('data-client-key');
                return value.length === 0 ? null : value;
            },
            set: function(v) {
                if (v === false || typeof v === 'undefined' || v === null) {
                    this.removeAttribute('data-client-key');
                } else if (v === true)
                    this.setAttribute('data-client-key', '');
                else
                    this.setAttribute('data-client-key', v);
            },
            configurable: false
        },
        controlKey: {
            get: function() {
                if (!this.hasAttribute('data-control-key'))
                    return undefined;
                var value = this.getAttribute('data-control-key');
                return value.length === 0 ? null : value;
            },
            set: function(v) {
                if (v === false || typeof v === 'undefined' || v === null) {
                    this.removeAttribute('data-control-key');
                } else if (v === true)
                    this.setAttribute('data-control-key', '');
                else
                    this.setAttribute('data-control-key', v);
            },
            configurable: true
        },
        parentControlKey: {
            get: function() {
                var p = this.getParent(function() {
                    return this.hasAttribute('data-control-key');
                });
                if (!p)
                    return undefined;
                var value = p.getAttribute('data-control-key');
                return value.length === 0 ? null : value;
            },
            set: function(v) {
                throw new Error('Property is readonly');
            },
            configurable: true
        },
        controlCommand: {
            get: function() {
                if (!this.hasAttribute('data-control-command'))
                    return undefined;
                return this.getAttribute('data-control-command');
            },
            set: function(v) {
                if (v === false) {
                    this.removeAttribute('data-control-command');
                } else if (v === true)
                    this.setAttribute('data-control-command', '');
                else {
                    this.setAttribute('data-control-command', v);
                    this.removeAttribute('data-control-request');
                }
            },
            configurable: true
        },
        hasControlRequest: {
            get: function() {
                if (!this.hasAttribute('data-control-request'))
                    return false;
                return true;
            },
            configurable: false
        },
        hasControlCommand: {
            get: function() {
                if (!this.hasAttribute('data-control-command'))
                    return false;
                return true;
            },
            configurable: false
        },
        hasItemRequest: {
            get: function() {
                console.warn('hasItemRequest deprecated use hasControlRequest');
                return this.hasControlRequest;
            },
            configurable: false
        },
        /**
                                 * returns element or parent that has
                                 * data-control-draggable attribute
                                 *
                                 * @name HTMLElement#dragEventTarget
                                 * @returns {HTMLElement}
                                 */
        dragEventTarget: {
            get: function() {
                if (this.hasAttribute('data-control-draggable'))
                    return this;
                if (this.parentNode)
                    return this.parentNode.dragEventTarget;
                return null;
            }
        },
        /**
                                 * returns getClientRects first indexed item
                                 *
                                 * @name HTMLElement#clientRect
                                 * @returns {Object} Rectangle object
                                 */
        clientRect: {
            get: function() {
                var collRect;
                try {
                    collRect = this.getClientRects();
                } catch (e) {
                    collRect = null;
                }
                if (isset(collRect) && collRect.length > 0) {
                    var rect = collRect[0];
                    return rect;
                }
                return false;
            }
        },
        computedStyle: {
            get: function() {
                return window.getComputedStyle(this);
            }
        },
        dialog: {
            get: function() {
                var sc = this.closure;
                if (sc && (sc.dialogContext || sc.dialog))
                    return sc.dialogContext || sc.dialog;
                return null;
            }
        },
        context: {
            get: function() {
                if ((this.___context___ instanceof Object) === false) {
                    this.___context___ = {};
                }
                return this.___context___;
            }
        },
        ajaxClosure: {
            get: function() {
                function getNode() {
                    var node;
                    if (this.hasAttribute('data-ajax-closure-scope')) {
                        node = this;
                    } else if (this.parentElement)
                        node = getNode.call(this.parentElement);
                    return node;
                }
                var node = getNode.call(this);
                if (node) {
                    node.context.ajaxClosure = node.context.ajaxClosure || {};
                    return node.context.ajaxClosure;
                }
                return undefined;
            },
            set: function(v) {
                if (v === false || v === null || typeof v === 'undefined') {
                    this.context.ajaxClosure = undefined;
                    this.removeAttribute('data-ajax-closure-scope');
                    return;
                }
                this.setAttribute('data-ajax-closure-scope', '');
                this.context.ajaxClosure = v;
            },
            configurable: false
        },
        /**
                                 * returns element or parent that has
                                 * data-control-closure-scope attribute
                                 *
                                 * @name HTMLElement#closureScope
                                 * @returns {HTMLElement}
                                 */
        closure: {
            get: function() {
                if (this.hasAttribute('data-control-closure-scope')) {
                    if (this.__closure__)
                        return this.__closure__;
                    var s = this.getAttribute('data-control-closure-scope');
                    var o;
                    if (s.length > 0)
                        eval('o=' + s + ';');
                    this.__closure__ = {
                        scope: o,
                        target: this
                    };
                    return this.__closure__;
                }
                if (this.parentNode)
                    return this.parentNode.closure;
                return null;
            }
        },
        defaultStyle: {
            get: function() {
                if (typeof this._defaultCss === 'undefined') {
                    var computedDisplay = getComputedStyle(this).display;
                    var ds = this.style;
                    if (computedDisplay.length !== 0)
                        ds.setProperty("display", ds);
                    this._defaultCss = ds;
                }
                return this._defaultCss;
            }
        },
        detached: {
            get: function() {
                var p = this;
                while (p && !(p instanceof HTMLDocument)) {
                    p = p.parentNode;
                }
                return p == null || typeof p === 'undefined' && !(p instanceof HTMLDocument);
            }
        },
        /**
                                 * returns element or parent that has
                                 * data-control-render-target attribute
                                 *
                                 * @name HTMLElement#eventTarget
                                 * @returns {HTMLElement}
                                 */
        renderTarget: {
            get: function() {
                if (this.hasAttribute('data-control-render-target')) {
                    return this;
                }
                if (this.parentElement)
                    return this.parentElement.renderTarget;
                return null;
            }
        },
        /**
                                 * returns element padding metrics
                                 *
                                 * @name HTMLElement#computedBorder
                                 * @returns {HTMLElement}
                                 */
        computedBorder: {
            get: function() {
                var cs = getComputedStyle(this);
                var top = parseInt(cs.borderTop)
                  , bot = parseInt(cs.borderBottom)
                  , left = parseInt(cs.borderLeft)
                  , right = parseInt(cs.borderRight);
                top = isNaN(top) ? 0 : top;
                bot = isNaN(bot) ? 0 : bot;
                left = isNaN(left) ? 0 : left;
                right = isNaN(right) ? 0 : right;
                var v = top + bot;
                var h = left + right;
                return {
                    vertical: v,
                    horizontal: h,
                    v: v,
                    h: h,
                    top: top,
                    bottom: bot,
                    left: left,
                    right: right
                };
            }
        },
        /**
                                 * returns element padding metrics
                                 *
                                 * @name HTMLElement#computedPadding
                                 * @returns {HTMLElement}
                                 */
        computedPadding: {
            get: function() {
                var cs = getComputedStyle(this);
                var top = parseInt(cs.paddingTop)
                  , bot = parseInt(cs.paddingBottom)
                  , left = parseInt(cs.paddingLeft)
                  , right = parseInt(cs.paddingRight);
                var v = top + bot;
                var h = left + right;
                return {
                    vertical: v,
                    horizontal: h,
                    v: v,
                    h: h,
                    top: top,
                    bottom: bot,
                    left: left,
                    right: right
                };
            }
        },
        /**
                                 * returns element or parent that has
                                 * data-event-target attribute
                                 *
                                 * @name HTMLElement#eventTarget
                                 * @returns {HTMLElement}
                                 */
        eventTarget: {
            get: function() {
                if (this.detached)
                    return;
                var p = this.parentElement;
                if (p && p.hasAttribute('data-event-target')) {
                    return p;
                }
                if (p && p.parentElement)
                    return p.eventTarget;
                return null;
            }
        },

        /**
                                 * returns element or parent that has
                                 * data-event-target attribute
                                 *
                                 * @name HTMLElement#eventTarget
                                 * @returns {HTMLElement}
                                 */
        eventTemplate: {
            get: function() {
                if (this.detached)
                    return;
                var p = this.parentElement;
                if (p && p.hasAttribute('data-event-template')) {
                    return p;
                }
                if (p && p.parentElement)
                    return p.eventTemplate;
                return null;
            }
        },
        /**
                                 * returns element have data-event-bridge
                                 * attribute
                                 *
                                 * @name HTMLElement#isEventBridge
                                 * @returns {HTMLElement}
                                 */
        isEventBridge: {
            get: function() {
                return this.hasAttribute('data-event-bridge');
            }
        },
        /**
                                 * returns element or parent that has
                                 * data-event-bridge attribute
                                 *
                                 * @name HTMLElement#eventBridge
                                 * @returns {HTMLElement}
                                 */
        eventBridge: {
            get: function() {
                if (this.hasAttribute('data-event-bridge')) {
                    return this;
                }
                if (this.parentElement)
                    return this.parentElement.eventBridge;
                return null;
            }
        },
        /**
                                 * returns element or parent that has
                                 * data-event-node attribute
                                 *
                                 * @name HTMLElement#eventNode
                                 * @returns {HTMLElement}
                                 */
        eventNode: {
            get: function() {
                if (this.hasAttribute('data-event-node')) {
                    return this;
                }
                if (this.parentElement)
                    return this.parentElement.eventNode;
                return null;
            }
        },
        parentEventNode: {
            get: function() {
                var pn = this.eventNode;
                if (pn && pn.parentElement)
                    return pn.parentElement.eventNode;
                return null;
            }
        },
        parentEventTarget: {
            get: function() {
                var pn = this.eventTarget;
                if (pn && pn.parentElement)
                    return pn.parentElement.eventTarget;
                return null;
            }
        },
        /**
                                 * returns value of element or parent that has
                                 * data-event-target attribute
                                 *
                                 * @name HTMLElement#eventTarget
                                 * @returns {HTMLElement}
                                 */
        label: {
            get: function() {
                if (this.hasAttribute('data-control-label')) {
                    return this.getAttribute('data-control-label');
                }
                if (this.parentElement)
                    return this.parentElement.label;
                return null;
            }
        },
        /**
                                 * returns element or parent that has
                                 * data-control-group attribute
                                 *
                                 * @name HTMLElement#controlGroup
                                 * @returns {HTMLElement}
                                 */
        controlGroup: {
            get: function() {
                if (this.hasAttribute('data-control-group')) {
                    return this;
                }
                if (this.parentNode)
                    return this.parentNode.controlGroup;
                return null;
            }
        },
        /**
                                 * returns element display state using
                                 * data-control-event-display-params attribute
                                 *
                                 * @name HTMLElement#visible
                                 * @returns {bool}
                                 */
        visible: {
            get: function() {
                if (this.hasAttribute('data-control-event-display-params')) {
                    var cls = this.getAttribute('data-control-event-display-params');
                    cls = cls.object;
                    return this.className.split(' ').indexOf(cls[0]) !== -1;
                }
                var isv = this.style.display != 'none';
                return isv;
            }
        },
        /**
                                 * returns element offset position
                                 *
                                 * @name HTMLElement#visible
                                 * @returns {Object} left,top
                                 */
        offsetPos: {
            get: function() {
                var op = this
                  , ol = 0
                  , ot = 0;
                while (op) {
                    ol += op.offsetLeft;
                    ot += op.offsetTop;
                    op = op.offsetParent;
                }
                return {
                    left: ol,
                    top: ot
                };
            }
        },
        offsetSize: {
            get: function() {
                var s = getComputedStyle(this);
                var h = this.offsetHeight + parseInt(s.marginTop) + parseInt(s.marginBottom);
                var w = this.offsetWidth + parseInt(s.marginLeft) + parseInt(s.marginRight);
                return {
                    width: w,
                    height: h,
                    w: w,
                    h: h
                };
            }
        },
    };
    /**
         * @memberOf __property__
         */
    __property__.itemRequest = __property__.controlRequest;
    __property__.itemCommand = __property__.controlCommand;
    /**
         * Raise element before element [el] by setting z-index
         *
         * @function
         * @name HTMLElement#justBefore
         * @param {HTMLElement}
         *                el
         *
         * @memberOf __prototype__
         */
    __prototype__.justBefore = function(el) {
        var zi = parseInt(el.style.zIndex);
        zi = isNaN(zi) ? 2 : zi;
        zi--;
        this.style.zIndex = zi;
    }
    ;
    /**
         * Raise control top of other controls by setting z-index
         *
         * @function
         * @name HTMLElement#topMost
         *
         *
         * @memberOf __prototype__
         */
    __prototype__.topMost = function() {
        var all = document.all;
        var top = 0;
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el instanceof HTMLElement) {
                var zi = parseInt(el.style.zIndex);
                if (!isNaN(zi) && el.style.zIndex > top) {
                    top = zi + 1;
                }
                top += 1;
            }
        }
        // next all
        // console.log("topMost", top);
        this.style.zIndex = top;
        return this;
    }
    ;
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.setTitle = {
        prototypeOf: HTMLDocument,
        /**
                         * sets title of document
                         *
                         * @function
                         * @name HTMLDocument#setTitle
                         * @param {String}
                         *                v - title for document
                         */
        handle: function(v) {
            if (!window.___defaultDocumentTitle___)
                window.___defaultDocumentTitle___ = this.title;
            var t = ___defaultDocumentTitle___;
            var ts = t.split(' - ');
            // ts.splice(0,1);
            ts.unshift(v);
            this.title = ts.join(' - ');
            /*
                                 * var t = this.title; var ts = t.split(' - ');
                                 * ts.splice(0, 1); ts.unshift(v); this.title =
                                 * ts.join(' - ');
                                 */
        }
    };
    /**
         *
         * @memberOf __prototype__
         */
    __prototype__.HTMLCollection = {
        prototypeOf: HTMLCollection,
        handles: {
            /**
                                 * applies select array function on
                                 * HTMLCollection
                                 *
                                 * @function
                                 * @name HTMLCollection#select
                                 * @returns {Array} of HTMLElement
                                 */
            select: function(cb, a) {
                var col = this.toArray();
                return col.select.apply(col, arguments);
            },
            /**
                                 * applies each array function on HTMLCollection
                                 *
                                 * @function
                                 * @name HTMLCollection#each
                                 */
            each: function(cb, a) {
                var col = this.toArray();
                return col.each.apply(col, arguments);
            },
            /**
                                 * applies find array function on HTMLCollection
                                 *
                                 * @function
                                 * @name HTMLCollection#find
                                 */
            find: function(cb, a) {
                var col = this.toArray();
                return col.find.apply(col, arguments);
            },
            /**
                                 * converts HTMLCollection to array and returns
                                 * it
                                 *
                                 * @function
                                 * @name HTMLCollection#toArray
                                 * @returns {Array} of HTMLElement
                                 */
            toArray: function() {
                var col = [];
                for (var i = 0; i < this.length; i++) {
                    col.push(this[i]);
                }
                return col;
            }
        }
    };
    /**
         * @private
         */
    ___proto_getValue = function() {
        switch (this.tagName.toLowerCase()) {
        case "input":
        case "select":
            switch (this.type) {
            case "checkbox":
                return (this.checked == false ? null : this.value);
                break;
            default:
                return this.value;
            }
            break;
        case "textarea":
            return (chrome ? this.value : this.innerText);
            break;
        default:
            console.assert(false, this.tagName + ' not implemented');
        }
    }
    ;
    /**
         * adds element to element
         *
         * @function
         * @name HTMLElement#addTo
         * @param {HTMLElement}
         *                o element being added
         * @returns {HTMLElement} added element
         */
    /**
         * prepends element to element
         *
         * @function
         * @name HTMLElement#prependTo
         * @param {HTMLElement}
         *                o element being prepended
         * @returns {HTMLElement} prepended element
         */
    var toNames = 'add,prepend'.split(',');
    for (var i = 0; i < toNames.length; i++) {
        var f = toNames[i];
        __prototype__[f + 'To'] = (function(f) {
            return function(c) {
                f.call(c, this);
                return this;
            }
            ;
        }
        )(__prototype__[f]);
    }
    function isInputElement(e) {
        return e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement;
    }
    ;function loadPrototypes() {
        function loadPrototype(key, item) {
            if (item.hasOwnProperty('prototypeOf')) {
                var pto = item.prototypeOf;
                ptos = pto instanceof Array ? pto : [pto];
                for (var i = 0; i < ptos.length; i++) {
                    if (item.hasOwnProperty('handle')) {
                        ptos[i].prototype[key] = item.handle;
                        console.log('loadPrototype', key, utility.funcName.call(ptos[i]), item.handle);
                    } else if (item.hasOwnProperty('handles')) {
                        for (var hKey in item.handles) {
                            ptos[i].prototype[hKey] = item.handles[hKey];
                            console.log('loadPrototype', hKey, utility.funcName.call(ptos[i]), item.handles[hKey]);
                        }
                    } else
                        throw new Error('Prototype set configuration error for ' + key + '. Neighter handle nor handles set.');
                }
                delete item.prototypeOf;
                item.prototypeOf = undefined;
            } else {
                HTMLElement.prototype[key] = item;
                SVGElement.prototype[key] = item;
                console.log('loadPrototype', key, "HTMLElement", item);
            }
        }
        console.groupCollapsed('loadPrototype');
        for (var key in __prototype__) {
            if (__prototype__.hasOwnProperty(key)) {
                var item = __prototype__[key];
                if (item instanceof Function) {
                    loadPrototype(key, item);
                    console.log('loadPrototype', key, "HTMLElement", item);
                } else if (item instanceof Array) {
                    for (var i = 0, ln = item.length; i < ln; ++i) {
                        loadPrototype(key, item[i]);
                    }
                    HTMLElement.prototype[key] = item;
                    console.log('loadPrototype', key, "HTMLElement", item);
                } else {
                    loadPrototype(key, item);
                }
            }
            // TODO Burası patlar
        }
        console.groupEnd();
    }
    ;function loadProperties() {
        function loadProperty(name, def) {
            console.log('loadProperty', name, def);
            if (def.hasOwnProperty('propertyOf')) {
                var po = def.propertyOf;
                for (var i = 0; i < po.length; i++) {
                    if (!po[i].prototype.hasOwnProperty(name))
                        Object.defineProperty(po[i].prototype, name, def);
                }
                delete def.propertyOf;
                def.propertyOf = undefined;
            } else {
                if (!HTMLElement.prototype.hasOwnProperty(name))
                    Object.defineProperty(HTMLElement.prototype, name, def);
                if (!SVGElement.prototype.hasOwnProperty(name))
                    Object.defineProperty(SVGElement.prototype, name, def);
            }
        }
        console.groupCollapsed('loadProperty');
        for (var key in __property__) {
            if (__property__.hasOwnProperty(key)) {
                var def = __property__[key];
                if (def instanceof Array) {
                    for (var i = 0; i < def.length; i++) {
                        loadProperty(key, def[i]);
                    }
                } else
                    loadProperty(key, def);
            }
        }
        console.groupEnd();
    }
    ;loadPrototypes();
    loadProperties();
    /**
         * Whether validation enabled for this element
         *
         * @name HTMLElement#canValidate
         * @return bool
         */
    /**
         * returns whether element is disabled (has disabled attribute)
         *
         * @name HTMLElement#disabled
         * @returns {bool}
         */
    /**
         * @function
         * @name NodeList#each
         * @param {Function}
         *                hnd
         */
    NodeList.prototype.each = function(hnd) {
        var sel = [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.length; i++) {
            var out = false;
            var ta = Array.prototype.slice.call(args);
            Array.prototype.unshift.call(ta, this.item(i), i);
            hnd.apply(this, ta);
        }
    }
    ;
    /**
         * @function
         * @name NodeList#select
         * @param {Function}
         *                hnd
         * @returns array
         */
    NodeList.prototype.select = function(hnd) {
        var sel = [];
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < this.length; i++) {
            var out = false;
            var ta = Array.prototype.slice.call(args);
            Array.prototype.unshift.call(ta, this.item(i), i);
            out = hnd.apply(this, ta);
            if (out === true) {
                sel.push(this[i]);
            }
        }
        return sel;
    }
    ;
    domReady(function() {
        document.onkeydown = document.onkeypress = function(e) {
            if (e.keyCode == 8) {
                var d = e.srcElement || e.target;
                if (!((d.tagName.toUpperCase() == 'BODY') || (d.tagName.toUpperCase() == 'HTML'))) {
                    doPrevent = (d.attributes['readonly'] || d.attributes['disabled'] || d.readonly || d.disabled);
                } else {
                    doPrevent = true;
                }
            } else {
                doPrevent = false;
            }
            if (doPrevent) {
                e.preventDefault();
            }
        }
        ;
    });
    /*
         * Main function parses all elements
         */
    domReady(function() {
        __prototype__.parseDOM.call(document);
        //              window.forceHash();
    });

}

function ___domReady() {

    window.__domIsReady__ = false;
    window.addEventListener("DOMContentLoaded", function() {
        window.__domIsReady__ = true;
    }, false);

    function domReady(h) {
        if (window.__domIsReady__ === true)
            h();
        else
            window.addEventListener("DOMContentLoaded", h, false);
    }

    ;/**
         * @id domReady fires when DOM Loaded or document and libraries are
         *     ready
         */
    window.domReady = domReady;

}

function ___parser() {
    function rectH(rc, oh, t, e) {
        e = e || window.event;
        var b = false;
        var src = e.target;
        var collRect;
        try {
            collRect = src.getClientRects();
        } catch (err) {
            collRect = null;
        }
        var x = [rc[0], rc[2]]
          , y = [rc[1], rc[3]];
        if (isset(collRect) && collRect.length > 0) {
            rect = collRect[0];
            for (var i = 0; i < 2; i++) {
                x[i] = x[i] == null ? rect.right : (x[i] == 0 ? rect.left : x[i] + (x[i] < 0 ? rect.right : rect.left));
                y[i] = y[i] == null ? rect.bottom : (y[i] == 0 ? rect.top : y[i] + (y[i] < 0 ? rect.bottom : rect.top));
            }
            if (!src.hasAttribute('data-control-event-rect-disabled') && e.clientX >= x[0] && e.clientX < x[1] && e.clientY >= y[0] && e.clientY < y[1]) {
                console.info('rect event', e.type, x, y);
                src.css('cursor:pointer !important;');
                if (t) {
                    src.___title = src.title;
                    src.title = t;
                }
                if (e.type == 'click') {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    e.returnValue = false;
                    if (window.CustomEvent) {
                        var event = new CustomEvent('rectclick',{
                            // detail : a,
                            bubbles: b,
                            cancelable: true
                        });
                        var cancelled = !src.dispatchEvent(event);
                    }
                    if (src['data-control-event-rect-handle'] || src.hasAttribute('data-control-event-rect-handle')) {
                        var eh = src['data-control-event-rect-handle'] || src.getAttribute('data-control-event-rect-handle');
                        src.removeAttribute('data-control-event-rect-handle');
                        eh = eh instanceof Function ? eh : eh.object;
                        eh.call(src, e);
                    }
                    return false;
                }
            } else {
                src.css('cursor:auto !important;');
                if (src.___title) {
                    src.title = src.___title;
                    src.___title = undefined;
                } else
                    src.title = '';
                if (e.type == 'click' && oh) {
                    var clh = oh instanceof Function ? oh : (typeof oh == 'string' ? oh.object : oh);
                    clh.call(src, e);
                }
            }
        }
    }
    var dataParserAttributes = {
        'data-control-context-entity': '',
        'data-event-hash-listener': '',
        'data-control-constructor': '',
        'data-control-parser-constructor': '',
        'data-control-tooltip': '',
        'data-control-options-select': '',
        'data-control-validators': '',
        'data-lib-events-add': '',
        'data-control-security': '',
        'data-control-css-rule-set': '',
        'data-script-on-ready': '',
        'data-control-on-ready': '',
        'data-control-on-init': '',
    };
    var dataParserAttributesReserved = {
        'data-control-inject-global': '',
        'data-control-client-scope': '',
        'data-client-action': '',
        'data-client-key': '',
        'data-control-section-title': '',
        // used for section title handling see
        // healthView::getCommandBarHtml
        'data-control-validation-disabled': '',
        "data-control-dirty-ignore": '',
        'data-event-target': '',
        'data-event-bridge': '',
        'data-event-template': '',
        'data-event-node': '',
        'data-control-render-target': '',
        'data-control-group': '',
        'data-item-row': '',
        'data-control-key': '',
        'data-control-request': '',
        'data-control-command': '',
        'data-control-row': '',
        'data-item-entity': '',
        'data-control-event-arguments': '',
        'data-control-event-display-params': '',
        'data-control-draggable': '',
        'data-control-closure-scope': '',
        'data-form-exclude': '',
        'data-form-entity': '',
        // for control parsers
        'data-control-event-rect-handle': '',
        'data-control-event-rect': '',
        'data-control-event-rect-disabled': '',
        'data-control-form-element-group': '',
    };
    /**
         * @namespace
         * @name dataAttributeParser
         */
    var dataAttributeParser = {

        _template: function(v, n, oh) {// var data = v;
        // this.removeAttribute(n);
        },
        event: {
            // region: {
            // click: function(v) {
            // var size = v.split(' ')[0];
            // size = parseInt(size.trim());
            // ca.event.listen('click', function(e) {
            // if (e.offsetX > e.target.offsetWidth - size)
            // {
            // e.preventDefault();
            // e.stopPropagation();
            // e.stopImmediatePropagation();
            // ca.event.raise('regionclick', {
            // size: size,
            // data: v
            // }, this, true);
            // }
            // }, this, false);
            // }
            // },
            hash: {
                /**
                                         * //FIXME DEPRECATE
                                         *
                                         * @namespace
                                         * @name dataAttributeParser.event.hash.listener
                                         */
                listener: function(v) {
                    // v = addSourceUrl.call(this,
                    // v, 'listener');
                    var fn = v.toObject(this);
                    window.hashListeners.push(this);
                    var handle = fn;
                    this.addEventListener('hashChanged', handle, false);
                    // forceHash();
                    this.addEventListener('remove', function(h, e) {
                        e.target.removeEventListener(h, false);
                    }
                    .bind(window, handle));
                }
            }
        },
        form: {},
        assist: {
            text: function(v, n) {
                var fn = v.toObject(this);
                var data = typeof fn === 'function' ? fn.call(this) : v;
                this.removeAttribute(n);
                ca.event.listen('click', function(e) {
                    var d = new ca.ui.controls.dialog('Yardım',{
                        size: {
                            w: 500,
                            h: 'content'
                        }
                    });
                    d.container.innerHTML = data;
                    var linker = _$('div').text('Daha fazla yardım');
                    linker.onclick = function() {
                        d.close();
                        self.location.hash = '#1/yardim';
                    }
                    .bind(d);
                    d.addMenuItem(linker);
                    d.show(true, true);
                }, this);
            },
        },
        script: {
            on: {
                ready: function(v, n) {
                    eval(v);
                }
            }
        },
        control: {
            event: {
                ready: function(v, n, o, a, ns) {

                    ca.event.raise('element-ready', v, this, true);
                },
                listen: function(v, n, o, a, ns) {
                    var o = v.toObject(this, false);
                    ca.event.listen(o.name, o.handle.bind(this), o.target || this, false);
                    this.removeAttribute(n);
                }
            },
            format: {
                checkbox: function(v, n, oh) {
                    if (!this.hasClass('check-box'))
                        return;
                    var o = v.toObject(this);
                    var data = typeof o === 'function' ? o.call(this) : (typeof o === 'object' ? o : v.split(','));
                    if (data.length === 1)
                        data.push('');
                    if (input = this.tags2('input').first) {
                        this.checked = input.value == data[0];
                    }
                    ca.event.listen('click', function(e) {
                        this.checked = !this.checked;
                        this.firstElementChild.value = this.checked ? data[0] : data[1];
                        ca.event.raise('change', {}, this.firstElementChild, true);
                    }
                    .bind(this), this, false);

                    this.removeAttribute(n);
                },
                eof: function(v, n, oh) {
                    if (this instanceof HTMLTableElement === false)
                        return;
                    var text = (typeof v === "string" && v.length) ? v : 'Kayıt mevcut değil';
                    var tbs = this.tags2('tbody');
                    var c = tbs.length ? tbs.first : this;
                    var trs = c.tags2('tr');
                    if (trs.length == 1) {
                        var colSpan = trs.first.tags2('td').length;
                        var eof = _$('tr').cls('dyna-eof').addTo(c);
                        eof.add(_$('td').att('colspan', colSpan).text(text));
                    }
                    // this.css('border:1px solid
                    // red;');
                    // var data = v;
                    // this.removeAttribute(n);
                },
            },
            beta: {
                dispose: function(v, n) {
                    if (!DEVELOPMENT_MODE) {
                        this.style.display = 'none';
                        this.clear(true);
                    }
                    this.removeAttribute(n);
                }
            },
            context: {
                entity: function(v, n) {
                    var ob = v.toObject(this, true);
                    this.context.entity = ob;
                }
            },
            css: {
                parent: {
                    "class": function(v, n, o, a, ns) {
                        var data = v;
                        if (data && data.trim().length > 0) {
                            this.parentElement.cls(v, true);
                        }
                    }
                },
                rule: {
                    set: function(v, n, oh) {
                        var data = v;
                        if (data && data.trim().length > 0) {
                            this.removeAttribute('data-control-css-rule-set');
                            if (data.indexOf('#\$id') != -1) {
                                var id = this.id || this.getAttribute('id') || uniqid('e');
                                this.setAttribute('id', id);
                                this.id = id;
                                data = data.replace(/#\$id/g, '#' + id);
                            }
                            var css = window.__parsedElementsCss;
                            if (typeof css == 'undefined') {
                                css = _$('style').att('type', 'text/css');
                                window.__parsedElementsCss = css;
                                document.head.add(css);
                            }
                            var tempStyle = _$('style').att('type', 'text/css');
                            tempStyle.setAttribute('disabled', '');
                            tempStyle.add(data);
                            document.head.add(tempStyle);
                            console.info('rulex', css.sheet.cssRules, tempStyle.sheet.cssRules);
                            for (var i = 0; i < tempStyle.sheet.cssRules.length; i++) {
                                var tr = tempStyle.sheet.cssRules.item(i);
                                // console.info('new
                                // rulex',
                                // i,
                                // tr);
                                for (var ii = 0; ii < css.sheet.cssRules.length; ii++) {
                                    var cr = css.sheet.cssRules.item(ii);
                                    // console.info('real
                                    // rulex',
                                    // ii,
                                    // cr);
                                    if (cr.selectorText == tr.selectorText && cr.cssText == tr.cssText) {
                                        console.info('delete rulex', i, tr);
                                        tempStyle.sheet.deleteRule(i);
                                        i--;
                                        break;
                                    }
                                }
                                // next
                                // ii;
                            }
                            // next i
                            for (var i = 0; i < tempStyle.sheet.cssRules.length; i++) {
                                var tr = tempStyle.sheet.cssRules.item(i);
                                console.info('add rulex', tr);
                                window.__parsedElementsCss.sheet.insertRule(tr.cssText, 0);
                                // css.sheet.cssRules.insertRule(tr);
                            }
                            tempStyle.remove();
                            // window.__parsedElementsCss.add(data
                            // + '\n');
                        }
                    }
                }
            },
            parser: {
                constructor: function(v, n) {
                    var att = this.getAttribute('data-control-parser-arguments');
                    if (!att) {
                        console.error('arguments for ' + n + ' not set');
                        return;
                    }
                    var a = att.toObject(this);
                    this.removeAttribute('data-control-parser-arguments');
                    var o = v.toObject();
                    var p = new o();
                    p.options = a;
                    p.control = this;
                    p.initialize();
                }
            },
            constructor: function(v, n) {
                var att = this.getAttribute('data-control-constructor-arguments');
                if (!att) {
                    console.error('arguments for ' + n + ' not set');
                    return;
                }
                var a = att.toObject(this);
                this.removeAttribute('data-control-constructor-arguments');
                a.source = this;
                var o = v.toObject();
                new o(a,this);
            },
            tooltip: function(v) {

                var opts = false;
                try {
                    eval('opts=' + v + '');
                    ')';
                } catch (e) {// TODO: handle
                // exception
                }
                var pe, sh;
                if (opts instanceof Object) {
                    pe = opts.popEvent || 'focus';
                    sh = this.setToolTip.bind(this, opts);
                } else {
                    var isFocus = this.tagName === 'INPUT' || this.tagName === 'TEXTAREA' || this.tagName === 'SELECT';
                    pe = this.hasAttribute('data-control-tooltip-event') ? this.getAttribute('data-control-tooltip-event') : (isFocus ? 'focus' : 'mouseover');
                    var he = this.hasAttribute('data-control-tooltip-hide-event') ? this.getAttribute('data-control-tooltip-hide-event') : isFocus ? 'blur' : 'mouseout';
                    sh = (function(v, he) {
                        this.setToolTip({
                            message: v,
                            hideEvent: he
                        });
                    }
                    ).bind(this, v, he);
                }
                this.addEventListener(pe, sh, false);
            },
            'function': {},
            options: {
                select: function(v) {
                    var ops = this.tags('option');
                    ops.each(function(o, i, v) {
                        if (o.value == v)
                            o.setAttribute('selected', true);
                        else
                            o.removeAttribute('selected');
                    }, v);
                    this.removeAttribute('data-control-options-select');
                }
            },
            validator: {

                messages: {
                    /**
                                                 * @param {Object}
                                                 *                v
                                                 * @deprecated
                                                 */
                    empty: function(v) {
                        this.setError = (function(oh, v) {
                            var a = Array.prototype.splice.call(arguments, 2);
                            a[0] = v;
                            oh.apply(this, a);
                        }
                        ).bind(this, this.setError, v);
                    }
                }
            },
            /**
                                 * use compare for eauality and unequal for
                                 * unequality comparison //TODO:use events in
                                 * validation
                                 */
            validators: function(v) {
                var ar = v instanceof Array ? v : v.object;
                this.validate = function(ar) {
                    console.info('validating with inline validators', this, arguments);
                    this.isValid = true;
                    if (this.canValidate == false)
                        return true;
                    var cev = {
                        valid: undefined
                    };
                    ca.event.raise('validate', cev, this, true);
                    if (cev.valid === true || cev.valid === false) {
                        this.isValid = cev.valid;
                        if (this.form && cev.valid === false)
                            this.form.isValid = false;
                        return this.isValid;
                    }
                    ar.each(function(o, i, el) {
                        var test;
                        if (o.compare || o.unequal) {
                            function checkParam(el, pName) {
                                return typeof pName !== 'undefined' ? pName instanceof HTMLElement ? pName : pName.$ ? pName.$ : el.form && el.form[pName] ? el.form[pName] : undefined : undefined;
                            }
                            var com = checkParam(el, o.compare);
                            var uneq = checkParam(el, o.unequal);
                            test = function(u, v) {
                                if (u)
                                    return this.getValue() != v;
                                else
                                    return this.getValue() == v;
                            }
                            .bind(com || uneq, uneq);
                        } else if (o.pattern) {
                            if (o.pattern instanceof Function)
                                test = o.pattern.bind(el);
                            else {
                                var r = o.pattern instanceof RegExp ? o.pattern : new RegExp(o.pattern);
                                test = r.test.bind(r);
                            }
                        }
                        if (test instanceof Function) {
                            if (!test(el.getValue())) {
                                var target = el;
                                if (o.target instanceof Function) {
                                    target = o.target.call(el);
                                } else if (typeof o.target == 'string ') {
                                    target = o.target.$;
                                }
                                var availHeight = getClientHeight()
                                  , rect = target.clientRect;
                                if (isset(rect) && (rect.top > availHeight || rect.top < 0)) {
                                    var bTop = document.body.scrollTop;
                                    window.scrollTo(0, bTop + parseInt(rect.top - parseInt(availHeight / 2)));
                                }
                                ca.event.raise('error-set', o, target, true);
                                target.focus();
                                target.setError({
                                    message: o.message,
                                    timeOut: 5000
                                });
                                if (el.form)
                                    el.form.isValid = false;
                                el.isValid = false;
                            }
                        }
                    }, this);
                    return this.isValid;
                }
                .bind(this, ar);
            },
            on: {
                ready: function(v, n, o, a, ns) {
                    // v = addSourceUrl.call(this,
                    // v, 'ready');
                    var fn = v.toObject(this, false);
                    fn.call(this, this.closure ? this.closure.scope : undefined, ns, a);
                    ca.event.raise('on-ready', {}, this, false);

                }
            },
            url: function(v, n, oh) {
                var href = v;
                var targetAttName = 'data-control-url-target';
                var target = this.hasAttribute(targetAttName) ? this.getAttribute(targetAttName) : false;
                this.removeAttribute(n);
                this.removeAttribute(targetAttName);
                ca.event.listen('click', function(e) {
                    if (target)
                        window.open(href, target);
                    else
                        self.location.href = href;
                }
                .bind(this), this, false);

            },
            region: function(v, n, oh) {
                var data = v;
                this.removeAttribute(n);
                var size = data.toString().split(',')[0];
                ca.event.listen('click', function(e) {
                    var pass = e.offsetX > e.target.offsetWidth - size;
                    if (typeof start !== 'undefined')
                        pass = pass && e.offsetX < e.target.offsetWidth - start;
                    if (pass) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        ca.event.raise('region-click', data, e.target, true);
                    }
                }, this, false);
            },
            security: function(v, n, oh) {
                var data = v;
                this.removeAttribute(n);
                this.hide();
                if (data && data.trim().length > 0 && !isNaN(data)) {
                    ca.context.user.roles.each(function(r, i, b, s) {
                        if (r.value <= s) {
                            b();
                            return true;
                        }
                    }, (function() {
                        this.show();
                    }
                    ).bind(this), data);
                }
            }
        },
        lib: {
            events: {
                add: function(v, n, oh) {
                    if (typeof v == 'string')
                        v = v.toObject();
                    if (v[1]instanceof Function) {
                        var nsa = v[0].split('.');
                        var fn = Array.prototype.pop.call(nsa);
                        var o = use(Array.prototype.join.call(nsa, '.'));
                        var me = this;
                        o[fn] = v[1].bind(this);
                    } else {
                        for (var i = 0; i < v.length; i++) {
                            var a = v[i];
                            oh.call(this, a, n, oh);
                        }
                    }
                }
            }
        }
    };
    var parserNs = 'ca.utility.attribute.parser';
    use(parserNs);
    function parseDataAttribute(attName, h) {// var xp = "count(@" +
    // attName
    // + ")";
    // var iterator = document.evaluate(xp, this, null ,
    // XPathResult.ANY_TYPE, null );
    //
    // if (iterator.numberValue > 1)
    // /* never raises , php cleans duplicate attributes */
    // throw new Error('Duplicate attribute ' + attName);
    // var fn = attName.replace(/((\-)?([^\-]+))/g, function(match,
    // p1, p2,
    // p3)
    // {
    // return (p2 ? '.' : '') + utility.toLower(p3);
    // console.info('replace', arguments);
    // });
    //
    // var pn = parserNs;
    // var pns = pn.split('.');
    //
    // var fns = fn.split('.');
    // fns = Array.prototype.concat.call(pns, fns);
    // var h = window;
    // while (fns.length) {
    // var ns = Array.prototype.shift.call(fns);
    // // console.info('ns', ns);
    // if (typeof h[ns] !== 'undefined')
    // h = h[ns];
    // else {
    // h = undefined;
    // break;
    // }
    // }
    // console.info('fn', h, h instanceof Function);
    }
    ca.utility.attribute.parser.attributes = [];
    ca.utility.attribute.parser.data = dataAttributeParser;
    function addSourceUrl(v, s) {
        if (!DEVELOPMENT_MODE)
            return v;
        s = s ? s + '-' : '';
        var uniq = this.id && this.id.length > 0 ? this.id : (this.name && this.name.length > 0 ? this.name : uniqid(false));
        var re = /\/\/#\s*sourceURL\s*=\s*.+/i;
        if (!re.test(v)) {
            re = /(function\s*\(\w*\)\s*\{)(.*)/;
            v = v.replace(re, '$1/\/# sourceURL=ca-' + s + this.tagName.toLowerCase() + '-' + uniq + '.js\r$2') + '\n';
        } else {
            re = /(\/\/#\s*sourceURL\s*=\s*.+)(\{random\})(.+)/i;
            v = v.replace(re, '$1' + uniq + '$3');
            re = /(\/\/#\s*sourceURL\s*=\s*.+)(\{time\})(.+)/i;
            v = v.replace(re, '$1' + (new Date().getTime()) + '$3');
        }
        return v;
    }
    function parseNamespaceElements() {
        if (this.getAttribute('ui:context-menu')) {
            // oncontextmenu="window.event.preventDefault();'$ctxMenuID'.$.cls('context-menu').show();"
            var data = this.getAttribute('ui:context-menu');
            if (data)
                data = data.toObject();
            new ca.ui.controls.contextMenu(this,data);
            this.removeAttribute('ui:context-menu');
        }
        // end context menu
        if (this.getAttribute('ui:tab-control')) {
            var data = this.getAttribute('ui:tab-control');
            if (data && data.trim().length > 0)
                data = data.toObject();
            tabs = new ca.ui.controls.tabControl(this);
            this.removeAttribute('ui:tab-control');
        }
        // end tab control
        if (this.getAttribute('ui:control')) {
            // oncontextmenu="window.event.preventDefault();'$ctxMenuID'.$.cls('context-menu').show();"
            var data = this.getAttribute('ui:control');
            if (data) {
                data = data.toObject();
                var o = new data(this);
                this.removeAttribute('ui:control');
            }
        }
    }
    function stubTraverser(el, stub, a, ns) {
        console.info('stub handler type for ' + stub);
        this.parentInstance = undefined;
        this.control = el;
        this.stub = stub;
        this.properties = {};
        this.childHandlers = [];
        this.ajaxSession = a;
        this.clientNs = ns;
    }
    stubTraverser.prototype.endParse = function() {
        var ch = this.childHandlers;
        console.log(this.stub, this.properties, this.childHandlers);
        ch.forEach(function(o, i, a) {
            var name = o.split('-').first;
            var stub = this.stub + '-' + name;
            var h = new stubTraverser(this.control,stub);
            h.parentInstance = this;
            parseStub.call(this.control, stub, h);
            this.properties[name] = h.properties;
        }, this);
        console.log(this.properties);
        if (this.onLoad instanceof Function)
            this.onLoad();
        // console.groupEnd();
        // ajax.exec(properties);
    }
    ;
    stubTraverser.prototype.setProperty = function(name, v) {
        if (/\w+\-\w+/.test(name)) {
            this.childHandlers.push(name);
        } else {
            var control = this.control;
            var obj;

            if (typeof v === "string" && (v.search(/[\(\)\{\}]/i) !== -1 || (v.search(/(\w+\.)+\w/i) !== -1 && v.search(/[\s]/i) === -1))) {
                try {
                    obj = v.toString().toObject(control, false);
                } catch (e) {
                    var err = e.constructor('Error in script for ' + this.stub + '.' + name + ' :\n' + e.message);
                    throw err;
                }
            } else
                obj = false;
            this.properties[name] = obj ? obj : v;
        }
    }
    ;
    var ajaxStubTraverser = function() {
        console.log('ajaxStubTraverser', this);
        this.constructor.apply(this, Array.prototype.slice.call(arguments));
    };
    ajaxStubTraverser.prototype = stubTraverser.prototype;
    ajaxStubTraverser.prototype.constructor = stubTraverser;
    ajaxStubTraverser.prototype.onLoad = function() {
        if (!this.parentInstance) {
            if (!this.properties.dialog && !this.properties["write"])
                this.properties["write"] = this.control;
            if (this.properties.event) {
                ca.event.listen(this.properties.event, function(e) {
                    this.properties.event = undefined;
                    ajax.exec(this.properties);
                }
                .bind(this), this.control);
            } else {
                domReady(function() {
                    ajax.exec(this.properties);
                }
                .bind(this));
            }
        }
    }
    ;
    var dataAttributeStubHandlers = {
        'data-ajax-property': ajaxStubTraverser,
        'data-control-function': {
            setProperty: function(name, code, a, ns) {
                var obj = code.toObject(this, true);
                if (obj instanceof Function === false) {
                    console.error('Malformed code', code);
                    throw new Error('Code for ' + name + ' malformed');
                }
                console.info('stub handler type' + name);
                // code = addSourceUrl.call(this, code,
                // fn);
                this[name] = obj;
            }
        }
    };
    function parseStub(stub, handler) {
        stub += '-';
        var xp = "@*[contains(name(),'" + stub + "')]";
        var iterator = document.evaluate(xp, this, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        var removes = [];
        while (attNode = iterator.iterateNext()) {
            var name = attNode.name.split(stub).last;
            var code = attNode.value;
            handler.setProperty(name, code);
            removes.push(attNode.name);
        }
        if (handler.endParse)
            handler.endParse();
        while (removes.length) {
            this.removeAttribute(removes.pop());
        }
    }
    function parseStubAttributes(a, ns) {
        // begin stub attributes
        for (var key in dataAttributeStubHandlers) {
            if (!dataAttributeStubHandlers.hasOwnProperty(key))
                continue;
            // console.log('begin stub', key);
            var stub = key + "-";
            var xp = "@*[contains(name(),'" + stub + "')]";
            var iterator = document.evaluate(xp, this, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            var instance = undefined;
            var removes = [];
            var attNode = iterator.iterateNext();
            if (attNode) {
                var stubObj = dataAttributeStubHandlers[key];
                instance = stubObj instanceof Function ? new stubObj(this,key,a,ns) : {
                    setProperty: stubObj.setProperty ? stubObj.setProperty.bind(this) : undefined,
                };
            }
            while (attNode) {
                var fn = attNode.name.split(stub).last;
                var code = attNode.value;
                var handler = instance.setProperty
                  , arg = code;
                instance.setProperty(fn, arg, a, ns);
                removes.push(attNode.name);
                attNode = iterator.iterateNext();
            }
            if (instance && instance.endParse)
                instance.endParse();
            while (removes.length) {
                this.removeAttribute(removes.pop());
            }
            /*
                         * try { } catch (er) { console.error(er); if ( er
                         * instanceof evalError) throw er; }
                         */
        }
    }
    var dataAttributeParserHandles;
    function parseDataAttributes(a, ns) {
        if (typeof dataAttributeParserHandles === 'undefined') {
            dataAttributeParserHandles = {};
            function traverse(o, n, depth) {
                depth++;
                for (var key in o) {
                    if (o.hasOwnProperty(key)) {
                        var nsa = n + '-' + key;
                        // console.log(nsa, key);
                        if (o[key]instanceof Function) {
                            dataAttributeParserHandles[nsa] = o[key];
                        } else
                            traverse(o[key], nsa, depth);
                    }
                }
            }
            traverse(dataAttributeParser, 'data', 0);
        }
        for (var key in dataAttributeParserHandles) {
            if (this.hasAttribute(key)) {
                var h = dataAttributeParserHandles[key];
                var data = this.getAttribute(key);
                h.call(this, data, key, h, a, ns);
                this.removeAttribute(key);
            }
        }
    }
    function getObjectFromAttribute(elm, att, remove) {
        var data = getStringFromAttribute(elm, att, remove);
        var ob = data.object;
        return ob;
    }
    function getStringFromAttribute(elm, n, remove) {
        var data = elm.getAttribute(n);
        if (remove === true)
            elm.removeAttribute(n);
        return data;
    }
    /**
         * @param a
         *                ajax session
         * @param ns
         *                client namespace
         */
    function parseElement(a, ns) {
        ns = typeof ns === 'undefined' ? {} : ns;
        if (this instanceof HTMLSelectElement || this instanceof HTMLInputElement || this instanceof HTMLTextAreaElement) {
            if (this.form) {
                ca.event.listen('change', (function(e) {
                    ca.event.raise('change', {
                        source: this
                    }, this.form, false);
                }
                ).bind(this), this, true);
                function cleanFunc(e) {
                    var tg = e.target;
                    if (!tg.dirty) {
                        ca.event.raise('instant-change', {}, tg, false);
                        ca.event.raise('change', {
                            source: tg
                        }, tg.form, false);
                        var cf = cleanFunc
                          , df = dirtyFunc;
                        tg.removeEventListener('keyup', cf, true);
                        tg.addEventListener('keyup', df, true);
                    }
                }
                function dirtyFunc(e) {
                    var tg = e.target;
                    if (tg.dirty) {
                        ca.event.raise('instant-change', {}, tg, false);
                        ca.event.raise('change', {
                            source: tg
                        }, tg.form, false);
                        var cf = cleanFunc
                          , df = dirtyFunc;
                        tg.removeEventListener('keyup', df, true);
                        tg.addEventListener('keyup', cf, true);
                    }
                }
                ca.event.listen('keyup', dirtyFunc, this, true);
            }
        }
        if (this.validate instanceof Function) {
            if (this.addEventListener) // Opera - Firefox -
            // Google Chrome
            {
                this.addEventListener("change", this.validate.bind(this), false);
            } else if (this.attachEvent) // Internet Explorer
            {
                this.attachEvent("onchange", this.validate.bind(this));
            }
        }

        if (this instanceof HTMLFormElement) {
            if (!this.hasAttribute('data-form-allow-submit'))
                this.onsubmit = function() {
                    return false;
                }
                ;
            this.initialElementsCount = this.elementsCount;
        }
        if (this instanceof HTMLTextAreaElement) {
            this.defaultValue = this.getValue();
            if (!this.hasAttribute('defaultValue'))
                this.setAttribute('defaultValue', this.getValue());
        }
        if (this instanceof HTMLInputElement) {
            var value = this.getAttribute('value') || '';
            this.defaultValue = value;
            if (!this.hasAttribute('defaultValue'))
                this.setAttribute('defaultValue', value);

            if ((this.type == 'checkbox' || this.type == 'radio')) {
                this.defaultChecked = this.checked;
                if (!this.hasAttribute('defaultChecked'))
                    this.setAttribute('defaultChecked', this.hasAttribute('checked'));
            }
        }
        if (this instanceof HTMLElement) {
            parseNamespaceElements.call(this);
            parseStubAttributes.call(this, a, ns);
            parseDataAttributes.call(this, a, ns);
            // data-control-verb-transform
            if (this.hasAttribute('data-control-verb-transform')) {
                var d = getObjectFromAttribute(this, 'data-control-verb-transform', true);
                ca.event.listen('personalize', function(d, e) {
                    function preg(dc) {
                        var tg = 'innerHTML';
                        for (var i = 0, n = dc.params.length; i < n; ++i) {
                            this[tg] = this[tg].replace(dc.params[i][0], dc.params[i][1]);
                        }
                    }
                    if (e.detail.personal === false) {
                        if (d.common) {
                            if (d.common instanceof Object) {
                                preg.call(this, d.common);
                            } else {
                                d.personal = this.textContent;
                                this.text(d.common);
                            }
                        }
                    } else if (e.detail.personal === true) {
                        if (d.personal) {
                            if (d.personal instanceof Object) {
                                preg.call(this, d.personal);
                            } else {
                                d.common = this.textContent;
                                this.text(d.personal);
                            }
                        }
                    }
                }
                .bind(this, d), this.eventNode, false);
            }
            if (this.hasAttribute('data-control-event-rect')) {
                var oClk = undefined;
                if (this.onclick) {
                    oClk = this.onclick;
                    this.onclick = undefined;
                }
                var t = getStringFromAttribute(this, 'data-control-event-rect-title', true);
                var rc = getObjectFromAttribute(this, 'data-control-event-rect', true);
                this.addEventListener('mousemove', rectH.bind(this, rc, undefined, t), true);
                if (oClk)
                    this.addEventListener('click', rectH.bind(this, rc, oClk, undefined), true);
            }
        }
        // end if this instanceof HTMLElement
        ca.event.raise('parse', {}, this, false);
        // TODO:revisit and deprecate element-parsed
        ca.event.raise('element-parsed', this, window, false);
    }
    window.___parseElement___ = parseElement;
    console.info('add domready support for parseElement event.');
}

function ___event() {

    var event = {

        /**
                         * Event Object
                         *
                         * @namespace
                         * @name ca.event
                         */
        /**
                         * @function
                         * @name remove
                         * @memberOf ca.event
                         * @param {Object}
                         *                name event name
                         * @param {eventCallBack}
                         *                callBack listener handle
                         * @param {Object?}
                         *                [target=window] event target
                         * @param {bool?}
                         *                [useCapture=false] useCapture
                         */
        remove: function(n, h, t, d) {
            d = (d === false || d === true) ? d : false;
            t = t || window;
            t.removeEventListener(n, h, d);
        },
        /**
                         * @function
                         * @name listen
                         * @memberOf ca.event
                         * @param {Object}
                         *                name event name
                         * @param {eventCallBack}
                         *                callBack listener handle
                         * @param {Object?}
                         *                [target=window] event target
                         * @param {bool?}
                         *                [useCapture=false] useCapture
                         * @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
                         */
        listen: function(n, h, t, d) {
            var re = /[\s]+/;
            var nameList = n.split(re);
            if (nameList.length > 0)
                n = nameList;
            if (typeof t !== 'undefined' && t !== null && !t.tagName && t !== window && t !== document)
                throw new Error('Target must be window , DOMElement or undefined');
            d = (d === false || d === true) ? d : false;
            t = t || window;
            var ns = (n instanceof Array) ? n : [n];
            for (var i = 0, c = ns.length; i < c; ++i) {
                var n = ns[i];

                t.addEventListener(n, h, d);

            }
            ;
        },
        /**
                         * @function
                         * @name raise
                         * @memberOf ca.event
                         * @param {Object}
                         *                name event name
                         * @param {Object}
                         *                arguments passed as event.detail
                         * @param {Object?}
                         *                [target=window] event target
                         * @param {bool?}
                         *                [bubbles=false] whether event bubbles
                         * @param {bool?}
                         *                [cancellable=true] whether event
                         *                cancellable
                         */
        raise: function(n, a, t, b, c, doTrace) {
            c = typeof c === 'undefined' || c === null ? true : c;

            b = typeof b === 'undefined' || b === null ? false : b;
            var e = window.event;
            if (e)
                e.preventDefault();
            if (window.CustomEvent) {
                var event = new CustomEvent(n,{
                    detail: a,
                    bubbles: b,
                    cancelable: c
                });
                t = t || window;
                if (doTrace === true)
                    console.trace('%c' + n, 'font-weight:bold;color:red;font-size:larger;');
                var cancelled = !t.dispatchEvent(event);
                return cancelled;
                // if(cancelled)
                // event.target.removeEventListener(event.type,
                // arguments.callee);
            }
        }
    };
    use('ca');
    ca.event = event;
}

window.use = function(ns) {
    // console.info('use ' + ns);
    var nsArr = ns.split(".");
    var ctx = window;
    for (var i = 0; i < nsArr.length; i++) {
        var n = nsArr[i];
        if (!ctx.hasOwnProperty(n))
            Object.defineProperty(ctx, n, {
                enumerable: true,
                configurable: false,
                writable: true,
                value: {}
            });
        ctx = ctx[n];

    }
    return ctx;

}
;

___event();
___domReady();
___parser();

___dom();

(function() {

    function simulateMouseEvents(element, eventName) {

        var mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent(eventName, true, true);
        //  mouseEvent.deltaY = +520;
        element.dispatchEvent(mouseEvent);
    }

    function firstToUpper(text) {
        if (!text.length)
            return '';
        text = text.toLocaleLowerCase('tr');

        var namesArr = text.split(' ');

        var parts = [];
        namesArr.forEach((n)=>{

            var ps = n.split('');
            n = ps.shift().toUpperCase() + ps.join('');

            parts.push(n);
        }
        )

        return parts.join(' ');

    }
    ;let wupLib = Object.create(null);
    wupLib.workers = Object.create(null)
    let sendMessage = function(message) {
        var find = ayanoglu.DOM.findElement;
        find('#main > footer > div._3pkkz.V42si.copyable-area > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text', 'textArea').then((element)=>{

            element.innerHTML = message;

            //Force refresh
            event = document.createEvent("UIEvents");
            event.initUIEvent("input", true, true, window, 1);
            element.dispatchEvent(event);

            //Click at Send Button
            ayanoglu.DOM.simulateMouseEvents(document.querySelector('span[data-icon="send"]'), 'click');

        }
        );
    }
    wupLib.workers.sendMessage = sendMessage;

      wupLib.makeWinShortcut = function(phone, name) {
         var wPhone = phone.replace(/[^\d]/g, '');
       if (/^[\d]{10}$/.test(wPhone))
            wPhone = '90' + wPhone;
        if (!/^9\d+/.test(wPhone))
            wPhone = '9' + wPhone;
        var link = 'api.whatsapp.com/send?phone=' + wPhone;
        if (name)
            link = '*' + name + '* ' + link;
        return link;
    }
    ;
    wupLib.workers.makeShortcut = function(label) {
        // console.clear();
        let find = ayanoglu.DOM.findElement;
        var infoSelector = '#main > header > div._5SiUq';
        var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div:nth-child(4) > div:nth-child(3) > div > div > span > span';
        var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span'

        find(infoSelector, 'Header').then((element)=>{
            ayanoglu.DOM.simulateMouseEvents(element, 'click');

            find(numSelector, 'Phone').then((phoneElement)=>{
                var phone = phoneElement.textContent;
                phone = phone.replace(/[^\d]/g, "");
                var link = 'api.whatsapp.com/send?phone=' + encodeURIComponent(phone);

                find(nameSelector, 'Name').then((nameElement)=>{
                    var name = nameElement.textContent;

                    var text = '*' + name + (label ? ' (' + label + ')' : '') + '* ' + link;
                    console.log(text);
                    copy(text);

                }
                )

            }
            )

        }
        );
    }
    let collectUnknownSenders = function() {

        //  console.clear();
        var textStack = [];
        var itemsCount = 1;
        var paneSelector = '#pane-side';
        var contacts = [];
        var groups = [];

        if (panel = document.querySelector(paneSelector)) {
            panel.scrollTo(0, 0);
            var i = 1;

            var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';
            var scroller = ()=>{

                var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));

                // console.log('items length', items.length);
                items.forEach((item)=>{
                    // item.style.border = "1px solid blue";

                    var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';

                    var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';
                    if (nameElement = item.querySelector(nameSelector)) {
                        var name = nameElement.textContent;
                        if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                            //   console.log(name);
                            if (contacts.indexOf(name) === -1)
                                contacts.push(name);

                        }

                        if (unReadElement = item.querySelector(unReadSelector)) {//  console.log(name);

                        }
                        itemsCount++;
                    }

                }
                );

                var y = panel.clientHeight * i;
                //  console.log(panel.scrollTop);
                panel.scrollTo(0, y);
                i++;

                if (panel.scrollHeight - panel.scrollTop > panel.clientHeight) {
                    setTimeout(scroller, 3)
                } else
                    finalize();
            }

            let finalize = ()=>{
                console.log('contacts: ', contacts.length);
                console.log('final', 'i: ' + i + ', itemsCount: ' + itemsCount);

                contacts.forEach((contact)=>{
                    var phone = contact;
                    var wPhone = phone.replace(/[^\d]/g, '');
                    var link = 'api.whatsapp.com/send?phone=' + wPhone;
                    textStack.push(link);
                    // output.appendLine(wPhone);
                }
                );
                var text = textStack.join('\r\n');
                ayanoglu.ui.panel(text);
                panel.scrollTo(0, 0);
            }

            scroller();

        }

    }

    wupLib.workers.collectUnknownSenders = collectUnknownSenders;

    function openChatPanel() {

        return new Promise((resolve,reject)=>{

            var selector = '#main > header > div._5SiUq';
            var name = 'Header';

            var element = document.querySelector(selector)
            if (!element) {
                console.error(`"${name}" not found`);
                reject();
            } else {
                ayanoglu.DOM.simulateMouseEvents(element, 'click');
                console.log(`"${name}" found`);
                resolve(element);
            }
        }
        );

    }

    wupLib.openChatPanel = openChatPanel;

    let collectGroupMembers = function(members, group) {

        return new Promise((finalResolve,finalReject)=>{
            if (typeof members === 'undefined')
                members = {};

            // console.clear();
            var textStack = [];
            var itemsCount = 1;
            var paneSelector = '#pane-side';
            var contacts = [];
            var groups = [];

            var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';
            var nameSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span._1qP8m > span';
            var phoneSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';

            openChatPanel().then(()=>{

                var name = 'Info Panel';
                var selector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div';

                ayanoglu.DOM.findElement(selector, name).then((infoPanelElement)=>{
                    //infoPanelElement.scrollTo(0,2000000);

                    let continueAfterExpander = ()=>{
                        var itemSelector = 'div.AfVTG > div  > div  > div > div._2wP_Y';
                        var i = 0;

                        var scroller = ()=>{

                            var items = Array.prototype.slice.call(infoPanelElement.querySelectorAll(itemSelector));

                            // console.log('items length', items.length);
                            items.forEach((item)=>{
                                // item.style.border = "1px solid blue";

                                if (phoneElement = item.querySelector(phoneSelector)) {
                                    var phone = phoneElement.textContent;
                                    if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(phone)) {

                                        if (nameElement = item.querySelector(nameSelector)) {
                                            var name = nameElement.textContent;
                                            // console.log(name, ",", phone);
                                            if (typeof members[phone] === 'undefined')
                                                members[phone] = {
                                                    name: name,
                                                    phone: phone
                                                }
                                            item.style.backgroundColor = 'yellow';
                                        }

                                    }

                                    if (unReadElement = item.querySelector(unReadSelector)) {//console.log(unReadElement.textContent);

                                    }
                                    itemsCount++;
                                }

                            }
                            );

                            var y = infoPanelElement.clientHeight * i;
                            //  console.log(panel.scrollTop);
                            infoPanelElement.scrollTo(0, y);
                            i++;

                            if (infoPanelElement.scrollHeight - infoPanelElement.scrollTop > infoPanelElement.clientHeight) {
                                setTimeout(scroller, 300)
                            } else {
                                //infoPanelElement.scrollTo(0, 0);

                                finalResolve(members)
                            }
                        }

                        setTimeout(scroller, 1)
                    }

                    var expanderSelector = 'div.AfVTG > div  > div._2EXPL._3xj48';

                    var exps = Array.prototype.slice.call(infoPanelElement.querySelectorAll(expanderSelector));

                    exps.forEach((exp)=>{
                        if (/\d+\s+more/.test(exp.textContent)) {
                            ayanoglu.DOM.simulateMouseEvents(exp, 'click');
                        }
                    }
                    );
                    continueAfterExpander();

                }
                )

            }
            );

        }
        )
    }

    wupLib.workers.collectGroupMembers = collectGroupMembers;
    let iterateUsers = function(callBack) {

        var unique = [];

        console.clear();
        var textStack = [];
        var itemsCount = 1;
        var paneSelector = '#pane-side';
        var contacts = [];
        var groups = [];
        var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';
        //unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div:nth-child(2) > span.OUeyt';
       
        var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';

        var groupNameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > div > span'

        var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';

        if (panel = document.querySelector(paneSelector)) {
            panel.scrollTo(0, 0);
            var i = 1;
            var stopped = false;

            var scroller = ()=>{

                var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));

                // console.log('items length', items.length);
                items.forEach((item,itemIndex)=>{
                    item.style.border = "1px solid blue";
                    var nameElement = item.querySelector(nameSelector);
                    var name = false;
                    var phone = false;
                    var unread = false;
var isGroup=false;
                    if (nameElement) {

                        name = nameElement.textContent;
                       

                       

                    } else if (groupElement = item.querySelector(groupNameSelector)) {
                        name = groupElement.textContent;
                        isGroup=true;
                    }

                    if (name) {

                        itemsCount++;
                         if (unique.indexOf(name) !== -1)
                            return false;

                        unique.push(name);

                        if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                            //   console.log(name);
                            phone = name;
                            name = false;

                        }

                         if (unReadElement = item.querySelector(unReadSelector)) {
                            unread = parseInt(unReadElement.textContent);
                        }
                        var args = {
                            name: name,
                            phone: phone,
                            unread: unread,
                            count: itemsCount,
                            index: itemIndex,
                            isGroup:isGroup
                        }

                        if (typeof callBack === 'function') {
                            if (callBack(args))
                                stopped = true;
                        }
                    }

                }
                );

                var y = panel.clientHeight * i;
                //  console.log(panel.scrollTop);
                if (!stopped) {
                    panel.scrollTo(0, y);
                    i++;

                    if (panel.scrollHeight - panel.scrollTop > panel.clientHeight) {
                        setTimeout(scroller, 100)
                    } else
                        finalize();
                } else {
                    panel.scrollTo(0, 0);
                }

            }

            let finalize = ()=>{
                if (typeof callBack === 'function')
                    callBack(false);
                panel.scrollTo(0, 0);
            }

            scroller();

        }

    }

    

    wupLib.workers.iterateUsers = iterateUsers;
    let collectUnknownNumbers = function(callBack) {
        return new Promise((resolve,reject)=>{

            // console.clear();
            var textStack = [];
            var itemsCount = 1;
            var paneSelector = '#pane-side';
            var contacts = [];
            var groups = [];
            if (panel = document.querySelector(paneSelector)) {
                panel.scrollTo(0, 0);
                var i = 1;
                var stopped = false;
                var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';

                var scroller = ()=>{

                    var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));

                    // console.log('items length', items.length);
                    items.forEach((item)=>{
                        // item.style.border = "1px solid blue";

                        var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';

                        var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';
                        if (nameElement = item.querySelector(nameSelector)) {
                            var name = nameElement.textContent;
                            if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                                //   console.log(name);
                                if (contacts.indexOf(name) === -1) {
                                    contacts.push(name);
                                    if (typeof callBack === 'function') {
                                        if (callBack(name))
                                            stopped = true;
                                    }
                                }
                                ;

                            }

                            if (unReadElement = item.querySelector(unReadSelector)) {//  console.log(name);

                            }
                            itemsCount++;
                        }

                    }
                    );

                    var y = panel.clientHeight * i;
                    //  console.log(panel.scrollTop);
                    if (!stopped) {
                        panel.scrollTo(0, y);
                        i++;

                        if (panel.scrollHeight - panel.scrollTop > panel.clientHeight) {
                            setTimeout(scroller, 3)
                        } else
                            finalize();
                    } else {
                        panel.scrollTo(0, 0);
                    }

                }

                let finalize = ()=>{

                    panel.scrollTo(0, 0);
                    resolve(contacts);
                }

                scroller();

            }

        }
        )
    }

    wupLib.workers.collectUnknownNumbers = collectUnknownNumbers;

    var hadiii = Object.create(null);

    hadiii.collectContactsWupLinks = function() {

        var d = window.document;
        var nameSelector = '#list-container-inner > div';
        var lines = [];
        var rows = d.querySelectorAll(nameSelector);
        rows.forEach((row)=>{
            if (nameNode = row.querySelector("div.name")) {
                console.log(nameNode.textContent);
                if (phoneNode = row.querySelector("div:nth-child(5) > a")) {
                    console.log(phoneNode.textContent)
                    var compNode = row.querySelector('div:nth-child(4)');
                    if (['Reyaphasta', 'Kolanhasta'].indexOf(compNode.textContent) !== -1)
                        lines.push(ayanoglu.wup.makeWinShortcut(phoneNode.textContent, nameNode.textContent + ' - ' + compNode.textContent));
                }
            }
        }
        );

        ayanoglu.ui.panel('*Last Added Unknown Numbers*\n\n' + lines.join('\n'));
    }
    ;

    var ui = Object.create(null);
    let dialogBase = function() {

        var cssText = `
 
 

.slide-in {
    transform: translate(100%,-110%);  
}

.slide-out {
    animation: slide-out 0.5s forwards;
    -webkit-animation: slide-out 0.5s forwards;
}
    
@keyframes slide-in {
    100% { transform: translate(100%,-100%); }
}

@-webkit-keyframes slide-in {
    100% { -webkit-transform: translate(100%,-100%); }
}
    
@keyframes slide-out {
    0% { transform: translate(100%,-110%); }
    100% { transform: translate(100%,10%); }
}

@-webkit-keyframes slide-out {
    0% { -webkit-transform: translate(100%,-110%); }
    100% { -webkit-transform: translate(100%,10%); }
}

        .ayanoglu-dialog-container {
            position: fixed;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
            z-index: 101000;
            background-color: rgba(0, 0, 0, 0.23);
        }
        .ayanoglu-dialog > div.f:empty {
    display: none
}

    `;
        ayanoglu.DOM.style(cssText);
        let _$ = ayanoglu.DOM._$;
        var d = window.document;

        let button = (text,handler)=>{
            var btn = _$('input').att('type', 'button').att('value', text).addTo(footer);
            btn.addEventListener('click', handler);
            return btn;
        }
        ;
        let addMenu = (text,handler)=>{
            var btn = _$('div').text(text).addTo(toolBar);
            btn.addEventListener('click', handler);
            return btn;
        }
        ;

        let makeDraggable = function(element) {
            var offSetX = 0
              , offSetY = 0;
            var dragging = false;

            let moveHandle = (e)=>{
                if (dragging) {
                    //element.style.cursor = "move";
                    document.body.style.cursor = "move";
                    // e.preventDefault();
                    var x = e.clientX
                      , y = e.clientY;

                    x -= offSetX;
                    y -= offSetY;

                    // console.info('move target',d.id,x,y);
                    element.style.left = x + 'px';
                    element.style.top = y + 'px';
                    return false;
                }
            }

            let clickHnd = (e)=>{

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            let unHook = ()=>{
                document.body.style.cursor = "default";
                dragging = false;
                document.body.removeEventListener('mousemove', moveHandle);
                document.body.removeEventListener('mouseup', bodyMouseUp);
                document.body.removeEventListener('click', clickHnd);
            }

            let bodyMouseUp = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                //element.style.cursor = "default";
                unHook();
            }

            element.addEventListener('mousedown', (e)=>{
            	 if('TEXTAREA,INPUT'.split(',').indexOf(e.target.tagName)!==-1) return false;
                 
                dragging = true;

                offSetX = (e.clientX - parseInt(getComputedStyle(element).left));
                offSetY = (e.clientY - parseInt(getComputedStyle(element).top));

                document.body.addEventListener('mousemove', moveHandle);
                document.body.addEventListener('mouseup', bodyMouseUp);
                document.body.addEventListener('click', clickHnd);
            }
            );

            element.addEventListener('mouseup', (e)=>{
                dragging = false;
                unHook();
            }
            );
        }
        var panelContainer = _$('div').cls('ayanoglu-dialog-container').addTo(document.body);
        var panel = _$('div').cls('ayanoglu-dialog').addTo(panelContainer);
        makeDraggable(panel);
        

      //  panel.classList.add('slide-in');
        var header = _$('div').cls('h').addTo(panel);

        var headerTxt = _$('div').cls('txt').text('Untitled').addTo(header);
        var headerCmd = _$('div').cls('cmd').addTo(header);

        var pWidth = panel.offsetWidth;
        var pLeft = panel.style.left;
        var pRight = panel.style.right;
        var resStyle = false;
        var arrLeft = _$('div').cls('icon-left').addTo(headerCmd);
        var arrRight = _$('div').cls('icon-right').addTo(headerCmd);
        var maxBtn = _$('div').cls('icon-window-maximize').addTo(headerCmd);
        var resBtn = _$('div').cls('icon-window-restore').css('display:none;').addTo(headerCmd);

        maxBtn.addEventListener('click', (e)=>{
            if (!resStyle)
                resStyle = panel.getAttribute('style');
            panel.style.width = 'auto';
            panel.style.left = '0px';
            panel.style.right = '0px';
            maxBtn.style.display = 'none';
            resBtn.style.display = 'block';

        }
        );

        resBtn.addEventListener('click', (e)=>{
            panel.setAttribute('style', resStyle);
            /* panel.style.width=  pWidth +  'px';
            	 panel.style.left=pLeft;
            	 panel.style.right=pRight;*/
            resBtn.style.display = 'none';
            maxBtn.style.display = 'block';

        }
        );

        arrLeft.addEventListener('click', (e)=>{
            panel.style.width = pWidth + 'px';
            panel.style.left = '0px';
            panel.style.right = 'auto';

        }
        );

        arrRight.addEventListener('click', (e)=>{
            panel.style.width = pWidth + 'px';
            panel.style.right = '0px';
            panel.style.left = 'auto';
        }
        );

        var closerBox = _$('div').cls('closer fnt-before').addTo(headerCmd);
        closerBox.addEventListener('click', (e)=>{
            //	ca.event.raise('will-close',{},panel,true);
            document.body.removeChild(panelContainer);

        }
        );

        var toolBar = _$('div').cls('t').addTo(panel);
        var body = _$('div').cls('b').addTo(panel);

        var footer = _$('div').cls('f').addTo(panel);

        var panelObj = {
            control: panel,
            button: button,
            menu: addMenu,
            add: (child)=>{
                body.add(child);
            }
        }

        Object.defineProperty(panelObj, 'container', {
            get: function() {
                return body;
            },
            set: function(v) {},

            configurable: false,
            enumerable: true
        })
        Object.defineProperty(panelObj, 'footer', {
            get: function() {
                return footer.style.display !== 'none';
            },
            set: function(v) {
                footer.style.display = v ? 'flex' : 'none';
            },

            configurable: false,
            enumerable: true
        })

        Object.defineProperty(panelObj, 'title', {
            get: function() {
                return headerTxt.textContent;
            },
            set: function(v) {
                headerTxt.textContent = v;
            },

            configurable: false,
            enumerable: true
        })

        return panelObj;
    };


function modalDialog(){
var dlg=dialogBase();
dlg.control.classList.add('slide-in');
dlg.control.classList.add('slide-out');
return dlg;
}

 

    ui.modalDialog = modalDialog;
    ui.dialog = dialogBase;

    let floatMenu = function() {
        var d = document;

        let _$ = ayanoglu.DOM._$;
        var d = document;
        var popId = 'pop-command-win';

        ayanoglu.DOM.style(`
    	#${popId} {
    	position:fixed;
    	top:50px;
    	left:450px;
    	z-index:1000000;
    	height:30px;
    	background-color:rgb(255,255,150);
    	border-radius:5px;
    	width: 30px;
        font-size: 24px; 
        align-items: center;
    	display:flex;
    	}


    	#${popId} > div  {
    	position:absolute;
    	left:30px;
        height: inherit;
    	background-color:inherit;
    	display:flex; 
    	transform-style: flat;
    	transform-origin: left 0px;
    	transition: transform transform 0.3s ease-out,opacity 0.5s ease-out;
    	transform: scale(0,1);
    	opacity: 0;
    	}
#${popId}:hover  {
    		border-radius:5px 0px 0px 5px; 
    		
    	} 
    	#${popId}:hover > div {
    		transform: scale(1,1);
    		opacity: 1;
    	} 

    	#${popId} > div  > div  
    	{
    	    display: flex;
    	    justify-content: center;
    	    align-items: center; 
    	    font-size: 19px;
    	    width: 30px;
    	    color: black; 
           cursor:pointer;
    	}
    	#${popId} > div  > div:last-child {
    	        
    	    border-radius:0px 5px 5px 0px;
    	}

#${popId} > div  > div + div {

    	    border-left: 1px groove rgba(226, 221, 221, 0.25);
}


#${popId}:before,
    	#${popId} > div > div:before {
    		color:inherit; 
    		font-size: inherit;
	font-style: normal !important;
	font-weight: normal !important;
	box-sizing: border-box;
	text-rendering: auto;
	-webkit-font-smoothing: antialiased;
    		/*content: "\\f0c9";*/
    	}

    	`);

        var popCommand = d.getElementById(popId);
        if (popCommand) {
            // test mode
            d.body.removeChild(popCommand);
            popCommand = undefined;
        }
        var container;
        if (!popCommand) {
            popCommand = _$('div').atts({
                'id': popId
            }).cls('icon-ellipsis').css('display:none;').addTo(d.body);

            container = _$('div').addTo(popCommand);
            var offSetX = 0
              , offSetY = 0;
            var dragging = false;
            let moveH = (e)=>{
                if (dragging) {
                    //popCommand.style.cursor = "move";
                    document.body.style.cursor = "move";
                    // e.preventDefault();
                    var x = e.clientX
                      , y = e.clientY;

                    x -= offSetX;
                    y -= offSetY;

                    // console.info('move target',d.id,x,y);
                    popCommand.style.left = x + 'px';
                    popCommand.style.top = y + 'px';
                    return false;
                }
            }

            let clickHnd = (e)=>{

                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            let unHook = ()=>{
                document.body.style.cursor = "default";
                dragging = false;
                document.body.removeEventListener('mousemove', moveH);
                document.body.removeEventListener('mouseup', bMouseUp);
                document.body.removeEventListener('click', clickHnd);
            }

            let bMouseUp = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                //popCommand.style.cursor = "default";
                unHook();
            }

            popCommand.addEventListener('mousedown', (e)=>{
                dragging = true;

                offSetX = (e.clientX - parseInt(getComputedStyle(popCommand).left));
                offSetY = (e.clientY - parseInt(getComputedStyle(popCommand).top));

                document.body.addEventListener('mousemove', moveH);
                document.body.addEventListener('mouseup', bMouseUp);
                document.body.addEventListener('click', clickHnd);
            }
            );

            popCommand.addEventListener('mouseup', (e)=>{
                dragging = false;
                unHook();
            }
            );

        } else {
            container = popCommand.firstElementChild;
        }

        return {
            add: (title,handle,className)=>{
                if (popCommand.style.display === 'none')
                    popCommand.style.display = 'flex';
                var btn = _$('div').cls(className ? className : 'icon-menu').atts({
                    title: title
                }).addTo(container);
                if (typeof handle === 'function')
                    btn.addEventListener('click', (e)=>{
                        handle(e);
                    }
                    )
            }
        }
    }

    let uiPanel = function(text) {

        var cssText = `
`;
        //ayanoglu.DOM.style(cssText);
        let _$ = ayanoglu.DOM._$;
        var textBox;

        var d = window.document;

        var panelID = 'snippet-working-panel';
        var panel = d.getElementById(panelID);
        var commandRow;

        let button = (text,handler)=>{
            var btn = _$('input').att('type', 'button').att('value', text).addTo(commandRow);
            btn.addEventListener('click', handler);
            return btn;
        }
        ;

        if (!panel) {
            panel = _$('div').addTo(document.body);

            panel.att('id', panelID);

            var header = _$('div').cls('header').addTo(panel);

            var pWidth = panel.offsetWidth;
            var pLeft = panel.style.left;
            var pRight = panel.style.right;
            var resStyle = false;
            var arrLeft = _$('div').cls('icon-left').addTo(header);
            var arrRight = _$('div').cls('icon-right').addTo(header);
            var maxBtn = _$('div').cls('icon-window-maximize').addTo(header);
            var resBtn = _$('div').cls('icon-window-restore').css('display:none;').addTo(header);

            maxBtn.addEventListener('click', (e)=>{
                if (!resStyle)
                    resStyle = panel.getAttribute('style');
                panel.style.width = 'auto';
                panel.style.left = '0px';
                panel.style.right = '0px';
                maxBtn.style.display = 'none';
                resBtn.style.display = 'block';

            }
            );

            resBtn.addEventListener('click', (e)=>{
                panel.setAttribute('style', resStyle);
                /* panel.style.width=  pWidth +  'px';
            	 panel.style.left=pLeft;
            	 panel.style.right=pRight;*/
                resBtn.style.display = 'none';
                maxBtn.style.display = 'block';

            }
            );

            arrLeft.addEventListener('click', (e)=>{
                panel.style.width = pWidth + 'px';
                panel.style.left = '0px';
                panel.style.right = 'auto';

            }
            );

            arrRight.addEventListener('click', (e)=>{
                panel.style.width = pWidth + 'px';
                panel.style.right = '0px';
                panel.style.left = 'auto';
            }
            );

            var closerBox = _$('div').cls('closer fnt-before').addTo(header);
            closerBox.addEventListener('click', (e)=>{
                ca.event.raise('will-close', {}, panel, true);
                document.body.removeChild(panel);

            }
            );

            textBox = _$('textarea');
            panel.appendChild(textBox);

            commandRow = _$('div').cls('command-box').addTo(panel);
            ;var closer = button('Kapat', (e)=>{
                ca.event.raise('will-close', {}, panel, true);
                document.body.removeChild(panel);

            }
            );

            var copier = button('Kopyala', (e)=>{

                textBox.select();
                document.execCommand('copy');

            }
            );
            var cleaner = button('Temizle', (e)=>{

                textBox.value = '';

            }
            );

            var label = _$('div').cls('label').addTo(panel);
            var labelTmo;

            let editContact = (e)=>{
                console.log(e.type);

                var sel = window.getSelection();
                var text = textBox.value;
                var lines = text.split('\n');
                var sPos = textBox.selectionStart;
                var counter = 0;
                var line = false;
                var lineNum = 0;
                for (var i = 0; i < lines.length; i++) {
                    if (sPos >= counter && sPos < counter + lines[i].length) {
                        line = lines[i];
                        lineNum = i;
                        break;
                    }
                    counter += lines[i].length + 1;

                }

                if (line) {
                    if (e.type === 'dblclick') {

                        let contactEditor = function(raw) {
                            let _$ = ayanoglu.DOM._$;
                            var d = window.document;

                            var cssText = `
`;
                            //ayanoglu.DOM.style(cssText);

                            var cId = 'contact-editor-panel'
                            var control = _$('div').att('id', cId).addTo(d.body);
                            var header = _$('div').cls('h').addTo(control);
                            var body = _$('div').cls('b').addTo(control);

                            var table = _$('div').cls('t').addTo(body);

                            this.data = raw;

                            var values = raw.split(',');
                            var headers = getGoogleContactCSVFields().array;

                            headers.forEach((header,i)=>{
                                var value = values[i];
                                value = value.replace(/^"(.*)"$/, '$1');
                                var row = _$('div').addTo(table);
                                var nameCell = _$('div').addTo(row).text(header);
                                var valueCell = _$('div').addTo(row);
                                var editor = _$('input').att('type', 'text').att('value', value).addTo(valueCell);
                                editor.addEventListener('change', function(i, ev) {
                                    var ed = ev.target;
                                    values[i] = '"' + ed.value + '"';
                                }
                                .bind(editor, i));

                            }
                            );

                            var footer = _$('div').cls('f').addTo(control);

                            var submit = _$('input').att('type', 'button').att('value', 'Kaydet').addTo(footer);

                            submit.onclick = (e)=>{
                                this.data = values.join(',');
                                if (typeof this.onSubmit === 'function')
                                    this.onSubmit(this.data);
                                d.body.removeChild(control);
                            }

                            var closer = _$('input').att('type', 'button').att('value', 'Kapat').addTo(footer);

                            closer.onclick = (e)=>{
                                d.body.removeChild(control);
                            }

                        };

                        var editor = new contactEditor(line);
                        editor.onSubmit = (data)=>{
                            lines[lineNum] = data;
                            textBox.value = lines.join('\n');
                            console.log(data);

                        }
                        ;
                        return;
                    }
                    textBox.selectionStart = counter;
                    textBox.selectionEnd = sPos;

                    var fields = document.getSelection().toString().split(',');
                    var gHeaders = getGoogleContactCSVFields();
                    textBox.selectionStart = sPos;
                    var headers = gHeaders.array;

                    var title = headers[fields.length - 1];

                    label.textContent = title;
                    label.style.display = 'flex';
                    label.style.left = e.clientX + 'px';
                    label.style.top = e.clientY + 'px';
                    clearTimeout(labelTmo);
                    labelTmo = setTimeout(()=>{
                        label.style.display = 'none';
                    }
                    , 5000)

                }

            }
            ;

            textBox.addEventListener('dblclick', editContact);
            textBox.addEventListener('mouseup', editContact);

        } else {
            textBox = panel.querySelector('textarea');
            commandRow = panel.querySelector('div.command-box');
        }

        if (text)
            textBox.value = text;
        var panelObj = {
            control: panel,
            button: button,
            append: (line)=>{
                textBox.value = textBox.value + line
            }
            ,
            appendLine: function(line) {
                textBox.value = textBox.value + '\n' + line
            },
            clear: ()=>{
                textBox.value = ''
            }
            ,
        }

        Object.defineProperty(panelObj, 'text', {
            get: function() {

                return textBox.value
            },
            set: function(v) {
                textBox.value = v
            },

            configurable: false,
            enumerable: true
        })

        return panelObj;
    }

    let selectionPop = function(handle, reset) {

        //  console.clear();

        let _$ = ayanoglu.DOM._$;
        var sId = 'selector-pop';

        ayanoglu.DOM.style(`

#${sId} {

position:fixed;
top:0px;
left:0px;
z-index:1000000;
background-color:rgb(215, 251, 253);
border-radius:5px; 
display:flex;
flex-direction:column;    
transform-origin: 0 0 ;
transform : scale(0);
opacity:0;
transition: transform 0.5s;
transition: opacity 0.9s;
height:600px;
}
#selector-pop * {
     font-size:14px;
}

#${sId}[class='pop'] {    
transform : scale(1);
opacity:1;

}

#${sId} > div.new {  
background-color:rgba(0, 0, 0, 0.15);
  display: flex;
   flex-direction: row;
   justify-content: space-between;
}


#selector-pop > div.new > div ,
#selector-pop > div.list > div {
    padding:14px;
    cursor: pointer;
}
 


#${sId} > div.list {   
display:flex;
flex-direction:column;  
    overflow-y:auto;
    flex-grow:2;
}
#${sId} > div.list > div {
    font-size: 14px;
    font-family: sans-serif;
    cursor: pointer;
    border-top: 1px solid #0000001c;
    display:flex;
     justify-content: space-between;
     align-items: center;

}


#${sId} > div.new > div { 
 padding: 12px; 
}

#${sId} > div > div.t { 
    padding: 12px;
}
#${sId} > div > div.icon-edit {
 margin-left:8px;
 margin-right:8px;
}

        `);
        var selectedText,listRow;
        var selPop = document.getElementById(sId);
        if (selPop && reset === true) {
            document.body.removeChild(selPop);
            selPop = undefined;
        }
        let openEditor = ()=>{

            chrome.storage.sync.get(storageKey, (result)=>{
                var values = result[storageKey];
                if (!values)
                    values = [];
                var dlg = new ayanoglu.ui.dialog();
                dlg.title = 'Replies';
                var frm = _$('div').cls('ayanoglu').addTo(dlg.container);

                let addEditor = (value,i)=>{
                    var row = _$('div').css('margin-bottom:10px;').addTo(frm);
                    var inputCell = _$('div').css(`display: flex;align-items: center;justify-content: space-between;`).addTo(row);
                    var valueElement = _$('textarea').css('width: -webkit-fill-available;').addTo(inputCell);
                    var delBtn = _$('div').att('title', (i === -1) ? 'Ekle' : 'Sil').css(`margin-left: 10px;`).cls(i === -1 ? 'icon-plus' : 'icon-eraser').addTo(inputCell);

                    valueElement.value = value ? value : '';

                    valueElement.addEventListener('change', (e)=>{
                        if (i === -1)
                            return false;

                        values[i] = e.target.value;

                        var data = {};
                        data[storageKey] = values;

                        chrome.storage.sync.set(data, ()=>{
                            loadMenu(true);

                        }
                        );
                    }
                    );

                    delBtn.addEventListener('click', (e)=>{

                        if (i !== -1 && !confirm('Mesaj silinecek !'))
                            return;

                        if (i === -1 && valueElement.value.trim().length === 0) {

                            alert('Mesaj girmediniz !');
                            return;
                        }

                        if (i === -1)
                            values.push(valueElement.value);
                        else
                            values.splice(i, 1)

                        var data = {};
                        data[storageKey] = values;

                        chrome.storage.sync.set(data, ()=>{
                            loadMenu(true);

                            frm.innerText = '';
                            addEditor(false, -1);
                            values.forEach(addEditor);

                        }
                        );
                    }
                    );

                }

                addEditor(false, -1);
                values.forEach(addEditor);

                var mnuData=dlg.menu('Data', ()=>{

                    frm.style.display = 'none';
                    mnuData.style.display='none';

                    var bulkRow=dlg.container.querySelector('div#bulk-editor');
                    if(!bulkRow){
                         bulkRow = _$('div').att('id','bulk-editor').css('margin-bottom:20px;');
                        dlg.container.insertBefore(bulkRow, frm);
                        var inputCell = _$('div').addTo(bulkRow);
                        var txtElement = _$('textarea').css('width: -webkit-fill-available;height:200px;margin-bottom:10px;').addTo(inputCell);
                        txtElement.value = JSON.stringify(values);

                        var saveBtn = _$('input').att('type', 'button').css('margin-left:0px;').att('value', 'Kaydet').addTo(inputCell);
                        saveBtn.addEventListener('click', (e)=>{
                           
                            var rawValue=txtElement.value;
                            var changedValues=JSON.parse(rawValue)
if(typeof changedValues==='object' && typeof changedValues.push==='function' ){
    values=changedValues;
       var data = {};
                        data[storageKey] = values;

                        chrome.storage.sync.set(data, ()=>{
                            loadMenu(true);
                            frm.style.display = 'unset';
                            mnuData.style.display = 'unset';
                             dlg.container.removeChild(bulkRow);
                            frm.innerText = '';
                            addEditor(false, -1);
                            values.forEach(addEditor);

                        }
                        );
}
else
{
    alert('Invalid list format!!!');
}


                           

                        }
                        )

                        var clsBtn = _$('input').att('type', 'button').att('value', 'Kapat').addTo(inputCell);
                        clsBtn.addEventListener('click', (e)=>{
                            frm.style.display = 'unset';
                            mnuData.style.display = 'unset';
                            dlg.container.removeChild(bulkRow);
                             mnuData.style.display='unset';
                            bulkRow=undefined;
                        }
                        )

                        saveBtn.disabled = true;
                        txtElement.addEventListener('change', (e)=>{
                            saveBtn.disabled = false;
                        }
                        ) 
                    }
                    

                }
                );

            }
            );

            return;

        }
        let loadMenu = (reset)=>{
            if (reset === true) {
                var items = Array.prototype.slice.call(listRow.children);
                items.forEach((item)=>{
                    if (item.className !== 'new')
                        listRow.removeChild(item);
                }
                );
            }
            chrome.storage.sync.get(storageKey, (result)=>{
                var values = result[storageKey];
                if (!values)
                    values = [];
                    values.sort((a, b) => a.localeCompare(b));
                values.forEach(addMenu)

            }
            );

        }
        let addMenu = (text)=>{
            var mnu = _$('div').addTo(listRow);
            var textElement = _$('div').text(text).cls('t').addTo(mnu);
            //  var editor = _$('div').cls('icon-edit').addTo(mnu);

            if (handle)
                textElement.addEventListener('click', (e)=>{
                    handle(textElement.textContent);
                }
                )
        }

        if (!selPop) {
            selPop = _$('div').atts({
                id: sId
            }).addTo(document.body);
            var storageKey = 'wup-message-replies';
            var editRow = _$('div').cls('new').addTo(selPop);
             var listRow = _$('div').cls('list').addTo(selPop);
            var addBtn = _$('div').text('Seçimi Ekle').addTo(editRow);

            var editBtn = _$('div').text('Düzenle').addTo(editRow);

            addBtn.addEventListener('click', (e)=>{
                var text = selectedText;

                chrome.storage.sync.get(storageKey, (result)=>{
                    var values = result[storageKey];
                    if (!values)
                        values = [];
                    if (values.indexOf(text) === -1)
                        values.push(text);
                    var data = {};
                    data[storageKey] = values;

                    chrome.storage.sync.set(data, ()=>{
                        loadMenu(true);

                    }
                    );

                }
                );

            }
            );

            editBtn.addEventListener('click', (e)=>{
                openEditor()
            }
            );

            loadMenu();

      

        }
        else {
            listRow=selPop.querySelector('div.list');
        }

        var selecting = false;
        let upHandler = (e)=>{
            if (e.target === selPop) {
                selPop.style.display = 'flex';
                return;
            }

            var sel = document.getSelection().toString();

            if ((sel.length > 0 && selecting === true) || (e.type === "dblclick" && e.target.contentEditable == "true")) {
                console.log(document.getSelection().toString());
                selecting = false;
                selectedText = sel;
                selPop.cls('pop');

                selPop.style.left = (e.clientX) + 'px';
                selPop.style.top = (e.clientY) + 'px';
                if (rects = selPop.getClientRects()) {
                    if (rect = rects[0]) {
                        console.dir(rect);

                        if (rect.bottom > document.body.clientHeight)
                            selPop.style.top = (document.body.clientHeight - rect.height) + 'px';

                    }
                }
            } else {
                selPop.cls('');
            }

        }

        document.body.addEventListener('dblclick', upHandler);
        //document.addEventListener('selectionchange', upHandler);

        document.addEventListener('selectstart', (e)=>{
            selecting = true;
        }
        );
        document.body.addEventListener('mouseup', upHandler);

    }
    ui.selectionPop = selectionPop;

    ui.floatMenu = floatMenu;
    ui.panel = uiPanel;

    let DOM = Object.create(null);

    let populate = function(element) {
        element.add = (child)=>{
            element.appendChild(child);
            populate(child);
            return child;
        }
        ;
        element.addTo = (container)=>{
            container.appendChild(element);
            return element;
        }
        ;
        element.css = function(cssText) {
            element.setAttribute('style', cssText);
            return element;
        }
        ;
        element.cls = function(className) {
            element.className = className;
            return element;
        }
        ;
        element.att = function(name, value) {
            element.setAttribute(name, value);

            return element;
        }
        element.atts = function(ats) {
            for (name in ats) {
                if (ats.hasOwnProperty(name))
                    element.setAttribute(name, ats[name]);
            }

            return element;
        }
        ;
        element['text'] = function(v) {
            element.textContent = v;
            return element;
        }
        ;
    }
    let _$ = function(tagName) {
        var element = document.createElement(tagName);

        populate(element);
        return element;
    }

    DOM._$ = _$;

    DOM.style = function(css) {
        var style = document.getElementById('snippet-style-sheet');
        if (!style)
            style = _$('style').atts({
                'type': 'text/css',
                'id': 'snippet-style-sheet'
            }).addTo(document.head);
        if (css)
            style.textContent += '\n' + css;
    }
    DOM.findElement = function(selector, name, root) {
        if (typeof name === 'undefined')
            name = selector;
        if (typeof root === 'undefined')
            root = document;
        return new Promise((resolve,reject)=>{
            if (element = root.querySelector(selector)) {

                console.log(`"${name}" found`);
                resolve(element);

            } else {
                reject();
                console.error(`"${name}" not found`);
            }
        }
        );
    }
    ;

    DOM.simulateMouseEvents = function(element, eventName) {

        var mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent(eventName, true, true);
        //  mouseEvent.deltaY = +520;
        element.dispatchEvent(mouseEvent);
    }

    let google = Object.create(null);

    function buildContactRow(contact) {
        var gHeaders = getGoogleContactCSVFields();

        var headers = gHeaders.array;

        var colsCount = headers.length;
        var nameRaw = contact.name;
        console.info('\t\t👍', nameRaw);

        var fullName = ''
          , firstName = ''
          , midName = ''
          , familyName = '';
        var phone = contact.phone;

        var wPhone = phone.replace(/[^\d]/g, '');

        if (!/^9\d+/.test(wPhone))
            wPhone = '9' + wPhone;
        var pat = /(.+\.+ =?)?(.+)/;

        if (ms = pat.exec(nameRaw)) {
            var nameParts = [];
            var name = ms[2];
            name = name.replace(/[\s]{2,}/, ' ');

            var namesUpper = name.split(' ');
            var names = [];
            namesUpper.forEach((n)=>{
                n = firstToUpper(n);
                names.push(n);
            }
            );

            if (names.length) {
                firstName = names.shift();
            }
            if (names.length)
                familyName = names.pop();
            if (names.length)
                midName = names.join(' ');

            if (firstName) {
                nameParts.push(firstName);
            }
            if (midName) {
                nameParts.push(midName);
            }
            if (familyName) {
                nameParts.push(familyName);
            }
            fullName = nameParts.join(' ');

        }

        var dept = '';
        var prefix = ''

        var notes = '';

        var values = Object.create({});
        values[0] = fullName;
        values[1] = firstName;
        values[2] = midName;
        values[3] = familyName;

        values[8] = prefix;

        if (contact.notes)
            values[25] = contact.notes.toString().replace(/\n/g, '\\n');

        if (contact.group) {
            values[28] = contact.group;
        }
        values[31] = contact.phoneLabel ? contact.phoneLabel : 'Mobile';
        values[32] = phone;

        if (contact.company) {
            values[39] = 'Work'
            values[40] = contact.company
        }

        if (contact.customFields) {
            var fieldCounter = 51;
            contact.customFields.forEach((field,i)=>{
                if (i > 4)
                    return;
                values[fieldCounter] = field.name;
                fieldCounter++;
                values[fieldCounter] = field.value;
                fieldCounter++;
            }
            );

        }

        /*
            values[33] = 'Work';
            values[34] = ext;

            values[35] = 'Deck';
            values[36] = deck;

           

            dept = title
            values[42] = dept;
            values[43] = title;
*/
        values[47] = 'Whatsapp';
        values[48] = 'https://wa.me/' + wPhone;

        var lineStack = [];

        for (var i = 0; i < colsCount; i++) {
            if (values.hasOwnProperty(i)) {
                // console.log(values[i]);
                lineStack.push('"' + values[i] + '"');
            } else
                lineStack.push('');

        }

        //console.log(lineStack);

        var gLine = lineStack.join(',');
        return gLine;
    }
    ;google.buildContactRow = buildContactRow;

    function getGoogleContactCSVFields() {
        var headersStr = '';
        headersStr += 'Name:name,';
        //0
        headersStr += 'Given Name:firstName,';
        //1
        headersStr += 'Additional Name:middleName,';
        //2
        headersStr += 'Family Name:familyName,';
        //3
        headersStr += 'Yomi Name,';
        //4
        headersStr += 'Given Name Yomi,';
        //5
        headersStr += 'Additional Name Yomi,';
        //6
        headersStr += 'Family Name Yomi,';
        //7
        headersStr += 'Name Prefix:prefix,';
        //8
        headersStr += 'Name Suffix:suffix,';
        //9
        headersStr += 'Initials,';
        //10
        headersStr += 'Nickname:nickName,';
        //11
        headersStr += 'Short Name,';
        //12
        headersStr += 'Maiden Name,';
        //13
        headersStr += 'Birthday:birthDay,';
        //14
        headersStr += 'Gender:gender,';
        //15
        headersStr += 'Location,';
        //16
        headersStr += 'Billing Information,';
        //17
        headersStr += 'Directory Server,';
        //18
        headersStr += 'Mileage,';
        //19
        headersStr += 'Occupation:occupation,';
        //20
        headersStr += 'Hobby,';
        //21
        headersStr += 'Sensitivity,';
        //22
        headersStr += 'Priority,';
        //23
        headersStr += 'Subject,';
        //24
        headersStr += 'Notes:notes,';
        //25
        headersStr += 'Language,';
        //26
        headersStr += 'Photo:photo,';
        //27
        headersStr += 'Group Membership,';
        //28
        headersStr += 'E-mail 1 - Type:email1Type,';
        //29
        headersStr += 'E-mail 1 - Value:email1Value,';
        //30
        headersStr += 'Phone 1 - Type:phone1Type,';
        //31
        headersStr += 'Phone 1 - Value:phone1Value,';
        //32
        headersStr += 'Phone 2 - Type:phone2Type,';
        //33
        headersStr += 'Phone 2 - Value:phone2Value,';
        //34
        headersStr += 'Phone 3 - Type:phone3Type,';
        //35
        headersStr += 'Phone 3 - Value:phone3Value,';
        //36
        headersStr += 'Phone 4 - Type:phone4Type,';
        //37
        headersStr += 'Phone 4 - Value:phone4Value,';
        //38
        headersStr += 'Organization 1 - Type:company1Type,';
        //39
        headersStr += 'Organization 1 - Name:company1Name,';
        //40
        headersStr += 'Organization 1 - Yomi Name,';
        //41
        headersStr += 'Organization 1 - Title:company1Title,';
        //42
        headersStr += 'Organization  1 - Department:company1Department,';
        //43
        headersStr += 'Organization 1 - Symbol,';
        //44
        headersStr += 'Organization 1 - Location,';
        //45
        headersStr += 'Organization 1 - Job Description,';
        //46
        headersStr += 'Website 1 - Type:webSite1Type,';
        //47
        headersStr += 'Website 1 - Value:webSite1Value,';
        //48
        headersStr += 'Organization 2 - Type,';
        //49
        headersStr += 'Organization 2 - Name,';
        //50
        headersStr += 'Custom Field 1 - Type:customField1Name,';
        //51
        headersStr += 'Custom Field 1 - Value:customField1Value,';
        //52
        headersStr += 'Custom Field 2 - Type:customField2Name,';
        //53
        headersStr += 'Custom Field 2 - Value:customField2Value,';
        //54
        headersStr += 'Custom Field 3 - Type:customField3Name,';
        //55
        headersStr += 'Custom Field 3 - Value:customField3Value,';
        //56
        headersStr += 'Custom Field 4 - Type:customField4Name,';
        //57
        headersStr += 'Custom Field 4 - Value:customField4Value,';
        //58
        headersStr += 'Custom Field 5 - Type:customField5Name,';
        //59
        headersStr += 'Custom Field 5 - Value:customField5Value';
        //60

        //Custom Field 1 - Type,Custom Field 1 - Value 

        var headerLines = headersStr.split(',');

var headers=[];
var properties={};
headerLines.forEach((line,i)=>{
    var lineSp=line.split(':');
    headers.push(lineSp[0]);
    if(propName=lineSp[1]) properties[i.toString()]=propName;
    else properties[i.toString()]=false;
});
        var colsCount = headers.length;
    
        return {
            'string': headers.join(','),
            'array': headers,
            "properties":properties
        }
    }

    google.parseContactCSVFields = getGoogleContactCSVFields;
    google.getGoogleContactCSVFields = getGoogleContactCSVFields;
    google.buildContactsCSV = function(contacts, groupText) {
        var gHeaders = getGoogleContactCSVFields();
        var headersStr = gHeaders.string;

        //Custom Field 1 - Type,Custom Field 1 - Value 

        var headers = gHeaders.array;

        var colsCount = headers.length;

        headers.forEach((h,i)=>{
            console.log(i, h);
        }
        );

        var gCsv = [headersStr];

        // pre aaa bbb ccc,aaa,bbb,ccc,,,,,pre,,,,,,,,,,,,,,,,,,,,* myContacts ::: * starred,Mobile,111111,Main,222 222 ::: 333 333,,Reyap Hastanesi,,title,dept,,,,Whatsapp,http://wup

        var hosp = '0 212 689 0339';
        var counter = 0;
        //69
        var title = '';
        for (key in contacts) {
            var contact = contacts[key];

            var gLine = buildContactRow(contact);

            gCsv.push(gLine);
            counter++;

        }

        console.log(gCsv.length, counter);
        var output = gCsv.join('\n');
        return output;
        //ayanoglu.ui.panel(output);

    }
    let utilities = Object.create(null);
    
    utilities.saveAsCSV= (text)=>{

       

        ayanoglu.utility.download("contacts-" + getFileNameStamp() + ".csv", text);
 
    };
    
    utilities.download = function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    
    utilities.formatName=(nameRaw)=>{
      
        var fullName = ''
          , firstName = ''
          , midName = ''
          , familyName = '';
    
        var pat = /(.+\.+ =?)?(.+)/;

        if (ms = pat.exec(nameRaw)) {
            var nameParts = [];
            var name = ms[2];
            name = name.replace(/[\s]{2,}/, ' ');

            var namesUpper = name.split(' ');
            var names = [];
            namesUpper.forEach((n)=>{
                n = firstToUpper(n);
                names.push(n);
            }
            );

            if (names.length) {
                firstName = names.shift();
            }
            if (names.length)
                familyName = names.pop();
            if (names.length)
                midName = names.join(' ');

            if (firstName) {
                nameParts.push(firstName);
            }
            if (midName) {
                nameParts.push(midName);
            }
            if (familyName) {
                nameParts.push(familyName);
            }
            fullName = nameParts.join(' ');

        }
        
        return {
        	fullName : fullName
                , firstName : firstName
                , midName : midName
                , middleName : midName
                , familyName: familyName
        }
    }
    
    utilities.copy = function(raw) {
        var element = _$('textarea').addTo(document.body);
        element.textContent = raw;
        element.select();
        document.execCommand('copy');
        document.body.removeChild(element);
    }

    utilities.upperCase = function(raw) {

        raw = raw.replace(/i/g, 'İ');
        raw = raw.toUpperCase();
        raw = raw.trim();
 return raw;
    }
      /*
      ayanoglu.utility.getHttpData('wup-replies').then((response)=>{
	for(key in response){
	   // console.log(response[key])
	   var text=response[key];
	      var item=_$('div').text(text).addTo(selPop);
	    if(handle)  item.addEventListener('click',(e)=>{
	             handle(e.target.textContent);
	      })
	}
}
, (status)=>{
	console.log(status)
}
);
    */
    utilities.getHttpData = function(name, serviceUrl) {

        return new Promise((resolve,reject)=>{

            console.log("%cSending request", 'color:red;font-size:25px;');
            var req = new XMLHttpRequest();

            var url = serviceUrl ? serviceUrl : 'https://script.google.com/macros/s/AKfycby5_PQTxNRMUcDueYj_buZqzRyo0AnW6Kfzkwy0vKfRzwNbqSo/exec';
            url += '?name=' + name;
            req.open("GET", url, true);

            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        resolve(JSON.parse(req.responseText))

                    } else {
                        reject(req.status);
                    }
                }
            }
            ;

            req.send();

        }
        );

    }

    window.ayanoglu = {
        utility: utilities,
        google: google,
        DOM: DOM,
        ui: ui,
        wup: wupLib,
        hadiii: hadiii
    };

    //console.clear();
    console.log('Ayanoglu Library Loaded');
    console.dir(ayanoglu);

    console.log('ca Library Loaded');
    console.dir(ca);

}
)();

console.log('bootstrap loaded');
