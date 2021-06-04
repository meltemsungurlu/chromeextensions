var d=document;
 
addEventListener('load', ()=>{
})

var videoTags=d.getElementsByTagName('video');
var videoTag=videoTags.item(0);

var sel=d.createElement('style');
sel.id='ytb-inject'
var styleTxt=`
 
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
 
const buildWatchPanel=()=>{
 
	  var style=`
#ytb-watch-panel {
	    position: fixed;
	    top: 0px;
	    left: 0px;
	    right: 0px;
	    bottom: 0px;
	    background-color: rgb(42 138 222 / 64%);
	    display: flex;
	    flex-wrap: wrap;
	    flex-direction:column;
	    align-content: flex-start;
	}

#ytb-watch-panel > div.hdr {
	background-color: darkblue;
	width: -webkit-fill-available; 
    flex-basis: 40px;
    display: flex;
    cursor:pointer;
    justify-content: flex-end;
}

#ytb-watch-panel > div.hdr > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color:white;
}

#ytb-watch-panel > div.hdr > div:before
{
	font-size: 23px;
}

#ytb-watch-panel > div.c {
	width: -webkit-fill-available;
    flex-grow: 1;
    flex-shrink: 0;
         display: flex;
	    flex-wrap: wrap;
	    align-content: flex-start;
}

	#ytb-watch-panel > div.c > div  {
	flex-basis: 33.3%;

	}

	#ytb-watch-panel > div.c > div > iframe {
	width: -webkit-fill-available;
	    height: -webkit-fill-available;
		
	}

	  `;

	  ayanoglu.DOM.style(style);
	  var css=`

	`;
		var id="ytb-watch-panel";
		var control=_$('#' + id);
		var header,container;

		const dispose=(e)=>{
				control.remove();
		 control=undefined;
		 header=undefined;
		 container=undefined;
		}
	 
		if(!control){
		  control=_$('div').css(css).att('id',id) ;
	 	  control.css(css);
	 	   header=_$('div').cls('hdr').addTo(control);

var refresh=_$('div').cls('icon-upload').addTo(header);
var closer=_$('div').cls('icon-cancel').addTo(header);
 
refresh.addEventListener('click',e=>{
	dispose();
				buildWatchPanel();
			});
         closer.addEventListener('click',e=>{
				control.style.display='none';
			});

	 	   container=_$('div').cls('c').addTo(control); 

	 	   document.body.appendChild(control);
		 

		}
		else {
		 header=control.querySelector(':scope > div.hdr');
		 container=control.querySelector(':scope > div.c');
		}
		 
		
		container.clear();
		control.topMost();
		control.style.display='flex'

		var path='#secondary #secondary-inner ytd-playlist-panel-renderer #playlist-items #wc-endpoint';
	var items=document.querySelectorAll(path);
	var ids=Array.from(items).map((item)=>{
	var ref=item.href;
	ref=ref.match(/.+watch\?v=(.+)&list=+./)[1];
	return ref;
	});
	const sizer=function(e){
	  	this.style.height=((parseInt(getComputedStyle(this).width) * 315)/560) + 'px';
	  };
	  	
	ids.forEach((id)=>{
	console.log('id',id);
	 var vPath='https://www.youtube.com/embed/' + id + '?modestbranding=1;rel=0';
	  var frameContainer=_$('div').addTo(container);
	  addEventListener('resize',sizer.bind(frameContainer));  
	  var frame=_$('iframe').atts({
	   // width:560,
	   // height:315,
	    'allowfullscreen':'',
	    'allow':'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
	  }).addTo(frameContainer);
	  frame.src=vPath
	});
		 
		 var panes=container.querySelectorAll(':scope > div');
		 Array.from(panes).forEach((pane)=>{
	 sizer.call(pane);
	});
		 

};

    var pop = ayanoglu.ui.floatMenu();
    pop.add('Open MultiWatch', ()=>{
    	buildWatchPanel();
    }
    , 'icon-list');
    

