# be-active 

Activate template content.

## Example 1 -- Preemptive

```html
<template be-active>
    <script type=module id=blah>
        import('./blah.js');
    </script>
    <style id=IndieFlowerFont>
        @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
    </style>
</template>
```

**NB:** When deploying to a CDN, all JavaScript paths that use bare import syntax must be deployed along with an import map.  This is a problem.

## Tentative solution

To use this library effectively with web components, where we can't expect consumer to set up elaborate import maps, do the following:

In JavaScript code that the browser executes, add the following code:

```TypeScript
customElements.whenDefined('be-active').then((ctor) => {
    ctor.register('blah', () => import('my-blah-component/blah.js'));
});
```

Now with be-active, just include the id:

```html
<template be-active>
    <script type=module id=blah></script>
</template>
```

CDN's will replace the arrow function with a fully qualified url (maybe)? 

Correction - both snowpack and jsdelivr appear to replace import url's with absolute paths.  Hopefully they would do the same with an arrow function (TBD)



Appends each DOM element to head if no matching id found (id optional)

Why?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM.  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.

2.  Font dependencies of a web component have to be added outside of any shadow DOM.

## Example 2 -- Lazy [TODO]

## Example 2  Support Media Queries 

## Example 3  Support link preload tags.

If same id found as a link rel=preload tag, insert that script instead.

