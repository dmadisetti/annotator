if(window.localStorage.color == undefined)
	window.localStorage.color = '#ffccff';

var canvas = document.createElement('canvas');
canvas.setAttribute('width', 19);
canvas.setAttribute('height', 19);
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
ctx.fillStyle=window.localStorage.color;
ctx.fill();
image=ctx.getImageData(0, 0, 19, 19);
chrome.browserAction.setIcon({imageData:image});

chrome.contextMenus.create({type:"normal",title:"Highlight",onclick:function(info){console.log(info);},contexts:['selection']});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.type == 'set'){
			for(data in request){
				if(data != 'type')
					window.localStorage[data] = request[data];
			}
		}
		else if(request.type == 'get'){
			var response = {}
			,len = request.values.length
			,i = 0;
			while (i < len){
				var value = request.values[i];
				response[value] = window.localStorage[value];
				i++;
			}
			sendResponse(response);
		}
		return;
	}
);