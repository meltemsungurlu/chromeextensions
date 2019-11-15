var d=document;
// var mplid='ytd-miniplayer';
// var items=d.getElementsByClassName(mplid);
// var mplTag=items.item(0);
// if(mplTag){}



var videoTags=d.getElementsByTagName('video');
var videoTag=videoTags.item(0);

var sel=d.createElement('style');
sel.id='ytb-inject'
var styleTxt=`
  ytd-miniplayer {
            --ytd-miniplayer-width: 800px !important;
            --ytd-miniplayer-height: 450px !important;
            opacity: 0;
            pointer-events: none;
            position: fixed;
            z-index: var(--ytd-z-index-miniplayer) !important;
            right: 0px;
            height: 800px !important;
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

sel.textContent=styleTxt;
d.head.appendChild(sel);

if(videoTag){
  // videoTag.style.width='var(--ytd-miniplayer-width)';
  // videoTag.style.height='var(--ytd-miniplayer-height)';
}


utility.addMenuItems([
  /*{
        'title' : 'Toggle Player Helper1',
        'contexts' : [
                'page'
                ]
}*/
]);


utility.addMenuListener(function(menu,info,tab){
  console.log(menu,info,tab);
})
