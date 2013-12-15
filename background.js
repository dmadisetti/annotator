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


chrome.contextMenus.create({type:"normal",title:"Highlight",onclick:function(info){
	var page = info.pageUrl
		.split('://')[1]
		.split('#')[0]
		.split('index.html')[0]
		.split('index.htm')[0]
		.split('index.php')[0];
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {method: "getData",info:info,color:window.localStorage.color}, function(response) {
			window.localStorage[page + response.hash] = response.data;
		});
	});
},contexts:['selection']});

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
		}else if(request.type == 'getPage'){
			var response = {hashes:[]};
			for (var update in window.localStorage) {
				var details = update.split('@')
				, page = details[0];
				console.log(page);
				console.log(request.value);
				if(page != request.value) continue;
				var hash = details[1]
				, content = window.localStorage[update];
				response.hashes.push({'hash':hash,'update':content});
			}
			sendResponse(response);
		}
		return;
	}
);