//https://tureng.com/en/turkish-english/brew

utility.addMenuItems([
	  {

 				 'title' : 'Translate "%s"',
 				 'contexts' : [
 								 'selection'
 								 ]
  }

]);

utility.addMenuListener(function(menu,info,tab){

	if(!info.selectionText) return;
if(menu.title!=='Translate "%s"') return;
					console.log("info", info);

					var d = document , l = d.location , e = encodeURIComponent;
					var f = 'https://tureng.com/en/turkish-english/';
					var p =  info.selectionText ;
					var url = f + p;
//https://developer.mozilla.org/en-US/docs/Web/API/Window/open
var strWindowFeatures = "height=500,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
window.open( url, "translate-this",strWindowFeatures);

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
