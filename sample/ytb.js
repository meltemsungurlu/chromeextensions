



var d=document;
//var ps=gtg('ytd-miniplayer');
//var ytd=ps.length;

var sel=d.createElement('style');
sel.id='ytb-inject'
var styleTxt=`
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

sel.textContent=styleTxt;
d.head.appendChild(sel);

var videoTags=d.getElementsByTagName('video');
var videoTag=videoTags.item(0);
videoTag.style.width='var(--ytd-miniplayer-width)';
videoTag.style.height='var(--ytd-miniplayer-height)';