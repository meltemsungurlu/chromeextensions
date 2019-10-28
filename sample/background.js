chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });

  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'developer.chrome.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });


// https://webteizle.vip/filtre.asp?a=passengers
//https://developer.chrome.com/apps/contextMenus
 
            var ctxMenu = {
                            tweet : {
                              id:"tweet",
                                    'title' : 'Tweet "%s"',
                                    'contexts' : [
                                            'selection'
                                            ],
                                            'onclick' : function ( info , tab ) {

                                                    console.log("info", info);
                                                    var tag = 'okuyorum';
                                                    var d = document , l = d.location , e = encodeURIComponent;
                                                    var f = 'https://twitter.com/intent/tweet';
                                                    var p = '?url=' + e(tab.url) + '&text=' + e(info.selectionText + ' #' + tag) + '&related=habermakale%3AHaberler';
                                                    var url = f + p;

                                                    chrome.windows.create({
                                                            url : url,
                                                            width:700,
                                                            height:300,
                                                            focused:true,
                                                            type:"popup"
                                                    }, function ( tab ) {

                                                    });

                                            }
                            },
                            movieTr : {
id:"movieTr",

                                    'title' : 'Search Movie of IMDB',
                                    'contexts' : [
                                            'link','page'
                                            ],
                                            'documentUrlPatterns' : ['https://www.imdb.com/*'],
                                            'targetUrlPatterns' : [
                                                    'https://www.imdb.com/title/tt*'
                                                    ],
                                                    'onclick' : function ( info , tab ) {
                                                    	 
                                                            var sUrl =   info.linkUrl || info.pageUrl ;
                                                      
                                                           if(typeof sUrl==='undefined') return ;

                                                            var re = new RegExp('.*\\.com\/title\/(tt[\\d]+)\/.*', 'i');
                                                            var ms = sUrl.match(re);

                                                            if ( ms == null )    return;
                                                         
                                                            
                                                           
                                                            
                                                            var re = new RegExp('.*\\.com\/title\/(tt[\\d]+)\/.*', 'i');
                                                            var ms = sUrl.match(re);
                                                            if ( ms == null )
                                                                    return;
                                                            
                                                            var title = ms[1];
                                                            if ( !title )
                                                                    return;
                                                            console.log("info", info, sUrl, title);
                                                            // alert(ms);

                                                            var url = "https://webteizle.vip/filtre.asp?a=" + title;
                                                            var args = {
                                                                            url : url,
                                                                            selected : true
                                                            };
                                                            chrome.tabs.create(args, function ( tab ) {

                                                                    movieTab = tab;
                                                            });
                                                            return;
                                                            //
                                                            // if ( typeof
															// movieTab!=='undefined'
															// && movieTab.id
															// !==
                                                            // chrome.tabs.TAB_ID_NONE)
															// {
                                                            //
                                                            // chrome.tabs.update(movieTab.id,
															// args,
															// function(tab)
                                                            // {
                                                            //
                                                            // });
                                                            // }
                                                            // else {
                                                            // chrome.tabs.create(args,
															// function(tab)
                                                            // {
                                                            // movieTab = tab;
                                                            // });
                                                            // }
                                                            // console.log("movieTab",
															// movieTab);
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



    function setStyle(
    ){

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
