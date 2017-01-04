// Intercept Socket Traffic
chrome.webRequest.onBeforeRequest.addListener(
    function(details)
    {
        console.log(details);
    },
    {urls: ["*://*.youtube.com/embed/*"]},
    ["requestBody"]
);

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Ban %s for ";
  durations = [ "1", "7", "30", "365" ];
  for ( var i = 0; i < durations.length; i++ ) {
      console.log("adding " + durations[i]);
  
    chrome.contextMenus.create({"title": title + durations[i] + " day(s)", 
                                "contexts":[context],
                                "id": "ban" + i});
  }

});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
    console.log(info);
    switch (info.menuItemId) {
        case "ban0":
        case "ban1":
        case "ban2":
        case "ban3":
            banUser(info);
            break;
    }
  var sText = info.selectionText;
  
};

function banUser(info) {
    var bans = {
        "ban0" : 1,
        "ban1" : 7,
        "ban2" : 30,
        "ban3" : 365
    };
    
    var user = info.selectionText;
    console.log(user);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {message: "ban " + user.substring(0, -2) + " " + bans[info.menuItemId] }, 
        function(response) {
            console.log(response);
        }); 
        });
}
