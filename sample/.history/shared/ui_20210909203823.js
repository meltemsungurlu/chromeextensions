//# sourceURL=@chrome-extension-ui.js 
'use strict';
console.log('%cLoading ui.js...', 'color:red;');
(function library() {
    let selectionPop = function(handle, reset, storageKey = 'wup-message-replies') {

        const setData = (value) => {

            return new Promise((resolve, reject) => {
                var data = {};
                data[storageKey] = value;
                chrome.storage.sync.set(data, resolve);
            })
        }
        const getData = () => {
                return new Promise((resolve, reject) => {
                    chrome.storage.sync.get(storageKey, (result) => {
                        let values = result[storageKey];
                        if (!values)
                            values = [];
                        values.sort((a, b) => a.localeCompare(b));
                        resolve(values);

                    });
                })

            }
            //  console.clear();

            
        let _$ = ayanoglu.DOM._$;
        var sId = 'selector-pop';
        //   storageKey = 'wup-message-replies';

        var selPop = document.getElementById(sId);
        if (selPop && reset !== true) {
            document.body.removeChild(selPop);
            selPop = undefined;
        } else if (selPop) {

            return;
        }


        const isEditable = (target) => {
            return target.contentEditable == "true" || (target.tagName === "TEXTAREA" || target.tagName === "INPUT")
        }
        var selectedText;

        /**
         * @deprecated 
         */
        let openEditor = () => {

            chrome.storage.sync.get(storageKey, (result) => {
                var values = result[storageKey];
                if (!values)
                    values = [];

                var dlg = new ayanoglu.ui.controls.dialog();

                dlg.title = 'Replies';
                dlg.control.style.height = '-webkit-fill-available';
                var frm = _$('div').cls('ayanoglu').addTo(dlg.container);

                let addEditor = (value, i) => {
                    var valueObj = typeof value === 'object' ? value : {
                        text: value
                    };
                    value = valueObj.text;

                    var row = _$('div').css('margin-bottom:10px;').addTo(frm);
                    var inputCell = _$('div').css(`display: flex;align-items: center;justify-content: space-between;`).addTo(row);
                    var valueElement = _$('textarea').css('min-height:70px;width: -webkit-fill-available;').addTo(inputCell);
                    var toolBox = _$('div').cls('').addTo(inputCell);
                    var delBtn = _$('div').att('title', (i === -1) ? 'Ekle' : 'Sil').css(`margin-left: 10px;`).cls(i === -1 ? 'icon-plus' : 'icon-eraser').addTo(toolBox);

                    valueElement.value = value != false ? value : '';

                    valueElement.addEventListener('change', (e) => {
                        if (i === -1)
                            return false;

                        values[i] = e.target.value;

                        var data = {};
                        data[storageKey] = values;

                        chrome.storage.sync.set(data, () => {
                            renderListItems(true);

                        });
                    });

                    delBtn.addEventListener('click', (e) => {

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

                        chrome.storage.sync.set(data, () => {
                            renderListItems(true);

                            frm.innerText = '';
                            addEditor(false, -1);
                            values.forEach(addEditor);

                        });
                    });

                }

                addEditor(false, -1);
                values.sort((a, b) => a.localeCompare(b));
                values.forEach(addEditor);

                var mnuData = dlg.menu('Data', () => {

                    frm.style.display = 'none';
                    mnuData.style.display = 'none';

                    var bulkRow = dlg.container.querySelector('div#bulk-editor');

                    if (!bulkRow) {
                        bulkRow = _$('div').att('id', 'bulk-editor').css('margin-bottom:20px;');
                        dlg.container.insertBefore(bulkRow, frm);
                        var inputCell = _$('div').addTo(bulkRow);
                        var txtElement = _$('textarea').css('width: -webkit-fill-available;height:200px;margin-bottom:10px;').addTo(inputCell);
                        txtElement.value = JSON.stringify(values);

                        var saveBtn = _$('input').att('type', 'button').css('margin-left:0px;').att('value', 'Kaydet').addTo(inputCell);
                        saveBtn.addEventListener('click', (e) => {

                            var rawValue = txtElement.value;
                            var changedValues = JSON.parse(rawValue)

                            if (typeof changedValues === 'object' && typeof changedValues.push === 'function') {
                                values = changedValues;
                                var data = {};
                                data[storageKey] = values;

                                chrome.storage.sync.set(data, () => {
                                    renderListItems(true);
                                    frm.style.display = 'unset';
                                    mnuData.style.display = 'unset';
                                    dlg.container.removeChild(bulkRow);
                                    frm.innerText = '';
                                    addEditor(false, -1);
                                    values.forEach(addEditor);

                                });
                            } else {
                                alert('Invalid list format!!!');
                            }

                        })

                        var clsBtn = _$('input').att('type', 'button').att('value', 'Kapat').addTo(inputCell);
                        clsBtn.addEventListener('click', (e) => {
                            frm.style.display = 'unset';
                            mnuData.style.display = 'unset';
                            dlg.container.removeChild(bulkRow);
                            mnuData.style.display = 'unset';
                            bulkRow = undefined;
                        })

                        saveBtn.disabled = true;
                        txtElement.addEventListener('change', (e) => {
                            saveBtn.disabled = false;
                        });

                    }

                });

            });

            return;

        }

        const renderListItems = (reset) => {
            if (reset === true) {

                Array.from(listRow.children).forEach((item) => {
                    listRow.removeChild(item);
                });
            }
            getData().then((values) => {
//                 console.log(values);
                values.forEach(renderListItem)
            })

        }
        let selectedIndex = false;
        let selectedCollection = false;
        let formatDate = () => {

        }

        let formatItemText = (text) => {

            var reg = new RegExp('(\\$)(\\{)([^\{:]+:)([^\}:]+)(\\})', 'ig');
            let html = text.replace(reg, '<b>$4</b><span style="display:none;">#$2$3$4$5</span>');
            // console.log(reg.exec(text));
            // console.log(html);
            var title = text.replace(reg, '$2');

            reg = new RegExp('(\\$)(\\{)([^\{]+)(\\})', 'ig');
            html = html.replace(reg, '<b>$3</b><span style="display:none;">#$2$3$4</span>');

            reg = new RegExp('(%)(\\{)([^\{]+)(\\})', 'ig');
            html = html.replace(reg, '<b>$3</b><span style="display:none;">%$2$3$4</span>');


            title = title.replace(reg, '$2');
            return { html: html, title: title }
        }

        let formatItemOutput = (rawHtml) => {

            let reg = new RegExp('<b>(.+)<\/b><span style=\"display:none;\">\\#\\{([^\{:]+)\:\\1\\}<\/span>', 'i');

            do {
                var res = reg.exec(rawHtml);
                if (res) {
                    // debugger
                    var value = prompt(res[1]);
                    if (value == null || value.toString().trim().length === 0) {
                        return;
                    }
                    rawHtml = rawHtml.replace(reg, value)
                } else
                    break;
            } while (true)

            reg = new RegExp('<b>(.+)<\/b><span style=\"display:none;\">\\#\\{(\\1)\\}<\/span>', 'i');
            do {
                // debugger
                var res = reg.exec(rawHtml);
                if (res) {
                    var value = prompt(res[1]);
                    if (value == null || value.toString().trim().length === 0) {
                        return;
                    }
                    rawHtml = rawHtml.replace(reg, value)
                } else
                    break;
            } while (true)


            reg = new RegExp('<b>(.+)<\/b><span style=\"display:none;\">%\\{(\\1)\\}<\/span>', 'i');
            let d = new Date(),
                month = (d.getMonth() + 1).toString(),
                day = d.getDate().toString(),
                year = d.getFullYear().toString(),
                hour = d.getHours().toString(),
                min = d.getMinutes().toString();
            let dayName = d.toLocaleDateString("tr-TR", { weekday: 'long' });
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (hour.length < 2)
                hour = '0' + hour;
            if (min.length < 2)
                min = '0' + min;
            do {
                // debugger
                var res = reg.exec(rawHtml);
                if (res) {
                    let value;
                    var variable = res[1];
                    switch (variable) {
                        case "date":
                            value = [day, month, year].join('-') + ' ' + dayName;

                            break;
                        case "time":

                            value = [day, month, year].join('-') + ' ' + dayName + ' ' + hour + ':' + min;
                            break;
                    }
                    if (!(value == null || value.toString().trim().length === 0)) rawHtml = rawHtml.replace(reg, value)
                } else
                    break;
            } while (true)



            return rawHtml;
        }
        let renderListItem = (text, index, collection) => {

            var mnu = _$('div').addTo(listRow);

            let listFormat = formatItemText(text);
            let html = listFormat.html;
            let title = listFormat.title;

            var textElement = _$('div').att('title', title).cls('t').addTo(mnu);
            textElement.innerHTML = html;
            textElement.defaultValue = html;

            textElement.addEventListener('click', (e) => {


                if (selPop.classList.contains('editing')) {
                    selectedCollection = collection;
                    selectedIndex = index;
                    textEditor.value = text;
                    saveBtn.style.display = 'block';
                    addBtn.style.display = 'none';
                    return;
                }

                let rawHtml = formatItemOutput(textElement.innerHTML);


                if (handle) handle(rawHtml);
                selPop.classList.remove('pop');
                toggleRow.classList.remove('pop');
            })


        }

        ayanoglu.DOM.style(` 
        
            `);

        selPop = _$('div').atts({
            id: sId
        }).addTo(document.body);

        var header = _$('div').cls('header').addTo(selPop);

        var searchBox = _$('input').att('type', 'text').addTo(header);

        var onTopCk = _$('input').att('type', 'checkbox').addTo(header);
        var editModeButton = _$('i').cls('icon-cog').addTo(header);

        _$('i').cls('icon-window-close').addTo(header).addEventListener('click', () => {
            selPop.classList.remove('pop');
            selPop.classList.remove('editing');
            Array.from(listRow.querySelectorAll(':scope > div >div')).forEach((element) => {
                element.removeAttribute('contenteditable');
            })
        });


        var toggleRow = _$('div').cls('toggle').addTo(selPop);
        var textEditor = _$('textarea').cls('smart-scroll').addTo(toggleRow);
        var closeToggleBtn = _$('i').cls('icon-window-close').addTo(toggleRow);
        var addBtn = _$('i').cls('icon-plus').addTo(toggleRow);
        var saveBtn = _$('i').css('display:none').cls('icon-picture').addTo(toggleRow);

        var listRow = _$('div').cls('list').addTo(selPop);

        let saveTextData = (e) => {


            if (!selPop.classList.contains('editing')) return;


            var text = textEditor.value;

            if (text !== textEditor.defaultValue) {
                selectedCollection[selectedIndex] = text;
                setData(selectedCollection).then(() => {

                    textEditor.defaultValue = text;
                    textEditor.value = '';
                    selectedCollection = undefined;
                    selectedIndex = undefined;
                    addBtn.style.display = 'block';
                    saveBtn.style.display = 'none';
                    textEditor.defaultValue = '';

                    renderListItems(true);
                })

            }
        };
        let addTextData = (e) => {
            var text = textEditor.value;
            getData().then((values) => {
                if (values.indexOf(text) === -1)
                    values.push(text);
                setData(values).then(() => {
                    textEditor.value = '';
                    renderListItems(true);
                });
            })

            toggleRow.classList.remove('pop');
        };


        addBtn.addEventListener('click', addTextData);
        saveBtn.addEventListener('click', saveTextData)
        closeToggleBtn.addEventListener('click', () => {
            if (selPop.classList.contains('editing')) {
                selectedCollection = undefined;
                selectedIndex = undefined;
                addBtn.style.display = 'block';
                saveBtn.style.display = 'none';
                textEditor.textContent = '';
                textEditor.defaultValue = '';
                return;
            }
            toggleRow.classList.remove('pop');
        });

        editModeButton.addEventListener('click', (e) => {
            selPop.classList.toggle('editing');
            // Array.from(listRow.querySelectorAll(':scope > div >div')).forEach((element) => {
            //     element.att('contenteditable', 'true');
            // })
        });

        searchBox.addEventListener('mouseup', (e) => {
            e.stopPropagation()
        });
        searchBox.addEventListener('keydown', (e) => {
            e.stopPropagation()
        });
        let resetListSearch = () => {
            searchBox.value = '';
            Array.from(listRow.querySelectorAll('div')).forEach((row) => {
                row.style.display = 'block';
            })
        }
        let searchMessages = (e) => {
            var value = e.target.value;
            console.log(value);
            var filter = (row) => {

                var text = row.textContent;
                var re = new RegExp('.*' + value + '.*', 'i');
                return re.test(text);
            };
            var editor = (row) => {
                row.style.display = 'block';
            }
            var items = Array.from(listRow.querySelectorAll('div'));
            items.forEach((row) => {
                row.style.display = 'none';
            });
            var filtered = items.filter(filter);
            filtered.forEach(editor);
        };

        searchBox.addEventListener('keyup', searchMessages);

        renderListItems();

        let setPopPos = (e) => {
            if (isEditable(e.target)) {
                let rects = e.target.getClientRects();
                if (rects) {
                    let rect = rects[0]
                    if (rect) {
                        selPop.style.left = (rect.left + 20) + 'px';
                    }
                }
            } else {
                selPop.style.left = (e.clientX) + 'px';
            }

            selPop.style.top = (e.clientY) + 'px';
            let rects = selPop.getClientRects();
            if (rects) {
                let rect = rects[0]
                if (rect) {
                    console.dir(rect);

                    if (rect.bottom > document.body.clientHeight)
                        selPop.style.top = (document.body.clientHeight - rect.height) + 'px';
                    if (rect.right > document.body.clientWidth)
                        selPop.style.left = (document.body.clientWidth - rect.width) + 'px';

                }
            }
        }

        var selecting = false;
        let selectHandler = (e) => {

            if (typeof onWillSelectHandle === 'function') {
                if (onWillSelectHandle(e) === false) return;
            }
            if (selPop.contains(e.target))
                return;
            if (e.target === selPop) {
                return;
            }
            if (e.type === "mouseup" && !selecting) {
                if (!onTopCk.checked)
                    selPop.classList.remove('pop');
                toggleRow.classList.remove('pop');
                return;
            }
            var sel = document.getSelection().toString();

            if ((sel.trim().length > 0 && selecting === true) /*|| (e.type === "dblclick" && e.target.contentEditable == "true")*/ ) {
                console.log(document.getSelection().toString());
                selecting = false;
                selectedText = sel;
                selPop.classList.add('pop');

                textEditor.value = sel;

                setPopPos(e)

                toggleRow.classList.add('pop');

            } else {
                if (!onTopCk.checked && selPop.classList.contains('pop'))
                    selPop.classList.remove('pop');
            }
            selecting = false;
        }
        let doubleClickHandler = (e) => {


            if (isEditable(e.target)) {
                if (!selPop.classList.contains('pop')) {
                    selPop.classList.add('pop');
                    searchBox.focus();
                    setPopPos(e);
                }
            }

        }
        document.body.addEventListener('dblclick', doubleClickHandler);

        document.addEventListener('selectstart', (e) => {
            selecting = true;

        });

        document.body.addEventListener('mouseup', selectHandler);
        document.body.addEventListener('keydown', (e) => {
            if (selPop.contains(e.target))
                return;
            selPop.classList.remove('pop');
        });
        let onWillSelectHandle;

        var response = {

            show: (mousePos) => {
                renderListItems(true);
                selPop.cls('pop', true);
                setPopPos(mousePos);
            },
            hide: () => {
                selPop.cls('pop', false);
            }
        }

        Object.defineProperty(response, 'onWillSelect', {
            get: function() {
                throw new Error('onWillSelect is write-only');

            },
            set: function(v) {
                if (typeof v !== 'function') throw new Error('onWillSelect handle must be function');
                onWillSelectHandle = v
            },

            configurable: false,
            enumerable: true
        })

        return Object.create(response);
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
            this.control.classList.add('extension-dialog','on');
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

            ayanoglu.DOM.style(`
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
            let controlID = utility.uniqid();
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
    use('window.ayanoglu.ui.controls');



    window.ayanoglu.ui.controls.dialog = dialog;
    window.ayanoglu.ui.controls.promptDialog = promptDialog;
    window.ayanoglu.ui.controls.selectionPop = selectionPop;
    window.ayanoglu.ui.controls.templateSelector = selectionPop;
})();