// var sel = window.getSelection();

annotator = {
	color:''
};

chrome.runtime.sendMessage({type:'get',values:['color']}, function(response) {
	annotator.color = response.color;
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
  	annotator.color = request.color;
  }
);