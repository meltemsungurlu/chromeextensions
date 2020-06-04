/**
 * 
 */
var pop = ayanoglu.ui.floatMenu();
    pop.add('Open Group Member Collector', ()=>{
       
    	


    	let buildContactCSV =ayanoglu.google.buildContactCSV;
    	let parseContactCSV =ayanoglu.google.parseContactCSV;
    	let contactListDialog= ayanoglu.ui.contactListDialog ;

    	let getCSVText=ayanoglu.ui.getCSVText;

    	  var nameSelect='#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-hero-header-title > div.section-hero-header-title-description > div:nth-child(1) > h1';
    	   var addressSelect='#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(11) > button > div > div.ugiz4pqJLAG__text > div.ugiz4pqJLAG__primary-text.gm2-body-2';
    	   var phoneSelect='#pane > div > div.widget-pane-content.scrollable-y > div > div > div:nth-child(13) > button > div > div.ugiz4pqJLAG__text > div.ugiz4pqJLAG__primary-text.gm2-body-2';

    	  var find = ayanoglu.DOM.findElement;
    	 


    	Promise.all([find(nameSelect,'company'), 
    	find(addressSelect,'address'), 
    	find(phoneSelect,'phone')]).then((values) => {
    	 values=values.map((element)=>{
    	   return element.textContent;
    	 });

    	 var contact={
    	                        	   phone1Type: 'mobile',
    	                               phone1Value: values[2],
    	                            saved: false
    	                        }
    	  console.log(values);

    	 

     	
         var dlg = ayanoglu.ui.dialog();
         dlg.control.style.height = '100%'
         dlg.title = contact.name;
         var frm =  ayanoglu.ui.contactForm(dlg, dlg.container, contact);

         dlg.button('Ekle', ()=>{
             var line = frm.getCsv();
             var exists=false;
             var nContact=parseContactCSV(line);
             
             csvStack.some((csvLine)=>{
             	var tContact=parseContactCSV(line);
             	if(nContact.phone1Value===tContact.phone1Value) {
             		exists=true;
             		return true;
             	}
             })
          if(!exists)   csvStack.push(line);
         }
         );

         dlg.button('Liste', ()=>{
         	
         	var dlg=contactListDialog('CSV Text',false); 
               var output = getCSVText();
               dlg.writeText(output); 

         }
         )

         dlg.button('Sıfırla', ()=>{
             csvStack = [];
         }
         );
    	 
    	 
    	 

    	  
    	});
    	
    	
    }
    , 'icon-doc-text');