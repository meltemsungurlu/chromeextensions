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

           
            if(contact.saved){

 var dlg = ayanoglu.ui.modalDialog();
 dlg.control.style.height='300px';
  let _$ = ayanoglu.DOM._$;

    var table = _$('div').cls('ayanoglu flex-form').addTo(dlg.container);
 
    let addField = (label,name,tag,index,value)=>{
        var row = _$('div').att('id', 'field-' + index).addTo(table);
         
        var labelCell = _$('div').text(label + (index > -1 ?` (${index})`:'')).addTo(row);

        var inputCell = _$('div').addTo(row);
        var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
        if (value)
            input.value = value;
        row.getValue = ()=>{
            return input.value;
        }
        return input;
    }
 var nameElement= addField('Etiket','label',false,-1,contact.name);
 var txtElement= addField('Etiket','text','textarea',-1);

 dlg.button('Oluştur',()=>{
     var link=ayanoglu.wup.makeWinShortcut(contact.phone,nameElement.value);
     txtElement.value=link;
     ayanoglu.utility.copy(link);
 });

            }
            else
            {
             var dlg = ayanoglu.ui.dialog();    
            dlg.control.style.height='100%'
            dlg.title = contact.name;
            var frm = contactForm(dlg, dlg.container, contact)
            }
           

        }
        );
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
            dlg.control.style.height='500px'
            dlg.title = 'Translate';
            let _$ = ayanoglu.DOM._$;
            var txtArea=_$('textarea').css(`width: -webkit-fill-available;
    height: 100%;`).addTo(dlg.container);

dlg.button('Convert',()=>{ 
    txtArea.value=ayanoglu.utility.upperCase(txtArea.value);
})

    }
    , 'icon-up-hand');

}
)


function collectUnknownNumbers(){

 var dlg = ayanoglu.ui.dialog();

            dlg.title = 'Unknown Numbers';
                         // var output =stack.join('\n');; 
dlg.control.style.width='800px';
dlg.control.style.right='0px';
dlg.control.style.left='auto';
var textElement=_$('textarea').css('margin: 0px; height: 100%; width: -webkit-fill-available;white-space: nowrap;').addTo(dlg.container);
           

var stack=[];
 
ayanoglu.wup.workers.iterateUsers((contact)=>{
    if(contact===false){

        return;
    }
   if(contact.name===false) {
     var link=  ayanoglu.wup.makeWinShortcut(contact.phone);
     if(stack.length % 10===0){
            textElement.value +=   '\n\n\n*Group ' + (stack.length/10) + '*\n\n';
     }
        textElement.value += link + '\n';
       console.log(link);
       stack.push(link);
        
       }
});

}

function getFileNameStamp() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    if (hour.length < 2) 
        hour = '0' + hour;
    if (min.length < 2) 
        min = '0' + min;

    return [year, month, day,hour,min].join('-');
}

ayanoglu.ui.selectionPop((text)=>{
    console.log(text);
    ayanoglu.wup.workers.sendMessage(text);
}
, true);










var csvStack={};

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

let buildContactText=()=>{
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
        formValues[0]=nameObj.fullName;
        formValues[1]=nameObj.firstName;
        formValues[2]=nameObj.midName;
        formValues[3]=nameObj.familyName;
        
        var phone=formValues[32]
        var wPhone = phone.replace(/[^\d]/g, '');
        if (!/^9\d+/.test(wPhone))
            wPhone = '9' + wPhone;
        formValues[47] = 'Whatsapp';
        formValues[48] = 'https://wa.me/' + wPhone;
        
        
        var values=formValues.map((item)=>{
        	return '"' + item + '"';
        });
        
       

        var output = values.join(',');  

        csvStack[phone]=output;
}
let getCSVText=()=>{

buildContactText();

        var gHeaders = ayanoglu.google.getGoogleContactCSVFields();
        var headersStr = gHeaders.string;

        var gCsv = [headersStr];
        for(key in csvStack){
            gCsv.push(csvStack[key])
        }
         var output = gCsv.join('\n');  
         return output;

}

let saveAsCSV= ()=>{

       var output =getCSVText();  


        ayanoglu.utility.download("contacts-" + getFileNameStamp() + ".csv", output);
csvStack={}
    };

let addToStack=()=>{
 buildContactText();
}

let resetStack=()=>{
csvStack={}
}

let showCSV=()=>{
 var dlg = ayanoglu.ui.dialog();

            dlg.title = 'CSV Text';
              var output =getCSVText(); 
dlg.control.style.width='700px';
dlg.control.style.right='0px';
dlg.control.style.left='auto';
              var textElement=_$('textarea').css('margin: 0px; height: 100%; width: -webkit-fill-available;white-space: nowrap;').addTo(dlg.container);
              textElement.value=output;


}

    dlg.button('Ekle', addToStack    );
    dlg.button('Temizle', resetStack    );
    dlg.button('Kayıtlar', showCSV    );
    dlg.button('Kaydet', saveAsCSV    );

}

ayanoglu.ui.contactForm = contactForm;

let parseContactInfo = function() {
    return new Promise((resolve,reject)=>{
        ayanoglu.wup.openChatPanel().then((element)=>{
            var find = ayanoglu.DOM.findElement;
             
var saved=false,name,phone;
            var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span';
            find(numSelector, 'Phone').then((numElement)=>{
                // console.log(numElement.textContent);

                  phone = numElement.textContent;
                var num = phone.replace(/[^\d]/g, '');
                if (!/[\d]{10,}/.test(num)) {
                    // saved
                    name=phone;
                   numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div:nth-child(4) > div:nth-child(3) > div > div > span > span'
                   
                      find(numSelector, 'Phone').then((phoneElement)=>{
                    //  console.log(nameElement.textContent);
                    var phone = phoneElement.textContent
                    resolve({
                        name: name,
                        phone: phone,
                        saved:true
                    });

                }
                , ()=>{

                    reject();
                }
                )

                   
                }
                 else {
                         var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > div:nth-child(3) > span > span';
                find(nameSelector, 'Name').then((nameElement)=>{
                    //  console.log(nameElement.textContent);
                      name = nameElement.textContent
                    resolve({
                        name: name,
                        phone: phone,
                        saved:false

                    });

                }
                , ()=>{

                    resolve({
                        phone: phone,
                        saved:false
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
var panel;
let collectWupMembers = function() {

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
