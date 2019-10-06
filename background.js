'use strict';

function getLocation(href) {
  var match = href.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
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

function popSubdomain(str) {
  var newName = str.replace(/[^.]*\./, '');
  return str !== newName && newName;
}

function insertCSS(tabId, filename) {
  if (!filename) {
    return;
  }

  chrome.tabs.insertCSS(tabId, {
    file: 'chromedotfiles/' + filename + '.css',
    runAt: 'document_start',
    allFrames: true
  }, function (res) {
    if (chrome.runtime.lastError) {
      insertCSS(tabId, popSubdomain(filename));
      return;
    }
  });
}

function executeScript(tabId, filename) {
  if (!filename) {
    return;
  }

  chrome.tabs.executeScript(tabId, {
    file: 'chromedotfiles/' + filename + '.js'
  }, function(res) {
    if (chrome.runtime.lastError) {
      executeScript(tabId, popSubdomain(filename));
      return;
    }
  });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  var match = getLocation(tab.url);

  // load css early for no visible delays
  if (changeInfo.status === 'loading') {
    // attempt to insert domain specific css
    insertCSS(tabId, 'default');
    if (match) {
      insertCSS(tabId, match.hostname);
    }
  }

  // load js
  if (changeInfo.status === 'complete') {
    // attempt to execute default js
    executeScript(tabId, 'default');
    if (match) {
      executeScript(tabId, match.hostname);
    }
  }

});
