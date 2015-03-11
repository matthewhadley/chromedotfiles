
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
    if (!match) {
      return;
    }

    chrome.tabs.insertCSS(tabId, {
      file: 'chromedotfiles/' + match.hostname + '.css'
    }, function() {
      if (chrome.runtime.lastError) {
        return; // file not found. fail silently.
      }
    });

    chrome.tabs.executeScript(tabId, {
      file: 'chromedotfiles/' + match.hostname + '.js'
    }, function(res) {
      if (chrome.runtime.lastError) {
        return; // file not found. fail silently.
      }
      chrome.storage.sync.get({
        injectJquery: false
      }, function(items) {
        if (items.injectJquery) {
          chrome.tabs.executeScript(tabId, {
            file: 'jquery.min.js'
          }, function() {
            chrome.tabs.executeScript(tabId, {
              'code': '(typeof onJqueryLoad === "function") && onJqueryLoad();'
            });
          });
        }
      });
    });
  }
});
