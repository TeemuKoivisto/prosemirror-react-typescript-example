/*
 * From Modernizr
 * Returns the kind of transitionevent available for the element
 */
export function whichTransitionEvent<TransitionEventName extends string>() {
  const el = document.createElement('fakeelement');
  const transitions: Record<string, string> = {
    transition: 'transitionend',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    WebkitTransition: 'webkitTransitionEnd',
  };

  for (const t in transitions) {
    if (el.style[t as keyof CSSStyleDeclaration] !== undefined) {
      // Use a generic as the return type because TypeScript doesnt know
      // about cross browser features, so we cast here to align to the
      // standard Event spec and propagate the type properly to the callbacks
      // of `addEventListener` and `removeEventListener`.
      return transitions[t] as TransitionEventName;
    }
  }

  return;
}
