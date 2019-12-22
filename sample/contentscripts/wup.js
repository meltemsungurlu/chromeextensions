
var d=document;



function collectWupMembers(container){
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




	function menuHandler(menu,info,tab){
		if(menu.title.indexOf('entity')!==-1){

			 return;
		}
// console.log(menu);
// return;

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

	utility.addMenuItems([
		  {
				 'title' : 'Collect Entity',
				 'contexts' : [
								 'link'
								 ]
		  	},
		  {
	 				 'title' : 'Collect phones',
	 				 'contexts' : [
	 								 'page'
	 								 ]
	  }

	]);
	utility.addMenuListener(menuHandler);
