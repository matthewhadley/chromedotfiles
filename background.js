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

function insertCSS(tabId, hostname) {
  if (!hostname) {
    return;
  }

  chrome.scripting.insertCSS({
    target: {
      tabId: tabId,
      allFrames: true
    },
    files: ['chromedotfiles/' + hostname + '.css']
  }, function (_) {
    if (chrome.runtime.lastError) {
      // fail silently
      return;
    }
  });
  // attempt to insert next stylesheet in a subdomain chain
  insertCSS(tabId, popSubdomain(hostname));
}

function executeScript(tabId, hostname) {
  if (!hostname) {
    return;
  }
  chrome.scripting.executeScript({
    target: {
      tabId: tabId,
      allFrames: true,
    },
    files: ['chromedotfiles/' + hostname + '.js']
  }, (_) => {
    if (chrome.runtime.lastError) {
      // fail silently
      return;
    }
  });
  // attempt to execute next script in a subdomain chain
  executeScript(tabId, popSubdomain(hostname));
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  var match = getLocation(tab.url);

  // load css early for no visible delays
  if (changeInfo.status === 'loading') {
    // attempt to insert default css
    insertCSS(tabId, 'default');
    if (match) {
      // attempt to insert domain specific css
      insertCSS(tabId, match.hostname);
    }
  }

  // load js
  if (changeInfo.status === 'complete') {
    // attempt to execute default js
    executeScript(tabId, 'default');
    if (match) {
      // attempt to insert domain specific css
      executeScript(tabId, match.hostname);
    }
  }

});
