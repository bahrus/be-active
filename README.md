# be-active [TODO]

Activate template content.

## Example 1 -- Preemptive

```html
<template be-active>
    <script id=blah src=blah/blah.js integrity=... crossorigin=anonymous></script>
    <style id=IndieFlowerFont>
        @import url(https://fonts.googleapis.com/css?family=Indie+Flower);
    </style>
</template>
```

## Why?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM (at least if the tag was cloned from a template).  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.

2.  Font dependencies of a web component have to be added outside of any shadow DOM.

3.  If a web component separates the JS payload from the file containing HTML (like a JSON file or an actual HTML file), it is convenient to list the dependencies in the file that actually uses them.

4.  Lazy loading dependencies becomes much more natural if the dependencies are closely positioned to their actual use.  So even if HTML Modules become a thing, this could still be useful in that context.  

5.  Support for hash integrities and for bundled CDN resources and for preloading resourcing is missing from import maps.

## Priors

Jquery's [load function provides](https://api.jquery.com/load/) support for loading script as well.

[lazy-imports](https://github.com/Polymer/lazy-imports) also shares similar goals.

be-active is a declarative alternative to [xtal-sip](https://github.com/bahrus/xtal-sip).

It is also non-blasphemous alternative to part of what [templ-mount](https://github.com/bahrus/templ-mount) does.


## **NBs:** 

Adopting this approach means your JavaScript references **cannot benefit from local bundling tools**.  I just don't see how to do that.  

Okay, maybe a plugin or two could do that.

Regardless, the solution *can* already work with both import maps and CDN's.

Each script reference must be a src attribute (no inline imports allowed).  You can add type=module if you wish, but it doesn't matter -- this only works for ES Modules.

By default, CDN provider [jsdelivr.com](https://www.jsdelivr.com/esm) is used.  However, alternative CDN's, such as cdn.skypack.dev, or unpkg.com or maybe an internal CDN, can be used.

To specify the alternative CDN, use the `be-active=[id of link tag, like a rel=preconnect]` attribute to specify it.  (However, for unpkg.com, a more complex configuration setting is required.)

The id is required, and is used in this way:  If the id matches to a link rel=preload (or link rel=anything, really) it will get the href from that link, and ignore the src attribute. Hash integrities will be copied from the link tag.

Also, use of an id will block other instances from trying to resolve to something else.  Recommended id is the bare import specifier you recommend when referencing the resource in code. This helps to avoid cluttering the head tag, which is where the script tags are placed.

What be-active does:

For each script tag found inside the be-active adorned template:

1.  If the id of the script tag matches a link tag, a dynamic import of the href is added to the head tag.  The link tag is removed.  End of story.
2.  One script tag will be created in the head tag, with the same id (assuming such an id doesn't already exist).
2.  The src attribute will be turned into a dynamic import inside the head script tag.  However, the import will be inside a try/catch block.
3.  Should the import fail, in the catch block, the src reference will be prepended with the CDN base url, and that will be tried. An optional postfix parameter will be specifiable.
4.  If the second attempted import fails, it will be logged to the console natively.
5.  If, in the future, import maps are enhanced to provide an api for resolving (or failing to resolve) a path, then the try catch won't be necessary.


## Options [TODO]

baseLinkRef - specify an id of alternative CDN link rel=preconnect.

data-is-link-ref-only applied to subset of individual script elements - if present, script tag will only use that (bundled) reference if it finds that link rel=preload/lazy tag.  Otherwise, does nothing.

data-only-if-no-bundled-link-ref="link-ref-id" - if present, script tag will only add this (unbundled) reference if no link-ref matching the value is found.  Otherwise, does nothing.

## Example 2 -- Lazy Loading [TODO]

Support be-observant style binding.

## Example 3  Support Media Queries [TODO]



