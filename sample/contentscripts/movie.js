
utility.addMenuItems([

    
    {

                         'title' : 'Search Movie of IMDB',
                         'contexts' : [
                                 'link','page'
                                 ],
                                 'documentUrlPatterns' : ['https://www.imdb.com/*'],
                                 'targetUrlPatterns' : [
                                         'https://www.imdb.com/title/tt*'
                                         ]


                 }


]);

utility.addMenuListener(function(menu,info,tab){


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
    
    var strWindowFeatures = "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
    window.open( url );

});