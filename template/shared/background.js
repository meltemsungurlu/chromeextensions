chrome.runtime.onInstalled.addListener(function () {
   
  });


//var webSocket = new WebSocket("http://iyidoktorlar.com", "optionalProtocol");


  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
          // hostEquals: 'developer.chrome.com'
          },
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

var contentMenuItems=[];
  chrome.runtime.onMessage.addListener(
		  function(request, sender, sendResponse) {
         console.log(request);
			  if (request.greeting )
				  console.log(request.greeting);
			  ;
		    console.log(sender.tab ?
		                "from a content script:" + sender.tab.url :
		                "from the extension");
		    if (request.greeting == "hello")
		      sendResponse({farewell: "goodbye from background"});

		    
if(request.contextMenuItems){
  for (var i=0;i<request.contextMenuItems.length;i++) {
    var mo = request.contextMenuItems[i];
var jsonStr=JSON.stringify(mo);

if ( contentMenuItems.indexOf(jsonStr)!==-1 )
        continue;

contentMenuItems.push(jsonStr);

    if ( mo.disabled === true )
            continue;
 
            mo['onclick'] = function ( info , tab ) {
              console.log("item " + info.menuItemId + " was clicked");
                  console.log("info: " +  info );
                  console.log("tab: " +  tab );

                  // Add all you functional Logic here
                  chrome.tabs.query({
                      "active": true,
                      "currentWindow": true
                  }, function (tabs) {
                      chrome.tabs.sendMessage(tabs[0].id, {
                          menuItem: mo,
                          info:info,
                          tab:tabs[0]
                      });
                  });
            }
            
    chrome.contextMenus.create(mo);
  }
    sendResponse({result: "Menu items added"});
}


		  });

// https://webteizle.vip/filtre.asp?a=passengers
// https://developer.chrome.com/apps/contextMenus




            var ctxMenu = [];

            var mnf=chrome.runtime.getManifest();
            console.log('manifest',mnf);
if(!('update_url' in mnf)) ctxMenu.push( {

                        'title' : 'Reload ' + mnf.name,
                        'contexts' : [
                                 'page'
                                ],
                                'onclick' : function ( info , tab ) {
                                	console.log('Reloading...');
  chrome.runtime.reload();
  chrome.tabs.reload(tab.id,{
  	bypassCache:true
  },()=>{
  	console.log('reloaded');
  });
                                        }


                });


            for ( var key=0;key< ctxMenu.length;key++ ) {

                      var mo = ctxMenu[key];
                      if ( mo.disabled === true )
                              continue;
                      chrome.contextMenus.create(mo);
            }



    function setStyle(){

        var d=document;
        var cssText=`
        ytd-miniplayer {
            --ytd-miniplayer-width: 800px;
            --ytd-miniplayer-height: 450px;
            opacity: 0;
            pointer-events: none;
            position: fixed;
            z-index: var(--ytd-z-index-miniplayer);
            right: 0px;
            height: 800px;
            transform: translate3d(0, 215px, 0);
            bottom: 0;
            background-color: var(--yt-dialog-background);
            box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.20);
        }

        ytd-miniplayer video {
            width: 800px !important;
            height: 450px !important;
            left: 0px;
            top: 0px;
        }
        `;

        var style=d.createElement('style');
        style.id='ytd-mod-style';
        style.textContent=cssText;
        d.head.appendChild(style);

    };

    
    chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
      });