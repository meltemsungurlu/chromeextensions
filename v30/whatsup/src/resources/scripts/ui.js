//# sourceURL=@extension-resources-ui.js
let sharedStyle;

const injectStyleSheet = function(href) {

        console.log('injecting...' + href)
            // if(typeof document ==='undefined') return;
        var target = document.head || document.documentElement;
    
    
    
        var styles = document.styles || [];
        // in order not to load from multiple extension
        for (var i = 0; i < styles.length; i++) {
            let checkStyle = styles[i];
            if (checkStyle.href === href) {
                return;
                break;
            }
    
        }
    
        var addStyle = document.createElement('link');
        addStyle.rel = 'stylesheet';
        addStyle.type = 'text/css';
        addStyle.href = href;
        target.appendChild(addStyle);
    
    }
    
const addStyle = function(cssText) {

    if (!sharedStyle)
        sharedStyle = _$('style').atts({
            'type': 'text/css'
        }).addTo(document.head);
    if (cssText) {
        let tempStyle = document.getElementById('aSlrrExg5w');
        if (!tempStyle) {
            tempStyle = _$('style').atts({
                'type': 'text/css',
                'id': 'aSlrrExg5w'
            }).addTo(document.head);
            tempStyle.textContent = cssText;
        }
        let sheet = sharedStyle.sheet;
        let tempSheet = tempStyle.sheet;
        console.log(tempSheet.rules);
        Array.from(tempSheet.rules).forEach((newRule) => {
            if (!Array.from(sheet.rules).find((ruleTest) => {
                    return ruleTest.selectorText === newRule.selectorText &&
                        ruleTest.cssText === newRule.cssText;
                })) {
                sharedStyle.sheet.insertRule(newRule.cssText);
                console.log('rule', newRule.selectorText);
            }
        })
        tempStyle.remove();
    }
}



class panel {
    control;
    container;
    options;
    close(internal) {
        this.control.remove();
    };
    _closeHandles = [];
    onWillClose(handle) {
        this._closeHandles.push(handle);
    }
    add(content) {
        if (content instanceof HTMLElement) {
            this.container.appendChild(content)
        } else
            this.container.innerHTML = content;
        return content;
    };
    constructor(options) {
        options = options || {};
        this.options = options;
        let panelContainer = options.container || document.body;
        let _$ = ayanoglu.DOM._$;
        let control = _$('div').cls('ayanoglu-panel').addTo(panelContainer);
        if (options.controlStyle) control.css(options.controlStyle);
        let container = _$('div').cls('b').addTo(control);
        this.control = control;
        this.container = container;
    }
}

const makeDraggable = function(element) {
    var offSetX = 0,
        offSetY = 0;
    var dragging = false;

    let moveHandle = (e) => {
        if (dragging) {
            //element.style.cursor = "move";
            document.body.style.cursor = "move";
            // e.preventDefault();
            var x = e.clientX,
                y = e.clientY;

            x -= offSetX;
            y -= offSetY;

            // console.info('move target',d.id,x,y);
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            return false;
        }
    }

    let clickHnd = (e) => {

        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    let unHook = () => {
        document.body.style.cursor = "default";
        dragging = false;
        document.body.removeEventListener('mousemove', moveHandle);
        document.body.removeEventListener('mouseup', bodyMouseUp);
        document.body.removeEventListener('click', clickHnd);
    }

    let bodyMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        //element.style.cursor = "default";
        unHook();
    }

    element.addEventListener('mousedown', (e) => {
        if ('TEXTAREA,INPUT'.split(',').indexOf(e.target.tagName) !== -1) return false;

        dragging = true;

        offSetX = (e.clientX - parseInt(getComputedStyle(element).left));
        offSetY = (e.clientY - parseInt(getComputedStyle(element).top));

        document.body.addEventListener('mousemove', moveHandle);
        document.body.addEventListener('mouseup', bodyMouseUp);
        document.body.addEventListener('click', clickHnd);
    });

    element.addEventListener('mouseup', (e) => {
        dragging = false;
        unHook();
    });
}
class dialog extends panel {
    header;
    footer;
    close() {
        let internal = arguments[0];
        if (internal !== true) {
            let dlg = this;

            let args = { cancel: false };
            let cancel = this._closeHandles.some(closeHandle => {
                closeHandle.call(dlg, args)
                return args.cancel;
            })
            if (cancel) return;
        }
        super.close(internal);
        document.body.classList.remove('ayanoglu-modal');
    };
    constructor(options) {
        super(options);
        options = this.options;
        this.control.classList.add('extension-dialog', 'on');
        if (options.className) this.control.classList.add(options.className);

        let _$ = ayanoglu.DOM._$;


        let header = _$('div').cls('h');
        this.control.insertBefore(header, this.container);

        let hText = _$('div').text(options.title || 'Untitled').addTo(header);
        let closer = _$('i').cls('closer fnt-before').addTo(header);
        closer.addEventListener('click', (e) => {
            this.close(true);
        })


        let footer = _$('div').cls('f');
        this.control.appendChild(footer);

        document.body.classList.add('ayanoglu-modal');

        makeDraggable(this.control);
    }
}
class coreDialog extends dialog {
    constructor(options) {
        options.className = 'core-dialog';
        super(options);

    }
}
class promptDialog extends coreDialog {
    constructor(options) {
        super(options);

        addStyle(`
            .core-dialog  {
                padding:8px; 
                height:180px; 
            }
            .core-dialog .h > div {
                font-weight: 500 !important;
                font-size: 1.05rem !important;
            }
            .core-dialog div#buttons  {
                padding-top:8px;  
                width: -webkit-fill-available;
            }
            .core-dialog textarea  {
                width: -webkit-fill-available;
                height: 100%;
                box-sizing: border-box;
            }
            .core-dialog div#buttons > button {
                margin-right:8px;
                font-size: .87rem;
            }
    
            .core-dialog .inner-container {
                display:flex;
                flex-direction: column;
                padding:8px;
                width: -webkit-fill-available;
                height: 100%;
                box-sizing: border-box;
            }
    
            .core-dialog .inner-container > div:first-child {
                flex-grow: 10;
            }
    
            `);
        let controlID = ayanoglu.utilites.uniqid();
        this.add(`
    <div id="${controlID}" class="inner-container">
    
        <div>
        <textarea></textarea>
        </div>
    
         
            <div id="buttons">
            <button id="ok">Tamam</button>
            <button id="cancel">Vazgeç</button>
            </div> 
    
    </div>
    `);


        this.input = this.container.querySelector(':scope textarea');
        this.okBtn = this.container.querySelector(':scope button#ok');
        this.cancelBtn = this.container.querySelector(':scope button#cancel');
        if (options && options.text) this.input.value = options.text;

    }
    show() {
        this.control.classList.add('on');
        return new Promise(function(resolve, reject) {
            this.okBtn.addEventListener('click', (e) => {
                this.close();
                resolve(this.input.value)
            })

            this.cancelBtn.addEventListener('click', (e) => {
                this.close();
                reject(false);
            })


        }.bind(this))
    }
}



