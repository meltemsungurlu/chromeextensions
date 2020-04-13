
var d=document;

let wupBot=function(){

	//
	// GLOBAL VARS AND CONFIGS
	//
	var lastMessageOnChat = false;
	var ignoreLastMsg = {};
	var elementConfig = {
		"chats": [0, 0, 5, 2, 0, 3, 0, 0, 0],
		"chat_icons": [0, 0, 1, 1, 1, 0],
		"chat_title": [0, 0, 1, 0, 0, 0, 0],
		"chat_lastmsg": [0, 0, 1, 1, 0, 0],
		"chat_active": [0, 0],
		"selected_title": [0, 0, 5, 3, 0, 1, 1, 0, 0, 0, 0]
	};

	const jokeList = [
		`
		Husband and Wife had a Fight.
		Wife called Mom : He fought with me again,
		I am coming to you.
		Mom : No beta, he must pay for his mistake,
		I am comming to stay with U!`,

		`
		Husband: Darling, years ago u had a figure like Coke bottle.
		Wife: Yes darling I still do, only difference is earlier it was 300ml now it's 1.5 ltr.`,

		`
		God created the earth, 
		God created the woods, 
		God created you too, 
		But then, even God makes mistakes sometimes!`,

		`
		What is a difference between a Kiss, a Car and a Monkey? 
		A kiss is so dear, a car is too dear and a monkey is U dear.`
	]


	//
	// FUNCTIONS
	//

	// Get random value between a range
	function rand(high, low = 0) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}
	
	function getElement(id, parent){
		if (!elementConfig[id]){
			return false;
		}
		var elem = !parent ? document.body : parent;
		var elementArr = elementConfig[id];
		elementArr.forEach(function(pos) {
			if (!elem.childNodes[pos]){
				return false;
			}
			elem = elem.childNodes[pos];
		});
		return elem;
	}
	
	function getLastMsg(){
		var messages = document.querySelectorAll('.msg');
		var pos = messages.length-1;
		
		while (messages[pos] && (messages[pos].classList.contains('msg-system') || messages[pos].querySelector('.message-in'))){
			pos--;
			if (pos <= -1){
				return false;
			}
		}
		if (messages[pos] && messages[pos].querySelector('.selectable-text')){
			return messages[pos].querySelector('.selectable-text').innerText.trim();
		} else {
			return false;
		}
	}
	
	function getUnreadChats(){
		var unreadchats = [];
		var chats = getElement("chats");
		if (chats){
			chats = chats.childNodes;
			for (var i in chats){
				if (!(chats[i] instanceof Element)){
					continue;
				}
				var icons = getElement("chat_icons", chats[i]).childNodes;
				if (!icons){
					continue;
				}
				for (var j in icons){
					if (icons[j] instanceof Element){
						if (!(icons[j].childNodes[0].getAttribute('data-icon') == 'muted' || icons[j].childNodes[0].getAttribute('data-icon') == 'pinned')){
							unreadchats.push(chats[i]);
							break;
						}
					}
				}
			}
		}
		return unreadchats;
	}
	
	function didYouSendLastMsg(){
		var messages = document.querySelectorAll('.msg');
		if (messages.length <= 0){
			return false;
		}
		var pos = messages.length-1;
		
		while (messages[pos] && messages[pos].classList.contains('msg-system')){
			pos--;
			if (pos <= -1){
				return -1;
			}
		}
		if (messages[pos].querySelector('.message-out')){
			return true;
		}
		return false;
	}

	// Call the main function again
	const goAgain = (fn, sec) => {
		// const chat = document.querySelector('div.chat:not(.unread)')
		// selectChat(chat)
		setTimeout(fn, sec * 1000)
	}

	// Dispath an event (of click, por instance)
	const eventFire = (el, etype) => {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
		el.dispatchEvent(evt);
	}

	// Select a chat to show the main box
	const selectChat = (chat, cb) => {
		const title = getElement("chat_title",chat).title;
		eventFire(chat.firstChild.firstChild, 'mousedown');
		if (!cb) return;
		const loopFewTimes = () => {
			setTimeout(() => {
				const titleMain = getElement("selected_title").title;
				if (titleMain !== undefined && titleMain != title){
					console.log('not yet');
					return loopFewTimes();
				}
				return cb();
			}, 300);
		}

		loopFewTimes();
	}


	// Send a message
	const sendMessage = (chat, message, cb) => {
		//avoid duplicate sending
		var title;

		if (chat){
			title = getElement("chat_title",chat).title;
		} else {
			title = getElement("selected_title").title;
		}
		ignoreLastMsg[title] = message;
		
		messageBox = document.querySelectorAll("[contenteditable='true']")[0];

		//add text into input field
		messageBox.innerHTML = message.replace(/  /gm,'');

		//Force refresh
		event = document.createEvent("UIEvents");
		event.initUIEvent("input", true, true, window, 1);
		messageBox.dispatchEvent(event);

		//Click at Send Button
		eventFire(document.querySelector('span[data-icon="send"]'), 'click');

	if(cb)	cb();
	}

	//
	// MAIN LOGIC
	//
	const start = (_chats, cnt = 0) => {
		// get next unread chat
		const chats = _chats || getUnreadChats();
		const chat = chats[cnt];
		
		var processLastMsgOnChat = false;
		var lastMsg;
		
		if (!lastMessageOnChat){
			if (false === (lastMessageOnChat = getLastMsg())){
				lastMessageOnChat = true; //to prevent the first "if" to go true everytime
			} else {
				lastMsg = lastMessageOnChat;
			}
		} else if (lastMessageOnChat != getLastMsg() && getLastMsg() !== false && !didYouSendLastMsg()){
			lastMessageOnChat = lastMsg = getLastMsg();
			processLastMsgOnChat = true;
		}
		
		if (!processLastMsgOnChat && (chats.length == 0 || !chat)) {
			console.log(new Date(), 'nothing to do now... (1)', chats.length, chat);
			return goAgain(start, 3);
		}

		// get infos
		var title;
		if (!processLastMsgOnChat){
			title = getElement("chat_title",chat).title + '';
			lastMsg = (getElement("chat_lastmsg", chat) || { innerText: '' }).title.replace(/[\u2000-\u206F]/g, ""); //.last-msg returns null when some user is typing a message to me
		} else {
			title = getElement("selected_title").title;
		}
		// avoid sending duplicate messaegs
		if (ignoreLastMsg[title] && (ignoreLastMsg[title]) == lastMsg) {
			console.log(new Date(), 'nothing to do now... (2)', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		// what to answer back?
		let sendText

		if (lastMsg.toUpperCase().indexOf('@HELP') > -1){
			sendText = `
				Cool ${title}! Some commands that you can send me:

				1. *@TIME*
				2. *@JOKE*`
		}

		if (lastMsg.toUpperCase().indexOf('@TIME') > -1){
			sendText = `
				Don't you have a clock, dude?

				*${new Date()}*`
		}

		if (lastMsg.toUpperCase().indexOf('@JOKE') > -1){
			sendText = jokeList[rand(jokeList.length - 1)];
		}
		
		// that's sad, there's not to send back...
		if (!sendText) {
			ignoreLastMsg[title] = lastMsg;
			console.log(new Date(), 'new message ignored -> ', title, lastMsg);
			return goAgain(() => { start(chats, cnt + 1) }, 0.1);
		}

		console.log(new Date(), 'new message to process, uhull -> ', title, lastMsg);

		// select chat and send message
		if (!processLastMsgOnChat){
			selectChat(chat, () => {
				sendMessage(chat, sendText.trim(), () => {
					goAgain(() => { start(chats, cnt + 1) }, 1);
				});
			})
		} else {
			sendMessage(null, sendText.trim(), () => {
				goAgain(() => { start(chats, cnt + 1) }, 1);
			});
		}
	}
	//start();
		sendMessage(false,'Hadi gari yetti gari');
}
window.wup={};
(function(){

        function openChatPanel() {

            return new Promise((resolve,reject)=>{
                var name = 'Header';
                var cls = '_5SiUq';
                var element = document.querySelector('div[class="' + cls + '"]')
                if (!element) {
                    console.error(`"${name}" not found`);
                    reject();
                } else {
                    simulateMouseEvents(element, 'click');
                    console.log(`"${name}" found`);
                    resolve(element);
                }
            }
            );

        }

        function findMemberListExpander() {
            var name = 'Expander';
            var cls = '_2EXPL _3xj48';
            var element;
            var elements = document.querySelectorAll('div[class="' + cls + '"] > div[class="_3j7s9"] > div[class="_2FBdJ"] > div[class="_25Ooe"]');
            elements = Array.prototype.slice.call(elements);
            while (item = elements.pop())
                if (/\d+\s+more/.test(item.textContent)) {
                    element = item;
                    break;
                }
            if (!element) {
                console.warn(`"${name}" not found`);
                return false;
            } else {
                //simulateMouseEvents(element, 'click');
                console.log(`"${name}" found`);
                return element;
            }

        }

        function findInfoEof() {
            var cls = '_1CkkN _1RMZB';
            var elements = document.querySelectorAll('div[class="' + cls + '"][title="Exit group"]');
            if (element = Array.prototype.slice.call(elements).pop()) {
                element.scrollIntoView();

                return element;
            }
            return false;
        }

        function expandMemberList() {

            return new Promise((resolve,reject)=>{

                var name = 'Expander';
                var cls = '_1vDUw _2sNbV';
                var element = document.querySelector('div[class="' + cls + '"]');
                if (!element) {
                    console.error(`"${name}" not found`);
                    reject();
                } else {
                    console.log(`"${name}" found`);

                    while (expander = findMemberListExpander()) {
                        expander.scrollIntoView();
                        simulateMouseEvents(expander, 'click');
                        findInfoEof();

                    }
                    resolve();
                }
            }
            );
        }

        function findElement(tagName, className, label, eventName) {
            return new Promise((resolve,reject)=>{
                var element = document.querySelector(tagName + '[class="' + className + '"]')
                if (!element) {
                    console.warn(`"${label}" not found`);
                    reject();
                } else {
                    if (typeof eventName !== 'undefined')
                        simulateMouseEvents(element, eventName);
                    console.log(`"${label}" found`);
                    resolve(event);
                }

            }
            );

        }

        function start() {
            console.clear();

            openChatPanel().then((panel)=>{
                expandMemberList().then(()=>{
                    console.log('expanded');
                    setTimeout(()=>{
 
                        collectMembers();
                        var i=0;
                         for(key in contacts) i++;
                          console.log('Count: ',i);
                         
                        console.dir(contacts);

                    }
                    , 1000);

                }
                );
            }
            )

        }

        function collectMembers() {

            var panelClass = '_1-iDe _14VS3';
            var containerClass = '_21sW0 _1ecJY';
            var cls = '_2wP_Y';

            var scrollerClass = '_1vDUw _2sNbV';

            var scroller = document.querySelector('div[class="' + scrollerClass + '"]');
            var panel = document.querySelector('div[class="' + panelClass + '"] div[class="' + containerClass + '"]');

            var selectors = ['div[class="' + panelClass + '"]', 'div[class="' + containerClass + '"]', '> div[class="' + cls + '"]', '> div', '> div[class="_2EXPL _3xj48"]', '> div[class="_3j7s9"]'];
            var selector = selectors.join(' ');
            var items = document.querySelectorAll(selector);
            console.log(items.length);
            items = Array.prototype.slice.call(items);
            var offY = 0;
            items.forEach((item)=>{
                var phone = item.firstElementChild.textContent;
                var name = item.lastElementChild.lastElementChild.textContent;

                if (/\+[\d\s]+\s\d\d\d\s\d\d\d\s\d\d\s\d\d/.test(phone) && name.length > 3 /* && /[\w\s]{2,}$/i.test(name) */
                ) {
                    //console.log(name, phone);
                    var contact= {
                        name:name,
                        phone:phone,
                        group:'#delete ::: * myContacts',
                        prefix:'Dr.'
                    };
                    contacts[phone] =contact;
                    console.count();
                    console.log(contact);

                }
                //var domRect = item.getBoundingClientRect();
                //item.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

            }
            );
            //scroller.scrollTo(0,0);
            //scroller.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

        }

        if(typeof window.contacts==='undefined') window.contacts={};
       // start();
        wup.go=start;
})();

function collectWupMembers(container){
        wup.go();
        return;
    var d=document;
var gCls='_2WP9Q';
var phCls='_19RFN _1ovWX';
var nmCls='_3VvbK';

var cs=d.getElementsByClassName(gCls);

if(typeof window.contacts==='undefined') window.contacts={};

for(var i=0;i<cs.length;i++){
    var itemEl=cs.item(i);

    var pEls=itemEl.getElementsByClassName(phCls);
     if(pEls.length===0) continue;
    var pEl=pEls.item(0);

   if(pEl.classList.contains('wup-collected'))
   continue;

        var phRaw=pEl.getAttribute('title');
        var phNum=phRaw.replace('+','');
        while(phNum.search(' ')!==-1)
        phNum=phNum.replace(' ','');
        var phText=phRaw;


    var nmEls=itemEl.getElementsByClassName(nmCls);
     if(nmEls.length===0) continue;
     var nmEl=nmEls.item(0);
     var nmRaw=nmEl.textContent;
     var nm=nmRaw;
pEl.style.backgroundColor='green';
pEl.classList.add('wup-collected');

contacts[phRaw]=nm;


}





var str='';
for(key in contacts) str +=contacts[key] + ';' + key + '\n';

container.value=str;

}
function _collectWupMembers(container){
    var d=document;
var gCls='_2WP9Q';
var phCls='_19RFN _1ovWX';
var nmCls='_3VvbK';

var cs=d.getElementsByClassName(gCls);

if(typeof window.contacts==='undefined') window.contacts={};

for(var i=0;i<cs.length;i++){
    var itemEl=cs.item(i);

    var pEls=itemEl.getElementsByClassName(phCls);
     if(pEls.length===0) continue;
    var pEl=pEls.item(0);

   if(pEl.classList.contains('wup-collected'))
   continue;

        var phRaw=pEl.getAttribute('title');
        var phNum=phRaw.replace('+','');
        while(phNum.search(' ')!==-1)
        phNum=phNum.replace(' ','');
        var phText=phRaw;


    var nmEls=itemEl.getElementsByClassName(nmCls);
     if(nmEls.length===0) continue;
     var nmEl=nmEls.item(0);
     var nmRaw=nmEl.textContent;
     var nm=nmRaw;
pEl.style.backgroundColor='green';
pEl.classList.add('wup-collected');

contacts[phRaw]=nm;


}





var str='';
for(key in contacts) str +=contacts[key] + ';' + key + '\n';

container.value=str;

}



function formatNames(container){
var fmtArr=[];
var text=container.value;
var lines=text.split('\n');
for(var i=0;i<lines.length;i++){
    var line=lines[i];
    if(line.length===0) continue;
     var items=line.split(';');

     var str=items[0];
     while(str.search(/  /gi)!==-1) str=str.replace(/  /gi,' ');
var names=str.split(' ');

for(var ii=0;ii<names.length;ii++){

    var item=names[ii];
    item=item.replace(/I/g,'ı');
   // item=item.replace('Ğ','ğ');
   // item=item.replace('Ş','ş');
   // item=item.replace('Ğ','g');
    item=item[0].toLocaleUpperCase() + item.slice(1).toLocaleLowerCase();
    names[ii]=item;
}
str=names.join(' ');
fmtArr.push(str + ';' + items[1]);
}
container.value=fmtArr.join('\n');
return;

for(key in contacts) {
var str=contacts[key];
var names=str.split(' ');

for(var i=0;i<names.length;i++){
    var item=names[i];
    item=item[0].toLocaleUpperCase() + item.slice(1).toLocaleLowerCase();
    names[i]=item;
}
str=names.join(' ');
contacts[key]=str;
    }

}


var style=d.getElementById('wup-inject-style');
if(style)
    d.head.removeChild(style);

style=d.createElement('style');
style.id='wup-inject-style'
var styleTxt=`
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
    min-height: 500px;
    height: 600px;
    z-index: 1000;
    border-radius: 3px;
    right: 10px;
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

style.textContent=styleTxt;
d.head.appendChild(style);


function collectNumbers(menu,info,tab){
	var panel=d.getElementById('wup-inject-panel');
	 if(panel) { d.body.removeChild(panel);panel=null;}
	if(!panel)
	  {
	    panel=_$('div');
	    panel.id='wup-inject-panel';
	    d.body.appendChild(panel);


	    var header=_$('div');
	    panel.appendChild(header);
	    header.className='h';

	    var body=_$('div');
	    panel.appendChild(body);
	    body.className='b';

	    var footer=_$('div');
	    panel.appendChild(footer);
	    footer.className='f';



	    var text=_$('textarea');
	    body.appendChild(text);


	    var go=_$('input');
	    go.setAttribute('type','button');
	    go.setAttribute('value','Collect');
	    footer.appendChild(go);
	go.onclick=function(e){
	        collectWupMembers(text);
	    }



	    var fmt=_$('input');
	    fmt.setAttribute('type','button');
	    fmt.setAttribute('value','Format');
	    footer.appendChild(fmt);
	fmt.onclick=function(e){
	         formatNames(text);
	    }


	    var reset=_$('input');
	    reset.setAttribute('type','button');
	    reset.setAttribute('value','Reset');
	    footer.appendChild(reset);
	reset.onclick=function(e){
	        window.contacts={};
	        text.value='';
	    }

	    var close=_$('input');
	    close.setAttribute('type','button');
	    close.setAttribute('value','Close');
	    footer.appendChild(close);
	    close.onclick=function(e){
	         if(panel) { d.body.removeChild(panel);panel=null;}
	    }
	  }
}
function replaceSelectedText(cb) {
    var sel, range;
    
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
          var  replacementText=cb(sel.toString());
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        var replacementText=cb(range.text);
        range.text = replacementText;
    }
}
	function menuHandler(menu,info,tab){
		
		if(info.menuItemId==='wup-selection'){ 
			if(!info.selectionText) return;
			  var cb=(selectionText)=>{
					var d = document ,  e = encodeURI;
					var f = 'https://api.whatsapp.com/send';
					var p = '?text=' + e(selectionText);
					var url =  f + p  + '\n\n\n' + selectionText;
					return url
			  };
		
			
			replaceSelectedText(cb);
			
			
//			location.href=url;
//			var strWindowFeatures = "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
//			window.open( url, "wup-this",strWindowFeatures);
			
			return;
		 
		}
		
		
		if(info.menuItemId==='phones'){ 
			collectNumbers(menu,info,tab)
		}
 

		

	}

	utility.addMenuItems([
		  {
			  'id':'wup-selection',
				 'title' : 'Send  "%s" to Whatsapp',
				 'contexts' : [
								 'selection'
								 ]
		  },
		  {
			  'id':'entity',
				 'title' : 'Collect Entity',
				 'contexts' : [
								 'link'
								 ]
		  	},
		  {
		  		'id':'phones',
	 				 'title' : 'Collect phones',
	 				 'contexts' : [
	 								 'page'
	 								 ]
	  }

	]);
	utility.addMenuListener(menuHandler);
