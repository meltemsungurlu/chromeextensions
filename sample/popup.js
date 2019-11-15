// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// https://developer.chrome.com/extensions/getstarted
'use strict';

 

function encodeText(){
  let color = element.target.value;
  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
  alert('tamam')
}


let source = document.getElementById('source-box');
let result = document.getElementById('result-box');
let convert = document.getElementById('encode-cmd');

convert.onclick = function(e) {
  var s=source.value;
  s=encodeURI(s);
  result.value=s;
};
