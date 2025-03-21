# DOM Analyzer Chrome Extension

## Installation

1. Download the archive of the code. Unpack the archive.

2. Open the tab `chrome://extensions/` in Google Chrome or any Chromium browser.

3. Toggle "Developer mode" on the page.

4. Click on the "Load unpacked" button, find the folder with the unpacked extension, and choose `src` inside it.

5. The extension should be visible in the list of installed extensions.

## Work with extension

1. Open any website in the browser.

2. Open DevTools in the Elements tab.

3. Check the list of panels available in the Elements Tab: find the new panel "DOM Nodes" from the installed extension.

## Lighthouse checks for excessive DOM size

> Some official guides from Google say that Lighthouse counts DOM Nodes, but reality and the Google Page Speed Insights service show that it counts DOM elements. The current extension counts DOM elements, not nodes.
>
> A **DOM element** refers to an actual HTML tag in the DOM tree, such as `<div>` or `<p>`.
>
> A **DOM node** includes everything: elements, text nodes, comments, and whitespace.

By default, the panel "DOM Nodes" shows data of the total DOM Element of tag `body`, excluding tag `body`.

According to found information, this is the number of elements that counts Lighthouse and Google Page Speed Insight service:

- 1-799 elements: 🟢 (OK)
- 800-1399 elements: 🟠 (warning)
- 1400 and more elements: 🔴 (too large)

## Counter of DOM elements in chosen tag

Choose any tag in the Elements tab of DevTools.

Check the number of elements of the selected tag: it will include the tag and its children.

