var page = (window.location.host+window.location.pathname)
	.split('index.html')[0]
	.split('index.htm')[0]
	.split('index.php')[0]
, up = function(e){
	var message = {type:'set'}
	message[this.dataset.key] = this.parentNode.innerHTML;
	console.log(message);
	chrome.runtime.sendMessage(message, function(response) {})
}, annotator = {
	color:''
	,annotate:function(sel,rq){
		// Set up the Regex
		var wordarray = rq.info.selectionText.replace(/[\-\[\]\&\<\>\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&").split(" ")
		, regS = '(.*?)([^\\s]*?' + wordarray[0] + ')'
		, i = 0;
		while(i++<wordarray.length - 2)
			regS += word + '(' + wordarray[i] +')';
		regS += word + '(' + wordarray[i] +'[^\\s|^\<]*)(.*)$';
		// Test out the Regex
		var reg = new RegExp(regS)
		, parent = sel.anchorNode.parentNode
		, tries = 0;
		while(true){
			if(tries++ == 3) return false;
			var matches = parent.innerHTML.match(reg);
			if(matches != null) break;
			parent = parent.parentNode;
		}
		var hsh = hash(parent);
		// Update dat parent yo
		var i = 1
		, space = new RegExp('(\\s)*')
		, updated = matches[i]
		, newtag = true
		, _class = hsh.replace(/[\#\@\s\>\(\)\:]/g , "");
		while(i++ < matches.length - 3){
			if(newtag){
				updated += '<span style="background-color:' + annotator.color +'">';
				newtag = false;
			}
			updated += matches[i] + matches[i+1];
			if(matches[i+1].match(space) == null){
				updated += '</span>';
				newtag = true;
			}
			i++;
		}
		updated += matches[i++] + '</span><input type="checkbox" checked onchange="this.nextElementSibling.style.display = (this.checked)? \'inline\' : \'none\' " /><div data-key="' + page + hsh +'" contenteditable="true" style="height: 100px;width: 100px;background-color: #FFF;border: 2px solid black;position: absolute; float: left; display: inline;" class="-annotator ' + _class + '" ></div>' + matches[i];
		parent.innerHTML = updated;
		var boxes = [].concat(parent.querySelector('.'+_class));
		console.log(boxes);
		console.log(boxes.length);
		console.log(boxes[0])
		for (var i = boxes.length - 1; i >= 0; i--) {
			boxes[i].onkeyup = up;
		}
		return {'hash':hsh,'data':updated}
	}
}
// TH̘Ë͖́̉ ͠P̯͍̭O̚​N̐Y̡ H̸̡̪̯ͨ͊̽̅̾̎Ȩ̬̩̾͛ͪ̈́̀́͘ ̶̧̨̱̹̭̯ͧ̾ͬC̷̙̲̝͖ͭ̏ͥͮ͟Oͮ͏̮̪̝͍M̲̖͊̒ͪͩͬ̚̚͜Ȇ̴̟̟͙̞ͩ͌͝S̨̥̫͎̭ͯ̿̔̀ͅ
,word = '(\\s|(?:\<[\=\\sa-zA-Z1-9\"\'\\-\\_]*>)\\s*?|(?:\</[\\sa-zA-Z1-9\"\'\\-\\_]*>))*?';


chrome.runtime.sendMessage({type:'getPage',value:page}, function(response) {
	annotator.color = response.color;
	console.log(response);
	for (var i = response.hashes.length - 1; i >= 0; i--) {
		var el = document.querySelector(response.hashes[i].hash);
		if(el == null) continue;
		el.innerHTML = response.hashes[i].update;
	};
});

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.method === "getData") {
			annotator.color = request.color;
			response = annotator.annotate(window.getSelection(),request);
			sendResponse(response);
		}
});

function hash(el){
	var names = [];
	while (el.parentNode){
		if (el.id){
			names.unshift('@#'+el.id);
			break;
		}else{
			if (el==el.ownerDocument.documentElement) names.unshift('@'+el.tagName);
			else{
				for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
					names.unshift(el.tagName+":nth-child("+c+")");
			}
		el=el.parentNode;
		}
	}
	return names.join(" > ");
}