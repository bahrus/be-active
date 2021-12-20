# be-active [TODO]

Activate template content.

## Example 1 -- Preemptive

```html
<template be-active>
    <script id=blah src=blah/blah.js integrity=...></script>
    <style id=IndieFlowerFont>
        @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
    </style>
</template>
```

## **NBs:** 

Adopting this approach means your JavaScript references **cannot benefit from local bundling tools**.  I just don't see how to do that.

The solution *can* work with both import maps and CDN's, however.

Each script reference must be a src attribute (no inline imports allowed).  You can add type=module if you wish, but it doesn't matter -- this only works for ES Modules.

By default, CDN provider [jsdelivr.com](https://www.jsdelivr.com/esm) is used.  However, alternative CDN's, such as cdn.skypack.dev, or unpkg.com or maybe an internal CDN, can be used.

To specify the alternative CDN, use the `be-active=[base path to cdn]` attribute to specify it.  (However, for unpkg.com, a more complex configuration setting is required.)

The id is required, and is used in this way:  If the id matches to a link rel=preload (or link rel=anything, really) it will get the href from that link, and ignore the src attribute. Hash integrities will be copied from the link tag.

Also, id's must be unique across all usages -- to avoid cluttering the head tag (which is where the script tags are placed), only one reference per id will be placed via be-active.

What be-active does:

1.  For each script tag found inside the be-active adorned template, one script tag will be created in the head tag, with the same id.
2.  The src attribute will be turned into a dynamic import inside the head script tag.  However, the import will be inside a try/catch block.
3.  Should the import fail, in the catch block, the src reference will be prepended with the CDN backup, and that will be tried. An optional postfix parameter will be specifiable.
4.  If the second attempted import fails, it will be logged to the console.

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



snowpack turns () => import('be-hive/be-hive.js') into

() => import("/-/be-hive@v0.0.14-zGYYCkz0U1IVHXIDgRrM/dist=es2019,mode=imports/optimized/be-hive/be-hive.js")

jsdelivr turns it into

()=>import("/npm/be-hive@0.0.14/be-hive.js/+esm")

So they both absolute paths.  The problem is we need to know the domain.  So register function should be:

```TypeScript
customElements.whenDefined('be-active').then((ctor) => {
    ctor.register('blah', import.meta.url, () => import('my-blah-component/blah.js'));
});
```

Get the domain from the second argument, extract the stuff after the import(, and before the last )

Then there's bundling solutions, that does who knows what (sigh).

Appends each DOM element to head if no matching id found (id optional)

Why?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM.  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.

2.  Font dependencies of a web component have to be added outside of any shadow DOM.

## Example 2 -- Lazy [TODO]

## Example 2  Support Media Queries 

## Example 3  Support link preload tags.

If same id found as a link rel=preload tag, insert that script instead.

