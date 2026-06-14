# Capricorn Avatar Engine V1

Free-owned HTML/CSS/JS avatar engine for Capricorn.

## Files

- `index.html`
- `style.css`
- `avatar.js`

## GitHub Pages Setup

1. Create a new GitHub repo, for example:
   `capricorn-avatar-engine`

2. Upload these files into the root of the repo.

3. Go to:
   Settings → Pages

4. Set:
   Source: Deploy from a branch  
   Branch: main  
   Folder: /root

5. GitHub gives you a URL like:
   `https://YOURUSERNAME.github.io/capricorn-avatar-engine/`

## Wix Usage

You can embed the GitHub Pages URL in an iframe/custom element.

## Control From Wix

Send postMessage to the iframe:

```js
iframeElement.contentWindow.postMessage({
  type: "capricorn:setMode",
  mode: "speaking",
  label: "CAPRICORN SPEAKING"
}, "*");
```

Supported modes:

- idle
- verified
- listening
- thinking
- speaking
- success
- error
