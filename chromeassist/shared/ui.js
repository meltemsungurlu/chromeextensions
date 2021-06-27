//# sourceURL=@chrome-extension-ui.js 
console.log('%cLoading ui.js...', 'color:red;');

'use strict';

let selectionPop = function(handle, reset) {

	//  console.clear();

	let _$ = ayanoglu.DOM._$;
	var sId = 'selector-pop';
	var storageKey = 'wup-message-replies';

	var selPop = document.getElementById(sId);
	if (selPop && reset !== true) {
		document.body.removeChild(selPop);
		selPop = undefined;
	} else if (selPop)
		return;
const isEditable=(target)=>{
	return  target.contentEditable == "true" || ( target.tagName === "TEXTAREA" ||  target.tagName === "INPUT")
}
	var selectedText;
	let openEditor = ()=>{

		chrome.storage.sync.get(storageKey, (result)=>{
			var values = result[storageKey];
			if (!values)
				values = [];

			var dlg = new ayanoglu.ui.dialog();

			dlg.title = 'Replies';
			dlg.control.style.height = '-webkit-fill-available';
			var frm = _$('div').cls('ayanoglu').addTo(dlg.container);

			let addEditor = (value,i)=>{
				var valueObj = typeof value === 'object' ? value : {
					text: value
				};
				value = valueObj.text;

				var row = _$('div').css('margin-bottom:10px;').addTo(frm);
				var inputCell = _$('div').css(`display: flex;align-items: center;justify-content: space-between;`).addTo(row);
				var valueElement = _$('textarea').css('min-height:70px;width: -webkit-fill-available;').addTo(inputCell);
				var toolBox = _$('div').cls('').addTo(inputCell);
				var delBtn = _$('div').att('title', (i === -1) ? 'Ekle' : 'Sil').css(`margin-left: 10px;`).cls(i === -1 ? 'icon-plus' : 'icon-eraser').addTo(toolBox);

				valueElement.value = value != false ? value : '';

				valueElement.addEventListener('change', (e)=>{
					if (i === -1)
						return false;

					values[i] = e.target.value;

					var data = {};
					data[storageKey] = values;

					chrome.storage.sync.set(data, ()=>{
						loadListItems(true);

					}
					);
				}
				);

				delBtn.addEventListener('click', (e)=>{

					if (i !== -1 && !confirm('Mesaj silinecek !'))
						return;

					if (i === -1 && valueElement.value.trim().length === 0) {

						alert('Mesaj girmediniz !');
						return;
					}

					if (i === -1)
						values.push(valueElement.value);
					else
						values.splice(i, 1)

						var data = {};
					data[storageKey] = values;

					chrome.storage.sync.set(data, ()=>{
						loadListItems(true);

						frm.innerText = '';
						addEditor(false, -1);
						values.forEach(addEditor);

					}
					);
				}
				);

			}

			addEditor(false, -1);
			values.sort((a,b)=>a.localeCompare(b));
			values.forEach(addEditor);

			var mnuData = dlg.menu('Data', ()=>{

				frm.style.display = 'none';
				mnuData.style.display = 'none';

				var bulkRow = dlg.container.querySelector('div#bulk-editor');

				if (!bulkRow) {
					bulkRow = _$('div').att('id', 'bulk-editor').css('margin-bottom:20px;');
					dlg.container.insertBefore(bulkRow, frm);
					var inputCell = _$('div').addTo(bulkRow);
					var txtElement = _$('textarea').css('width: -webkit-fill-available;height:200px;margin-bottom:10px;').addTo(inputCell);
					txtElement.value = JSON.stringify(values);

					var saveBtn = _$('input').att('type', 'button').css('margin-left:0px;').att('value', 'Kaydet').addTo(inputCell);
					saveBtn.addEventListener('click', (e)=>{

						var rawValue = txtElement.value;
						var changedValues = JSON.parse(rawValue)

						if (typeof changedValues === 'object' && typeof changedValues.push === 'function') {
							values = changedValues;
							var data = {};
							data[storageKey] = values;

							chrome.storage.sync.set(data, ()=>{
								loadListItems(true);
								frm.style.display = 'unset';
								mnuData.style.display = 'unset';
								dlg.container.removeChild(bulkRow);
								frm.innerText = '';
								addEditor(false, -1);
								values.forEach(addEditor);

							}
							);
						} else {
							alert('Invalid list format!!!');
						}

					}
					)

					var clsBtn = _$('input').att('type', 'button').att('value', 'Kapat').addTo(inputCell);
					clsBtn.addEventListener('click', (e)=>{
						frm.style.display = 'unset';
						mnuData.style.display = 'unset';
						dlg.container.removeChild(bulkRow);
						mnuData.style.display = 'unset';
						bulkRow = undefined;
					}
					)

					saveBtn.disabled = true;
					txtElement.addEventListener('change', (e)=>{
						saveBtn.disabled = false;
					}
					);

				}

			}
			);

		}
		);

		return;

	}

	const loadListItems = (reset)=>{
		if (reset === true) {

			Array.from(listRow.children).forEach((item)=>{
				listRow.removeChild(item);
			}
			);
		}
		chrome.storage.sync.get(storageKey, (result)=>{
			var values = result[storageKey];
			if (!values)
				values = [];
			values.sort((a,b)=>a.localeCompare(b));
			values.forEach(addListItem)

		}
		);

	}
	let addListItem = (text)=>{
		var mnu = _$('div').addTo(listRow);
		var reg = new RegExp('(\\$\\{)([^\{:]+\:)([^\}:]+)(\\})','ig');
		var html = text.replace(reg, '<b>$3</b><span style="display:none;">$1$2$3$4</span>');
		var title = text.replace(reg, '$2');

		var textElement = _$('div').att('title', title).cls('t').addTo(mnu);
		textElement.innerHTML = html;

		if (handle)
			textElement.addEventListener('click', (e)=>{
				var text = textElement.innerHTML;
				var reg = new RegExp('<b>(.+)<\/b><span style=\"display:none;\">\\$\\{([^\{:]+)\:\\1\\}<\/span>','i');
				do {
					var res = reg.exec(text);
					if (res) {
						var value = prompt(res[1]);
						if(value==null || value.toString().trim().length===0) {
							return;
						}
						text = text.replace(reg, value)
					} else
						break;
				} while (true)

					handle(text);
				selPop.classList.remove('pop');
				toggleRow.classList.remove('pop');
			}
			)

	}

	//	ayanoglu.DOM.style(`   `);

	selPop = _$('div').atts({
		id: sId
	}).addTo(document.body);

	var header = _$('div').cls('header').addTo(selPop);

	var searchBox = _$('input').att('type', 'text').addTo(header);

	var onTopCk = _$('input').att('type','checkbox').addTo(header);
	var editBtn = _$('i').cls('faws-cog').addTo(header);
	
	  _$('i').cls('faws-close-2').addTo(header).addEventListener('click',()=>{
		  selPop.classList.remove('pop');
	  });
	
	
	var toggleRow = _$('div').cls('toggle').addTo(selPop);
	var textEditor = _$('textarea').addTo(toggleRow);
	var closeToggleBtn = _$('i').cls('icon-window-close').addTo(toggleRow);
	var addBtn = _$('i').cls('icon-plus').addTo(toggleRow);

	var listRow = _$('div').cls('list').addTo(selPop);


	let saveTextData = (e)=>{
		var text = textEditor.value;

		chrome.storage.sync.get(storageKey, (result)=>{
			var values = result[storageKey];
			if (!values)
				values = [];
			if (values.indexOf(text) === -1)
				values.push(text);
			var data = {};
			data[storageKey] = values;

			chrome.storage.sync.set(data, ()=>{
				loadListItems(true);

			}
			);

		}
		);
		toggleRow.classList.remove('pop');
	}
	;

	addBtn.addEventListener('click', saveTextData);
	closeToggleBtn.addEventListener('click', ()=>{
		toggleRow.classList.remove('pop');
	}
	);

	editBtn.addEventListener('click', (e)=>{
		openEditor()
	}
	);

	searchBox.addEventListener('mouseup', (e)=>{
		e.stopPropagation()
	}
	);
	searchBox.addEventListener('keydown', (e)=>{
		e.stopPropagation()
	}
	);
	let resetListSearch=()=>{
		searchBox.value='';
		Array.from(listRow.querySelectorAll('div')).forEach((row)=>{
			row.style.display = 'block';
		}
		)
	}
	let searchMessages = (e)=>{
		var value = e.target.value;
		console.log(value);
		var filter = (row)=>{

			var text = row.textContent;
			var re = new RegExp('.*' + value + '.*','i');
			return re.test(text);
		}
		;
		var editor = (row)=>{
			row.style.display = 'block';
		}
		var items = Array.from(listRow.querySelectorAll('div'));
		items.forEach((row)=>{
			row.style.display = 'none';
		}
		);
		var filtered = items.filter(filter);
		filtered.forEach(editor);
	}
	;

	searchBox.addEventListener('keyup', searchMessages);

	loadListItems();

	let setPopPos = (e)=>{
		if (isEditable(e.target)) {

			if (rects = e.target.getClientRects()) {
				if (rect = rects[0]) {
					selPop.style.left = (rect.left + 20) + 'px';
				}
			}
		} else {
			selPop.style.left = (e.clientX) + 'px';
		}

		selPop.style.top = (e.clientY) + 'px';

		if (rects = selPop.getClientRects()) {
			if (rect = rects[0]) {
				console.dir(rect);

				if (rect.bottom > document.body.clientHeight)
					selPop.style.top = (document.body.clientHeight - rect.height) + 'px';
				if (rect.right > document.body.clientWidth)
					selPop.style.left = (document.body.clientWidth - rect.width) + 'px';

			}
		}
	}

	var selecting = false;
	let upHandler = (e)=>{
	 
	
		if (selPop.contains(e.target))
			return;
		if (e.target === selPop) { 
			return;
		}
		if (e.type === "mouseup" && !selecting) {
			if(!onTopCk.checked)
				selPop.classList.remove('pop');
			toggleRow.classList.remove('pop');
			return;
		}
		var sel = document.getSelection().toString();

		if ((sel.trim().length > 0 && selecting === true) /*|| (e.type === "dblclick" && e.target.contentEditable == "true")*/) {
			console.log(document.getSelection().toString());
			selecting = false;
			selectedText = sel;
			selPop.classList.add('pop');

			textEditor.value = sel;

			setPopPos(e)

			toggleRow.classList.add('pop');

		} else {
			if(!onTopCk.checked && selPop.classList.contains('pop') )
			selPop.classList.remove('pop');
		}
		selecting = false;
	}
	let doubleClickHandler=(e)=>{


		if (isEditable(e.target)) {
			if (!selPop.classList.contains('pop')) {
				selPop.classList.add('pop');
				searchBox.focus(); 
				setPopPos(e);
			}
		}

	}
	document.body.addEventListener('dblclick',doubleClickHandler);
 
	document.addEventListener('selectstart', (e)=>{
		selecting = true;	
	 
	}
	);
 
	document.body.addEventListener('mouseup', upHandler);
	document.body.addEventListener('keydown', (e)=>{
		if (selPop.contains(e.target))
			return;
		selPop.classList.remove('pop');
	}
	);

	var response = {
			show: (mousePos)=>{
				loadListItems(true);
				selPop.cls('pop', true);
				setPopPos(mousePos);
			}
			,
			hide: ()=>{
				selPop.cls('pop', false);
			}
	}

	return response;
}

use('window.ayanoglu.ui.controls');

window.ayanoglu.ui.controls.selectionPop = selectionPop;
