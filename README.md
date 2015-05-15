# [![Chrome dotfiles](https://raw.githubusercontent.com/diffsky/chromedotfiles/master/icon-64.png)](https://github.com/diffsky/chromedotfiles) Chrome dotfiles

Google Chrome Browser Extension to inject per domain js and css into tabs.

An alternative to [dotjs](https://github.com/defunkt/dotjs), Chrome dotfiles doesn't
require a webserver and can inject both js and css.

## Install

In the future this might get added to the Chrome Web Store, but for now it's easier to
add the extension in "developer mode".

- Clone this repo.
- Open google chrome to [chrome://extensions/](chrome://extensions/)
- Make sure "developer mode" is selected in the top right
- Click "Load unpacked extension..."
- Browse to the location of the clone repo, click "select"

If all goes well you should see something like:

![Chrome dotfiles](https://raw.githubusercontent.com/diffsky/chromedotfiles/master/assets/extensions.jpg)

Lastly, you will need to create the directory that will contain the js and css that
you want injected. In the root of the repo, create a directory named `chromedotfiles`.
Note that `chromedotfiles` can be a symlink if you prefer.

If you pull in future updates to the repo, you will need to click the extension "Reload" link.

## Usage

Inside of the `chromedotfiles` directory add javascript and css files that you want run, per domain.
The names of the files should match the hostname of the site you want them to run on, plus
the file extension.

For example, to run files on google.com, you would create:

`www.google.com.js`
```
console.log('hello from chrome dotfiles');
```

`www.google.com.css`
```
body.hp {
  background: #F00;
}
```

Which should result in:

![google](https://raw.githubusercontent.com/diffsky/chromedotfiles/master/assets/example.jpg)


If there is a `default.js` file in the `chromedotfiles` directory it will be injected into *every*
domain. This could be used to inject jquery (or any other js) into every site.


### Differences from [dotjs](https://github.com/defunkt/dotjs)

- only works in Google Chrome
- loads css as well as javascript
- css and js are injected into the page via the [tabs api](https://developer.chrome.com/extensions/tabs), no ajax calls and script evaluation is made
- jquery is not inserted anywhere (but see note about `default.js` if you want this)


---

Chrome dotfiles logo designed by [Daniel Garrett Hickey](http://thenounproject.com/daniel.g.hickey) from the [Noun Project](http://thenounproject.com/) :: Creative Commons – Attribution (CC BY 3.0)
