//Copyright 2018 The Chromium Authors. All rights reserved.
//Use of this source code is governed by a BSD-style license that can be
//found in the LICENSE file.
//https://developer.chrome.com/extensions/getstarted
'use strict';

class treeNode {
	constructor(container){
		var c=_$('div').addTo(container);
		this.container=c;
		this.expanded=false; 
	}
	add(item){
		var text=item.windowId?item.title:item.id;
		var c=_$('div').cls('node',true).addTo(this.container);
		var ex=_$('div').cls('e',true).addTo(c);
		ex.cls('icon-plus',true);
		var t=_$('div').cls('t',true).text((item.windowId ?'':'Window ' )+ text).addTo(c);
 
		var sub=new treeNode(this.container); 
		sub.container.cls('c', true);
		sub.container.cls('off', true);
		
		ex.addEventListener('click',(e)=>{
			if( sub.expanded===true){
				e.target.cls('icon-plus',true);
				e.target.cls('icon-minus',false);
				sub.container.cls('off', true);
				sub.expanded=false;
			}
			else
			{
				e.target.cls('icon-plus',false);
				e.target.cls('icon-minus',true);
				sub.expanded=true;
				if(item.tabs && !sub.container.hasChildNodes() ) item.tabs.forEach((tab)=>{
					console.dir('\t\t' ,  tab);
					sub.add(tab) ;
				});

				sub.container.cls('off', false);
				
			}

		});
		return sub;
	}
}

class tree extends treeNode {
	constructor(container){
		super(container); 
		this.container.cls('tree-view',true);
	}
}

var d=document;
let onReady=(e)=>{

	var root=new tree(d.body);


	chrome.windows.getAll({populate:true},(items)=>{
		items.forEach((item)=>{
			console.dir(item);
			root.add(item) ;
		});
	})
}

var cssPath='shared/bootstrap.css';
var cssSrc=chrome.runtime.getURL( cssPath);
var css = d.createElement('link');
css.type = "text/css";
css.rel = "stylesheet"; 
css.href =cssSrc;
d.head.appendChild(css);


var path='shared/bootstrap.js';
var src=chrome.runtime.getURL( path);


var js = d.createElement('script');
js.type = "text/javascript";
js.defer = true
js.async = true;
js.addEventListener('load',onReady);
js.src =src;
d.head.appendChild(js);
