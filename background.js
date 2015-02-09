
function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  };
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    var match = getLocation(tab.url);
    chrome.tabs.insertCSS(tabId, {
      file: 'chromedotfiles/' + match.hostname + '.css'
    });
    chrome.tabs.executeScript(tabId, {
      file: 'chromedotfiles/' + match.hostname + '.js'
    });
  }
});
