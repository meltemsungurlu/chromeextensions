var d = document;
let onLoad= ()=>{

    var pop = ayanoglu.ui.floatMenu();
    pop.add('Open Group Member Collector', ()=>{
        collectWupGroupMembers()
    }
    , 'icon-doc-text');

    
    
    
    pop.add('Parse Member Info', ()=>{
        parseMemberInfo();
    }
    , 'icon-user');

    
    
    pop.add('Collect Numbers', ()=>{
        collectUnknownNumbers() ;
    }
    , 'icon-export');

    pop.add('Show Collection', ()=>{
    	var dlg=contactListDialog('Member Collection'); 
        var output = getCSVText();
        dlg.writeText(output);
    }
    , 'icon-list');
    
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

};
addEventListener('load', onLoad)

window.csvStack = [];
let getCSVText=function(){
	 var gHeaders = ayanoglu.google.parseContactCSVFields();
	  var headersStr = gHeaders.string;
	  
       var ta = Array.prototype.slice.call(csvStack);
     ta.unshift(headersStr)

     return ta.join('\n');
}
let parseMemberInfo = function() {

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
                var link = ayanoglu.wup.makeWinShortcut(contact.phone1Value, nameElement.value);
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
                var exists=false;
                var nContact=parseContactCSV(line);
                
                csvStack.some((csvLine)=>{
                	var tContact=parseContactCSV(line);
                	if(nContact.phone1Value===tContact.phone1Value) {
                		exists=true;
                		return true;
                	}
                })
             if(!exists)   csvStack.push(line);
            }
            );

            dlg.button('Liste', ()=>{
            	
            	var dlg=contactListDialog('CSV Text',false); 
                  var output = getCSVText();
                  dlg.writeText(output); 

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
    var fieldsObj = ayanoglu.google.parseContactCSVFields();
    var fields = fieldsObj.array;
    var properties = fieldsObj.properties;
    var placeHolders = fieldsObj.defaults;

    let addField = (label,name,tag,index,value)=>{
        var row = _$('div').att('id', 'field-' + index).att('title',index).addTo(table);
        if (sumMap.split(',').indexOf(index.toString()) === -1)
            row.style.display = 'none';
        var labelCell = _$('div').text(label).addTo(row);

        var inputCell = _$('div').addTo(row);
        var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
        if(placeHolder=placeHolders[index.toString()]) input.att('placeholder',placeHolder);
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
        "32": "phone1Value",
        "39": {
            value: "work"
        },
        "40": {
            options: ['Reyaphasta', 'Kolanhasta', 'Verahasta']
        },
    }
    var sumMap = '0,8,25,28,31,32,39,40,42,43,47,48';

    fields.forEach((field,i)=>{
        if (/.+\s+Yomi/i.test(field) || /Yomi\s+.+/i.test(field))
            return;
var property=properties[i.toString()];
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
        if(property==='webSite1Value'){
        	var phone=contact.phone1Value;
            var wPhone = phone.replace(/[^\d]/g, '');

          if (!/^9\d+/.test(wPhone))
              wPhone = '9' + wPhone; 
          value = 'https://wa.me/' + wPhone;
        }
        else      if(property==='webSite1Type'){ 
          value = 'Whatsapp';
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
                            phone1Type: 'mobile',
                            phone1Value: phone,
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
                            phone1Type: 'mobile',
                            phone1Value: phone,
                            saved: false

                        });

                    }
                    , ()=>{

                        resolve({
                        	   phone1Type: 'mobile',
                               phone1Value: phone,
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
    window.contacts = [];

let buildContactCSV =ayanoglu.google.buildContactCSV;
let parseContactCSV =ayanoglu.google.parseContactCSV;

let contactListDialog=function(title,handleClicks){
	  var dlg = ayanoglu.ui.dialog();
	    dlg.title = title?title:'Kişiler'
	    dlg.control.style.height = '100%';
	    
	    var textBox = _$('textarea').cls('list').addTo(dlg.container);

	    var label = _$('div').cls('pop-label').addTo(dlg.container);
	    
	    let saveAsCSV = ()=>{

	        var output = getCSVText();

	        ayanoglu.utility.download("contacts-" + getFileNameStamp() + ".csv", output);
	        csvStack = [];
	        window.contacts = [];
	        textBox.value='';
	    }
	 

	    let resetStack = ()=>{
	        csvStack = [];
	        window.contacts = [];
	        textBox.value='';
	    }

	    dlg.button('Kaydet', saveAsCSV    );
	    dlg.button('Temizle', resetStack    );
	   
	    
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

	        if (line && lineNum>0) {
	            if (e.type === 'dblclick') {
	 
	                console.clear();
	                console.log(line);
	                var contact = parseContactCSV(line);
	                console.dir(contact); 


	                
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
	    

let updateCSVItems=(e)=>{
	var text=e.target.value;
	
	var lines=text.split('\n');
	lines.shift();
	csvStack=lines;
}

 textBox.addEventListener('change', updateCSVItems);


if(handleClicks!==false){
    textBox.addEventListener('dblclick', editContact);
    textBox.addEventListener('mouseup', editContact);
	
}
	    dlg.writeText=function(text){
	    	textBox.value=text;
	    }
dlg.clearText=function(){
	textBox.value='';
	    }
Object.defineProperty(dlg, 'text', {
    get: function() {
        return textBox.value;
    },
    set: function(v) {textBox.value=v;},

    configurable: false,
    enumerable: true
})
return dlg;
}

var panelControl;
let collectWupGroupMembers = function() {

    console.clear();

    let collectMembers = ()=>{

        ayanoglu.wup.workers.collectGroupMembers(contacts).then((members)=>{
            contacts = members;
            window.csvStack=[];
            contacts.forEach((contact)=>{
            	csvStack.push( ayanoglu.google.buildContactCSV(contact));
            });
            var str = ayanoglu.google.buildContactsCSV(contacts);

            setTimeout(()=>{
            	dlg.writeText(str);
            }
            , 1);

        }
        , ()=>{}
        );
    }

    var dlg = contactListDialog('Grup kişiler');
     
    dlg.button('Collect', collectMembers); 
    
    dlg.button('Table List', ()=>{
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
        var csvLines = dlg.text.split('\n');
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
  

    collectMembers();
 
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
