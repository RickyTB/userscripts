// ==UserScript==
// @name        Avoid YouTube Mix
// @namespace   RickyTB
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     1.0
// @author      Ricardo Baquero
// @description 31/12/2021 20:02:27
// ==/UserScript==

const interval = setInterval(() => {
  const targetNode = document.querySelector(".ytp-endscreen-content");
  if (!targetNode) return;
  observeEndscreenContent(targetNode);
  clearInterval(interval);
}, 1000);

function observeEndscreenContent(element) {
  // Options for the observer (which mutations to observe)
  const config = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.target === element) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName !== "A") return;
          try {
            const videoId = node.children[0].style.backgroundImage
              .replace(/^(.)*vi\//, "")
              .replace(/\/(.)*$/, "");

            const href = `https://www.youtube.com/watch?v=${videoId}`;
            node.href = href;
            node.addEventListener("click", () => {
              location = href;
            });
          } catch (e) {
            console.error(e);
          }
        });
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(element, config);

  // Later, you can stop observing
  //observer.disconnect();
}
