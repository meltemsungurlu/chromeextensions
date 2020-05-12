var d = document;

addEventListener('load', ()=>{

    var pop = ayanoglu.ui.floatMenu();
    pop.add('Open Group Member Collector', ()=>{
        collectGroupMembers()
    }
    , 'icon-doc-text');

    pop.add('Parse Member Info', ()=>{
        memberEditor();
    }
    , 'icon-phone');

    pop.add('Collect Numbers', ()=>{
        collectUnknownNumbers()
        /*  ayanoglu.utility.getHttpData('wup-replies').then((response)=>{
            console.log(response);
        }
        );*/
    }
    , 'icon-export');

    pop.add('Translate', ()=>{
        var dlg = ayanoglu.ui.modalDialog();
        dlg.control.style.height = '500px'
        dlg.title = 'Translate';
        let _$ = ayanoglu.DOM._$;
        var txtArea = _$('textarea').css(`width: -webkit-fill-available;
    height: 100%;`).addTo(dlg.container);

        dlg.button('Convert', ()=>{
            txtArea.value = ayanoglu.utility.upperCase(txtArea.value);
        }
        )

    }
    , 'icon-up-hand');

}
)

var csvStack = [];
let memberEditor = function() {

    parseContactInfo().then((contact)=>{
        console.dir(contact);

        if (contact.saved) {

            var dlg = ayanoglu.ui.modalDialog();
            dlg.control.style.height = '300px';
            let _$ = ayanoglu.DOM._$;

            var table = _$('div').cls('ayanoglu flex-form').addTo(dlg.container);

            let addField = (label,name,tag,index,value)=>{
                var row = _$('div').att('id', 'field-' + index).addTo(table);

                var labelCell = _$('div').text(label + (index > -1 ? ` (${index})` : '')).addTo(row);

                var inputCell = _$('div').addTo(row);
                var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
                if (value)
                    input.value = value;
                row.getValue = ()=>{
                    return input.value;
                }
                return input;
            }
            var nameElement = addField('Etiket', 'label', false, -1, contact.name);
            var txtElement = addField('Etiket', 'text', 'textarea', -1);

            dlg.button('Oluştur', ()=>{
                var link = ayanoglu.wup.makeWinShortcut(contact.phone, nameElement.value);
                txtElement.value = link;
                ayanoglu.utility.copy(link);
            }
            );

        } else {
            var dlg = ayanoglu.ui.dialog();
            dlg.control.style.height = '100%'
            dlg.title = contact.name;
            var frm = contactForm(dlg, dlg.container, contact);

            dlg.button('Ekle', ()=>{
                var line = frm.getCsv();
                csvStack.push(line);
            }
            );

            dlg.button('Liste', ()=>{
                var gHeaders = ayanoglu.google.parseContactCSVFields();
                var headersStr = gHeaders.string;
                var cLines = csvStack.slice();

                cLines.unshift(headersStr)

                var output = cLines.join('\n');
                var showDlg = ayanoglu.ui.dialog();

                showDlg.title = 'CSV Text';

                showDlg.control.style.width = '700px';
                showDlg.control.style.right = '0px';
                showDlg.control.style.left = 'auto';
                var textElement = _$('textarea').css('margin: 0px; height: 100%; width: -webkit-fill-available;white-space: nowrap;').addTo(showDlg.container);
                textElement.value = output;

            }
            )

            dlg.button('Sıfırla', ()=>{
                csvStack = [];
            }
            );

        }

    }
    );
}

function collectUnknownNumbers() {

    var dlg = ayanoglu.ui.dialog();

    dlg.title = 'Unknown Numbers';

    dlg.control.style.width = '800px';
    dlg.control.style.right = '0px';
    dlg.control.style.left = 'auto';
    var textElement = _$('textarea').css('margin: 0px; height: 100%; width: -webkit-fill-available;white-space: nowrap;').addTo(dlg.container);

    var stack = [];

    ayanoglu.wup.workers.iterateUsers((contact)=>{
        if (contact === false) {

            return;
        }
        if (contact.name === false) {
            var link = ayanoglu.wup.makeWinShortcut(contact.phone);
            if (stack.length % 10 === 0) {
                textElement.value += '\n\n\n*Group ' + (stack.length / 10) + '*\n\n';
            }
            textElement.value += link + '\n';
            console.log(link);
            stack.push(link);

        }
    }
    );

}

function getFileNameStamp() {
    var d = new Date()
      , month = '' + (d.getMonth() + 1)
      , day = '' + d.getDate()
      , year = d.getFullYear()
      , hour = d.getHours()
      , min = d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour.length < 2)
        hour = '0' + hour;
    if (min.length < 2)
        min = '0' + min;

    return [year, month, day, hour, min].join('-');
}

ayanoglu.ui.selectionPop((text)=>{
    console.log(text);
    ayanoglu.wup.workers.sendMessage(text);
}
, true);

let contactForm = function(dlg, container, contact) {
    ayanoglu.DOM.style(`
     .flex-form select {
         padding:8px;
         }
.flex-form > div {
   padding-bottom: 15px;
    margin-top: 15px;
    margin-bottom: 0px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.flex-form > div > div:first-child {
    margin-bottom:7px;
}
     `);

    let _$ = ayanoglu.DOM._$;

    var table = _$('div').cls('ayanoglu flex-form').addTo(container);

    var fields = ayanoglu.google.parseContactCSVFields().array;

    let addField = (label,name,tag,index,value)=>{
        var row = _$('div').att('id', 'field-' + index).addTo(table);
        if (sumMap.split(',').indexOf(index.toString()) === -1)
            row.style.display = 'none';
        var labelCell = _$('div').text(label + ` (${index})`).addTo(row);

        var inputCell = _$('div').addTo(row);
        var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
        if (value)
            input.value = value;
        row.getValue = ()=>{
            return input.value;
        }
        return input;
    }
    ;

    var contactMap = {
        "0": "name",
        "28": {
            value: "WUP ::: * myContacts"
        },
        "31": {
            value: "mobile"
        },
        "32": "phone",
        "39": {
            value: "work"
        },
        "40": {
            options: ['Reyaphasta', 'Kolanhasta', 'Verahasta']
        },
    }
    var sumMap = '0,8,25,28,31,32,39,40,42,43';

    fields.forEach((field,i)=>{
        if (/.+\s+Yomi/i.test(field) || /Yomi\s+.+/i.test(field))
            return;

        var tag;
        if (field === "Notes")
            tag = "textarea";
        var value;
        var map = contactMap[i];
        if (map) {
            if (typeof map === 'string') {
                value = contact[map];
            } else {
                if (map.value)
                    value = map.value;
                if (map.options)
                    tag = "select";
            }
        }
        var input = addField(field, 'field-' + i, tag, i, value);
        if (tag === "select") {
            map.options.forEach((option)=>{
                _$('option').att('value', option).addTo(input).textContent = option;
            }
            )
        }
    }
    )
    let toggleField = (on)=>{
        fields.forEach((field,i)=>{
            if (row = table.querySelector('div#field-' + i)) {
                if (on)
                    row.style.display = 'unset';
                else if (sumMap.split(',').indexOf(i.toString()) === -1)
                    row.style.display = 'none';
            }
        }
        )

    }

    dlg.menu('Summary', ()=>{
        toggleField(false);
    }
    );
    dlg.menu('Full', ()=>{
        toggleField(true);
    }
    );

    let buildContactText = ()=>{
        var formValues = [];

        fields.forEach((field,i)=>{
            var value;
            if (row = table.querySelector('div#field-' + i)) {
                value = row.getValue();
            } else
                value = "";

            formValues.push(value);

        }
        )

        var name = formValues[0];
        var nameObj = ayanoglu.utility.formatName(name);
        formValues[0] = nameObj.fullName;
        formValues[1] = nameObj.firstName;
        formValues[2] = nameObj.midName;
        formValues[3] = nameObj.familyName;

        var phone = formValues[32]
        var wPhone = phone.replace(/[^\d]/g, '');
        if (!/^9\d+/.test(wPhone))
            wPhone = '9' + wPhone;
        formValues[47] = 'Whatsapp';
        formValues[48] = 'https://wa.me/' + wPhone;

        var values = formValues.map((item)=>{
            return '"' + item + '"';
        }
        );

        var output = values.join(',');

        return output;
    }

    let saveAsCSV = ()=>{

        var output = getCSVText();

        ayanoglu.utility.download("contacts-" + getFileNameStamp() + ".csv", output);
        csvStack = [];
    }
    ;

    let addToStack = ()=>{
        buildContactText();
    }

    let resetStack = ()=>{
        csvStack = [];
    }

    /*
    dlg.button('Ekle', addToStack    );
    dlg.button('Temizle', resetStack    );
    dlg.button('Kayıtlar', showCSV    );
    dlg.button('Kaydet', saveAsCSV    );
*/
    var obj = {
        getCsv: buildContactText
    };

    return obj;
}

ayanoglu.ui.contactForm = contactForm;

let parseContactInfo = function() {
    return new Promise((resolve,reject)=>{
        ayanoglu.wup.openChatPanel().then((element)=>{
            var find = ayanoglu.DOM.findElement;

            var saved = false, name, phone;
            var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span';
            find(numSelector, 'Phone').then((numElement)=>{
                // console.log(numElement.textContent);

                phone = numElement.textContent;
                var num = phone.replace(/[^\d]/g, '');
                if (!/[\d]{10,}/.test(num)) {
                    // saved
                    name = phone;
                    numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div:nth-child(4) > div:nth-child(3) > div > div > span > span'

                    find(numSelector, 'Phone').then((phoneElement)=>{
                        //  console.log(nameElement.textContent);
                        var phone = phoneElement.textContent
                        resolve({
                            name: name,
                            phone: phone,
                            saved: true
                        });

                    }
                    , ()=>{

                        reject();
                    }
                    )

                } else {
                    var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > div:nth-child(3) > span > span';
                    find(nameSelector, 'Name').then((nameElement)=>{
                        //  console.log(nameElement.textContent);
                        name = nameElement.textContent
                        resolve({
                            name: name,
                            phone: phone,
                            saved: false

                        });

                    }
                    , ()=>{

                        resolve({
                            phone: phone,
                            saved: false
                        });
                    }
                    )
                }

            }
            , reject)
        }
        , reject);

    }
    )

}

let download = ayanoglu.utility.download;

if (typeof window.contacts === 'undefined')
    window.contacts = {};

let buildContactCSV = function(contact) {
    var csvFields = ayanoglu.google.parseContactCSVFields();
    var contactMap = csvFields.properties;
    var fields = csvFields.array;
    var values = [];
    fields.forEach((field,i)=>{
        var propertyName = contactMap[i.toString()];
        var value = "";
        if (propertyName)
            value = contact[propertyName];
        if (value && value.length)
            value = '"' + value + '"';
        values.push(value);
    }
    )
    return values.join(',');
}

let parseContactCSV = function(csv) {

    var contactMap = ayanoglu.google.parseContactCSVFields().properties;

    var values = csv.split(',');
    values = values.map((item)=>{
        return item.replace(/\"/g, '');
    }
    );
    var contact = {};

    values.forEach((value,i)=>{
        if (propertyName = contactMap[i.toString()])
            contact[propertyName] = value;
    }
    );

    var name = contact.name;
    var nameObj = ayanoglu.utility.formatName(name);

    contact.name = nameObj.fullName;
    contact.firstName = nameObj.firstName;
    contact.middleName = nameObj.midName;
    contact.familyName = nameObj.familyName;

    // console.dir(contact);

    //  console.dir(values);
    return contact;
}

var panelControl;
let collectGroupMembers = function() {

    console.clear();

    let collectMembers = ()=>{

        ayanoglu.wup.workers.collectGroupMembers(contacts).then((members)=>{
            contacts = members;
            console.dir(contacts);
            var str = ayanoglu.google.buildContactsCSV(contacts);

            ayanoglu.utility.copy(str);
            setTimeout(()=>{
                textBox.value = str;
            }
            , 1);

        }
        , ()=>{}
        );
    }

    var dlg = ayanoglu.ui.dialog();
    dlg.title = 'Grup üyeleri'
    dlg.control.style.height = '100%';
    var textBox = _$('textarea').css(`height:100%;
width:-webkit-fill-available;
white-space:nowrap;
`).addTo(dlg.container);

    var label = _$('div').css(`background-color:aliceblue;
        z-index:10000000;
        position:fixed; 
    display: none;
    align-items: center;
    justify-content: flex-end;
    padding:7px;
    border-radius:4px;
    border: 1px solid lightblue;`).addTo(dlg.container);

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
                    var headers = ayanoglu.google.parseContactCSVFields().array;

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
                console.clear();
                console.log(line);
                var contact = parseContactCSV(line);
                console.dir(contact);
                //console.log(buildContactCSV(contact)) ;


                
                var contactDlg = ayanoglu.ui.dialog();
                contactDlg.control.style.height = '100%'
                contactDlg.title = contact.name;
                var frm = ayanoglu.ui.contactForm(contactDlg, contactDlg.container, contact);

                contactDlg.button('Kaydet', ()=>{
                    var csv = frm.getCsv();
                    lines[lineNum] = csv;
                    textBox.value = lines.join('\n');

                    contactDlg.close();
                    contactDlg = undefined;
                    frm = undefined;

                }
                )
                ;
                return;
            }
            textBox.selectionStart = counter;
            textBox.selectionEnd = sPos;

            var fields = document.getSelection().toString().split(',');
            var gHeaders = ayanoglu.google.parseContactCSVFields();
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

    dlg.button('Collect', collectMembers);
    dlg.button('Reset', ()=>{}
    );
    dlg.button('List', ()=>{
        let addLocalStyle = function(element, css) {
            var style = _$('style').atts({
                'type': 'text/css',
            }).addTo(element);
            if (css)
                style.textContent += '\n' + css;
        }
        let _$ = ayanoglu.DOM._$;
        var listPop = ayanoglu.ui.modalDialog();
        listPop.title = 'Liste';
        listPop.control.css(`width:600px;`);
        var csvFields = ayanoglu.google.parseContactCSVFields();
        var contactMap = csvFields.properties;
        var fields = csvFields.array;

        addLocalStyle(listPop.container, `
div.contact-table {
    display:table;
    border-spacing: 0px 0px;
   border-left:1px solid rgba(0,0,0,0.09);
   border-top:1px solid rgba(0,0,0,0.09);
}

div.contact-table > div {
   display:table-row;
}

div.contact-table > div > div {
   display:table-cell;
   white-space:nowrap;
   padding:9px;
   border-bottom:1px solid rgba(0,0,0,0.09);
   border-right:1px solid rgba(0,0,0,0.03);
}

div.contact-table > div:first-child > div {
   background-color: rgba(0,0,0,0.09);
   border-bottom:1px solid rgba(0,0,0,0.09);
}

`)

        var table = _$('div').cls('contact-table').addTo(listPop.container);
        var csvLines = textBox.value.split('\n');
        csvLines.forEach((csvLine)=>{

            var row = _$('div').css(``).addTo(table);

            var cCsvArr = csvLine.split(',');
            fields.forEach((field,i)=>{
                var value = cCsvArr[i].replace(/\"/g, '');
                ;var cell = _$('div').css(``).text(value).addTo(row);
            }
            )
        }
        );

    }
    );
    dlg.button('Save', ()=>{}
    );

    collectMembers();

    return 'Collect group members';

    if (typeof panelControl === 'undefined') {
        panelControl = ayanoglu.ui.panel();
        ca.event.listen('will-close', ()=>{
            panelControl = undefined;
        }
        , panelControl.control);
        let writeToPanel = ()=>{
            var str = ayanoglu.google.buildContactsCSV(contacts);

            ayanoglu.utility.copy(str);
            setTimeout(()=>{
                panelControl.text = str;
            }
            , 1);

        }
        writeToPanel();
        panelControl.button('Collect Members', ()=>{

            ayanoglu.wup.workers.collectGroupMembers(contacts).then((members)=>{
                contacts = members;
                console.dir(contacts);

                writeToPanel();

            }
            , ()=>{}
            );
        }
        );

        panelControl.button('Reset Members', ()=>{
            window.contacts = {};
            panelControl.text = '';
        }
        );

        panelControl.button('Save', ()=>{
            download("wup-contacts.csv", panelControl.text);
        }
        );
    }

    panelControl.control.style.bottom = '10px';
    panelControl.control.style.top = '10px';
    panelControl.control.style.left = '0px';
    panelControl.control.style.width = '300px';
    panelControl.control.style.right = 'auto';

}

let formatNames = function(container) {
    var fmtArr = [];
    var text = container.value;
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.length === 0)
            continue;
        var items = line.split(';');

        var str = items[0];
        while (str.search(/  /gi) !== -1)
            str = str.replace(/  /gi, ' ');
        var names = str.split(' ');

        for (var ii = 0; ii < names.length; ii++) {

            var item = names[ii];
            item = item.replace(/I/g, 'ı');
            // item=item.replace('Ğ','ğ');
            // item=item.replace('Ş','ş');
            // item=item.replace('Ğ','g');
            item = item[0].toLocaleUpperCase() + item.slice(1).toLocaleLowerCase();
            names[ii] = item;
        }
        str = names.join(' ');
        fmtArr.push(str + ';' + items[1]);
    }
    container.value = fmtArr.join('\n');

}

function replaceSelectedText(cb) {
    var sel, range;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            var replacementText = cb(sel.toString());
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        var replacementText = cb(range.text);
        range.text = replacementText;
    }
}
function menuHandler(menu, info, tab) {

    if (info.menuItemId === 'wup-selection') {
        if (!info.selectionText)
            return;
        var cb = (selectionText)=>{
            var d = document
              , e = encodeURI;
            var f = 'https://api.whatsapp.com/send';
            var p = '?text=' + e(selectionText);
            var url = f + p + '\n\n\n' + selectionText;
            return url
        }
        ;

        replaceSelectedText(cb);

        // location.href=url;
        // var strWindowFeatures =
        // "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
        // window.open( url, "wup-this",strWindowFeatures);

        return;

    }

}

utility.addMenuItems([{
    'id': 'wup-selection',
    'title': 'Send  "%s" to Whatsapp',
    'contexts': ['selection']
}, {
    'id': 'entity',
    'title': 'Collect Entity',
    'contexts': ['link']
}/*, {
    'id': 'phones',
    'title': 'Collect phones',
    'contexts': ['page']
}*/
]);
utility.addMenuListener(menuHandler);
