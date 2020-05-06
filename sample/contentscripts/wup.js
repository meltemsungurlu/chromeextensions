var d = document;

addEventListener('load', ()=>{

    var pop = ayanoglu.ui.floatMenu();
    pop.add('Open Group Member Collector', ()=>{
        collectWupMembers()
    }
    , 'icon-doc-text');

    pop.add('Parse Member Info', ()=>{
        parseContactInfo().then((contact)=>{
            console.dir(contact);

            var dlg = ayanoglu.ui.dialog();

            dlg.title = contact.name;
            var frm = contactForm(dlg, dlg.container, contact)

        }
        );
    }
    , 'icon-phone');

}
)



ayanoglu.ui.selectionPop((text)=>{
    console.log(text);
    ayanoglu.wup.workers.sendMessage(text);
}
, true);

let contactForm = function(dlg, container, contact) {
    //ayanoglu.DOM.style(``);

    let _$ = ayanoglu.DOM._$;

    var table = _$('div').cls('ayanoglu flex-form').addTo(container);

    var fields = ayanoglu.google.getGoogleContactCSVFields().array;

    let addField = (label,name,tag,index,value)=>{
        var row = _$('div').att('id', 'field-' + index).addTo(table);
        if (sumMap.split(',').indexOf(index.toString()) === -1)
            row.style.display = 'none';
        var labelCell = _$('div').text(label + ` (${index})`).addTo(row);

        var inputCell = _$('div').addTo(row);
        var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
        if (value)
            input.value = value;
        input.addEventListener('change', (e)=>{
            var value = e.target.value
        }
        )
        return input;
    }
    ;

    var contactMap = {
        "0": "name",
        "31":  {
            value: "mobile"
        }
        ,
        "32": "phone",
        "39":   {
            value:"work"
        },
        "40":   {
            options:['Reyaphasta','Kolanhasta']
        },
    }
    var sumMap = '0,8,25,31,32,39,40,42,43';

    fields.forEach((field,i)=>{
        if (/.+\s+Yomi/i.test(field) || /Yomi\s+.+/i.test(field))
            return;

        var tag;
        if (field === "Notes")
            tag = "textarea";
        var value;
        var map=contactMap[i];
        if (map) {
            if (typeof map === 'string') {
                value = contact[map];
            } else  {
                if(map.value)
                value =  map.value;
                if(map.options) tag="select";
            }
        }
        var input = addField(field, 'field-' + i, tag, i, value);
        if(tag==="select"){
            map.options.forEach((option)=>{
                 _$('option').att('value',option).addTo(input).textContent=option;
            })
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

    dlg.button('Kaydet', ()=>{
    }
    );

}

ayanoglu.ui.contactForm = contactForm;

let parseContactInfo = function() {
    return new Promise((resolve,reject)=>{
        ayanoglu.wup.openChatPanel().then((element)=>{
            var find = ayanoglu.DOM.findElement;

            var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span';
            find(numSelector, 'Phone').then((numElement)=>{
                // console.log(numElement.textContent);

                var phone = numElement.textContent;
                var num = phone.replace(/[^\d]/g, '');
                if (!/[\d]{10,}/.test(num)) {
                    reject();
                    return;
                }
                var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > div:nth-child(3) > span > span';
                ayanoglu.DOM.findElement(nameSelector, 'Name').then((nameElement)=>{
                    //  console.log(nameElement.textContent);
                    var name = nameElement.textContent
                    resolve({
                        name: name,
                        phone: phone
                    });

                }
                , ()=>{

                    resolve({
                        phone: phone
                    });
                }
                )

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
var panel;
let collectWupMembers = function(container) {

    console.clear();
    if (typeof panel === 'undefined') {
        panel = ayanoglu.ui.panel();
        ca.event.listen('will-close', ()=>{
            panel = undefined;
        }
        , panel.control);
        let writeToPanel = ()=>{
            var str = ayanoglu.google.buildContactsCSV(contacts);

            ayanoglu.utility.copy(str);
            setTimeout(()=>{
                panel.text = str;
            }
            , 1);

        }
        writeToPanel();
        panel.button('Collect Members', ()=>{

            ayanoglu.wup.workers.collectGroupMembers(contacts).then((members)=>{
                contacts = members;
                console.dir(contacts);

                writeToPanel();

            }
            , ()=>{}
            );
        }
        );

        panel.button('Reset Members', ()=>{
            window.contacts = {};
            panel.text = '';
        }
        );

        panel.button('Save', ()=>{
            download("wup-contacts.csv", panel.text);
        }
        );
    }

    panel.control.style.bottom = '10px';
    panel.control.style.top = '10px';
    panel.control.style.left = '0px';
    panel.control.style.width = '300px';
    panel.control.style.right = 'auto';

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
    return;

    for (key in contacts) {
        var str = contacts[key];
        var names = str.split(' ');

        for (var i = 0; i < names.length; i++) {
            var item = names[i];
            item = item[0].toLocaleUpperCase() + item.slice(1).toLocaleLowerCase();
            names[i] = item;
        }
        str = names.join(' ');
        contacts[key] = str;
    }

}

var style = d.getElementById('wup-inject-style');
if (style)
    d.head.removeChild(style);

style = d.createElement('style');
style.id = 'wup-inject-style'
var styleTxt = `
#wup-templates {
    position: absolute;
    top: -37px;
    right: 6px;
    background-color: yellow;
    padding: 10px;
  }
  #wup-inject-panel {
    position: fixed;
    background-color: rgb(250, 255, 169);
    border: 1px solid gainsboro;
    padding: 10px;
    min-width: 400px;
    min-height: 400px;
    height: 400px;
    z-index: 10000;
    border-radius: 3px;
    left:0px;
    right: 300px;
    display: flex;
    flex-direction: column;
        }

#wup-inject-panel > div {
  /* border: 1px solid red; */
}

#wup-inject-panel > .h{

        min-height: 30px;
    display: contents;
}

#wup-inject-panel > .b{

       flex-grow: 2;
    display: contents;
}

#wup-inject-panel > .b textarea{

    width: 100%;
    padding: 3px;
    border-radius: 3px;
    box-sizing: border-box;
    height: -webkit-fill-available;
}


#wup-inject-panel > .f{
   display: flex;
   justify-content: space-between;
}

#wup-inject-panel input[type=button]
{
    padding: 10px 15px 10px 15px;
    margin: 5px;
    margin-right: 0px;
    margin-left: 0px;
}

#wup-inject-panel input[type=button] + input
{
    margin-left:10px;
}

`;

style.textContent = styleTxt;
d.head.appendChild(style);

function collectNumbers(menu, info, tab) {
    var panel = d.getElementById('wup-inject-panel');
    if (panel) {
        d.body.removeChild(panel);
        panel = null;
    }
    if (!panel) {
        panel = _$('div');
        panel.id = 'wup-inject-panel';
        d.body.appendChild(panel);

        var header = _$('div');
        panel.appendChild(header);
        header.className = 'h';

        var body = _$('div');
        panel.appendChild(body);
        body.className = 'b';

        var footer = _$('div');
        panel.appendChild(footer);
        footer.className = 'f';

        var text = _$('textarea');
        body.appendChild(text);

        var go = _$('input');
        go.setAttribute('type', 'button');
        go.setAttribute('value', 'Collect');
        footer.appendChild(go);
        go.onclick = function(e) {
            collectWupMembers(text);
        }

        var fmt = _$('input');
        fmt.setAttribute('type', 'button');
        fmt.setAttribute('value', 'Format');
        footer.appendChild(fmt);
        fmt.onclick = function(e) {
            formatNames(text);
        }

        var reset = _$('input');
        reset.setAttribute('type', 'button');
        reset.setAttribute('value', 'Reset');
        footer.appendChild(reset);
        reset.onclick = function(e) {
            window.contacts = {};
            text.value = '';
        }

        var close = _$('input');
        close.setAttribute('type', 'button');
        close.setAttribute('value', 'Close');
        footer.appendChild(close);
        close.onclick = function(e) {
            if (panel) {
                d.body.removeChild(panel);
                panel = null;
            }
        }
    }
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

    if (info.menuItemId === 'phones') {
        collectNumbers(menu, info, tab)
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
