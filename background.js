'use strict';

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
  var match = getLocation(tab.url);

  // load css early for no visible delays
  if (changeInfo.status === 'loading') {
    // attempt to insert domain specific css
    chrome.tabs.insertCSS(tabId, {
      file: 'chromedotfiles/default.css',
      runAt: 'document_start',
      allFrames: true
    }, function (res) {
      if (chrome.runtime.lastError) {
        // file not found, fail silently
        return;
      }
    });

    if (match) {
      // attempt to insert domain specific css
      chrome.tabs.insertCSS(tabId, {
        file: 'chromedotfiles/' + match.hostname + '.css',
        runAt: 'document_start',
        allFrames: true
      }, function(res) {
        if (chrome.runtime.lastError) {
          // file not found, fail silently
          return;
        }
      });
    }
  }

  // load js
  if (changeInfo.status === 'complete') {
    // attempt to execute default js
    chrome.tabs.executeScript(tabId, {
      file: 'chromedotfiles/default.js'
    }, function(res) {
      if (chrome.runtime.lastError) {
        // file not found, fail silently
        return;
      }
    });

    if (match) {
      // attempt to execute domain specific js
      chrome.tabs.executeScript(tabId, {
        file: 'chromedotfiles/' + match.hostname + '.js'
      }, function(res) {
        if (chrome.runtime.lastError) {
          // file not found, fail silently
          return;
        }
      });
    }
  }

});
