function collectItems(){
	var d=document;
var gCls='_2WP9Q';
var cs=d.getElementsByClassName(gCls);
var phCls='_19RFN _1ovWX';
var nmCls='_3VvbK';

for(var i=0;i<cs.length;i++){
    var itemEl=cs.item(i);

    var pEls=itemEl.getElementsByClassName(phCls);
    var pEl=pEls.item(0);
    var phNum;
    if(typeof pEl!=='undefined'){
        var phRaw=pEl.getAttribute('title');
        phNum=phRaw.replace('+','');
        while(phNum.search(' ')!==-1)
        phNum=phNum.replace(' ','');
        var phText=phRaw;
    }

    var nmEls=itemEl.getElementsByClassName(nmCls);
     if(nmEls.length===0) continue;
     var nmEl=nmEls.item(0);
     var nmRaw=nmEl.textContent;
     var nm=nmRaw;

     console.log(nm,phNum);
}

}



var ctxMenu = {
 
                extractPhones : {
id:"extractWupPhones",

                        'title' : 'Extract Phones',
                        'contexts' : [
                                 'page'
                                ],
                                'documentUrlPatterns' : ['https://web.whatsapp.com/'],
                                
                                        'onclick' : function ( info , tab ) {
                                        	console.clear();
                                        	var d=document;
                                        	var gCls='_2WP9Q';
                                        	var cs=d.getElementsByClassName(gCls);
                                        	var phCls='_19RFN _1ovWX';
                                        	var nmCls='_3VvbK';
                                        	var contacts={};
                                        	for(var i=0;i<cs.length;i++){
                                        	    var itemEl=cs.item(i);

                                        	    var pEls=itemEl.getElementsByClassName(phCls);
                                        	     if(pEls.length===0) continue;
                                        	    var pEl=pEls.item(0);
                                        	   
                                        	    
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

                                        	  
                                        	contacts[phRaw]=nm;

                                        	    
                                        	}
                                        	var cKeys=Object.keys(contacts);
                                        	console.log('Count',cKeys.length);
                                        	 console.dir(contacts);

                                             
                                        }


                }
}

for ( var key in ctxMenu ) {
        if ( ctxMenu.hasOwnProperty(key) ) {
                var mo = ctxMenu[key];
                if ( mo.disabled === true )
                        continue;
                chrome.contextMenus.create(mo);
        }
}