
addEventListener('load',()=>{
   var pop=ayanoglu.ui.floatMenu();
/*
  pop.add('Open Group Member Collector',()=>{
	var panel=ayanoglu.ui.panel();
	panel.control.style.bottom='10px';
	panel.control.style.top='10px';
	panel.control.style.left='10px';
	panel.control.style.right='400px';
	panel.button('Gooo',()=>{
		alert('okeeeee');
	})
}); 
*/
})


utility.addMenuItems([{
    'title': 'Tweet "%s"',
    'contexts': ['selection']
}
]);

utility.addMenuListener(function(menu, info, tab) {

    if (!info.selectionText)
        return;

    if (menu.title !== 'Tweet "%s"')
        return;
    console.log("info", info);
    var tag = 'okuyorum';
    if (info.pageUrl.indexOf('youtube.com') !== -1)
        tag = 'seyrediyorum';
    var d = document
      , l = d.location
      , e = encodeURIComponent;
    var f = 'https://twitter.com/intent/tweet';
    var p = '?url=' + e(tab.url) + '&text=' + e(info.selectionText + ' #' + tag + '\n\n') + '&related=habermakale%3AHaberler';
    var url = f + p;
    //https://developer.mozilla.org/en-US/docs/Web/API/Window/open
    var strWindowFeatures = "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
    window.open(url, "tweet-this", strWindowFeatures);

    /*		chrome.windows.create({
									url : url,
									width:700,
									height:300,
									focused:true,
									type:"popup"
					}, function ( tab ) {

					});
					*/
});
