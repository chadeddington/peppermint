export function fire(eventName, detail, context = document, bubbles = true) {
  var event = new CustomEvent(eventName, {detail, bubbles});
  context.dispatchEvent(event);
}

export function listen(eventName, callback, context = document) {
  context.addEventListener(eventName, callback);
}