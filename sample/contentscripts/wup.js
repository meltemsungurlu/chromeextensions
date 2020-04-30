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
height:40px;
background-color:#b49cfb;
border-radius:5px;
display:flex;
width: 33px;
}


#${popId} > div  {

background-color:inherit;
border-radius:5px;
display:flex; 
transform-style: flat;
transform-origin: left 0px;
transition: transform 0.3s ease-out;
transform: scale(0,1);
opacity: 0;
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
    border-right: 1px solid gray;
    font-size: 32px;
    width: 32px;
    color: black;
}

#${popId} > div > div:after {
	color:inherit;
}

`);

var popCommand = d.getElementById(popId);
if (popCommand) {
    d.body.removeChild(popCommand);
    popCommand = undefined;
}
if (!popCommand) {
    popCommand = _$('div').atts({
        'id': popId
    }).addTo(d.body);
    var container=_$('div').addTo(popCommand);
    var btnCollector = _$('div').cls('fnt-after').atts({title:'Load Group Contacts'}).addTo(container);
    var btnSome = _$('div').cls('fnt-after').addTo(container);
    btnCollector.addEventListener('click',(e)=>{
    	collectNumbers();
    })
}



 
if (typeof window.contacts === 'undefined')
    window.contacts = {};

let collectWupMembers=function (container) {

  console.clear();


          	ayanoglu.wup.workers.collectGroupMembers(contacts).then((members)=>{
          		contacts=members;
          		console.dir(contacts); 


    	 var str = ayanoglu.google.buildContactsCSV(members);
    	    container.value = str;
    	    ayanoglu.utility.copy(str);
          		
          	},()=>{});

    
   
}

let formatNames=function (container) {
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
}, {
    'id': 'phones',
    'title': 'Collect phones',
    'contexts': ['page']
}
]);
utility.addMenuListener(menuHandler);
