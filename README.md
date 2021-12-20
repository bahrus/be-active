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

Why?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM.  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.

2.  Font dependencies of a web component have to be added outside of any shadow DOM.

## **NBs:** 

Adopting this approach means your JavaScript references **cannot benefit from local bundling tools**.  I just don't see how to do that.  Okay, maybe a plugin or two could do that.

Regardless, the solution *can* work with both import maps and CDN's, however.

Each script reference must be a src attribute (no inline imports allowed).  You can add type=module if you wish, but it doesn't matter -- this only works for ES Modules.

By default, CDN provider [jsdelivr.com](https://www.jsdelivr.com/esm) is used.  However, alternative CDN's, such as cdn.skypack.dev, or unpkg.com or maybe an internal CDN, can be used.

To specify the alternative CDN, use the `be-active=[base path to cdn]` attribute to specify it.  (However, for unpkg.com, a more complex configuration setting is required.)

The id is required, and is used in this way:  If the id matches to a link rel=preload (or link rel=anything, really) it will get the href from that link, and ignore the src attribute. Hash integrities will be copied from the link tag.

Also, use of an id will block other instances from trying to resolve to something else.  Recommended id is the bare import specifiy you recommend when referencing the resource in code. This helps to avoid cluttering the head tag, which is where the script tags are placed.

What be-active does:

1.  For each script tag found inside the be-active adorned template, one script tag will be created in the head tag, with the same id (assuming such an id doesn't already exist).
2.  The src attribute will be turned into a dynamic import inside the head script tag.  However, the import will be inside a try/catch block.
3.  Should the import fail, in the catch block, the src reference will be prepended with the CDN base url, and that will be tried. An optional postfix parameter will be specifiable.
4.  If the second attempted import fails, it will be logged to the console.




## Example 2 -- Lazy [TODO]

## Example 2  Support Media Queries 

## Example 3  Support link preload tags.

If same id found as a link rel=preload tag, insert that script instead.

