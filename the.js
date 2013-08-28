// Copyright (c) 2013 The Dylan Madisetti. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
settings = {
  synched:true,
  set: function(color){
    chrome.runtime.sendMessage({type:'set',color:color});
  },
  get: function(){
    chrome.runtime.sendMessage({type:'get',values:['color']}, function(response) {
      highlighter.color = response.color;
      highlighter.run = true;
    });
  }
}
settings.get();

var canvas = document.createElement('canvas');
canvas.setAttribute('width', 19);
canvas.setAttribute('height', 19);
var ctx = canvas.getContext('2d');
var ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.moveTo(3, 1);
ctx.lineTo(16, 1);
ctx.quadraticCurveTo(18, 1, 18, 3);
ctx.lineTo(18, 16);
ctx.quadraticCurveTo(18, 18, 16, 18);
ctx.lineTo(3, 18);
ctx.quadraticCurveTo(1, 18, 1, 16);
ctx.lineTo(1, 3);
ctx.quadraticCurveTo(1, 1, 3, 1);

function message(obj){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab;
    tab = tabs[0];
    chrome.tabs.sendRequest(tab.id, obj, function handler(response) {
        console.log(response);
    });
  });
}

var highlighter = {
  run: false,
  init: function(){
    inputs = document.getElementsByTagName('input');
    for (var i=0;i<4;i++){
      input = inputs[i];
      console.log(this.color);
      if (input.value == this.color)
        input.checked = true;
      input.addEventListener('click',this.change)
    }
  },
  change: function(e){
    highlighter.color = e.target.value;
    settings.set(highlighter.color);
    highlighter.animate();
  },
  animate:function(){
    ctx.fillStyle = this.color;
    ctx.fill();
    image=ctx.getImageData(0, 0, 19, 19);
    chrome.browserAction.setIcon({imageData:image});
  },


  grabPath:function(){
    function fullPath(el){
      var names = [];
      while (el.parentNode){
        if (el.id){
          names.unshift('#'+el.id);
          break;
        }else{
          if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
          else{
            for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
            names.unshift(el.tagName+":nth-child("+c+")");
          }
          el=el.parentNode;
        }
      }
      return names.join(" > ");
    }
  }
}


// Highlight soon as ready.
// Synchronous Hacks
document.addEventListener('DOMContentLoaded', function () {
  var wait = setInterval(function(){
    console.log('waiting');
    if(highlighter.run){
      clearInterval(wait);
      highlighter.init();
    }
  },10);
});


