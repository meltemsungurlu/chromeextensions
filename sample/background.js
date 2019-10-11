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



    function setStyle(
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
    ){};
