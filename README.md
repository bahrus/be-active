# be-active [WIP]

Activate template content.

```html
<template be-active>
    <script id=blah/blah.js></script>
    <link href="https://fonts.googleapis.com/css?family=Indie+Flower">
</template>
```

## Why?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM (at least if the tag was cloned from a template).  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.

2.  Font dependencies of a web component have to be added outside of any shadow DOM.

3.  If a web component separates the JS payload from the file containing HTML (like a JSON file or an actual HTML file), it is convenient to list the dependencies in the file that actually uses them.

4.  Lazy loading dependencies becomes much more natural if the dependencies are closely positioned to their actual use.  So even if HTML Modules become a thing, this could still be useful in that context. 

5.  Added plus of placing dependencies close to their use:  Developer can avoid vertiginousness, and not have to scroll up and down so much while adding imports.

6.  Support for hash integrities and for bundled CDN resources and for preloading resourcing is missing from import maps.

7.  This allows HTML streams to be used both as standalone web pages and also work as part of an embedded stream within the app / page.

## Priors

Jquery's [load function](https://api.jquery.com/load/) provides support for loading script as well.

[lazy-imports](https://github.com/Polymer/lazy-imports) also shares similar goals.

be-active is a declarative alternative to [xtal-sip](https://github.com/bahrus/xtal-sip).

It is also a non-blasphemous alternative to part of what [templ-mount](https://github.com/bahrus/templ-mount) does.


## **NBs:** 

Adopting this approach means, for now, your JavaScript references **cannot benefit from local bundling tools**.  

Plugins for bundling tools are not yet available.

Regardless, the solution *can* already work with both import maps and CDN's.

Each script reference must have an id.  Inner inline script will be ignored.  You can add type=module if you wish, but it doesn't matter -- this only works for ES Modules, so that is assumed.

By default, CDN provider [jsdelivr.com](https://www.jsdelivr.com/esm) is used in the case that import maps fail.  However, alternative CDN's, such as cdn.skypack.dev, or unpkg.com or maybe an internal CDN, can be used.

The required id is used in two ways:  If the id matches to a link rel=preload (or link rel=anything, really) be-active will get the href from that link. Optional hash integrities will be copied from the link tag.  Same with crossorigin settings.

Also, use of an id will block other instances from trying to resolve to something else.  The id should be the bare import specifier that is recommended when referencing the resource in code. This helps to avoid cluttering the head tag, which is where the script tags are placed.

What be-active does:

For each script tag found inside the be-active adorned template: 

1.  If the id of the script tag matches a link tag, a dynamic import of the href is added to the head tag.  The link tag is removed.  End of story.
2.  One script tag will be created in the head tag, with the same id (assuming such an id doesn't already exist).
2.  The id will be turned into a dynamic import inside the head script tag.  However, the import will be inside a try/catch block.
3.  Should the import fail, in the catch block, the src reference will be prepended with the CDN base url, and that will be tried. An optional postfix parameter will be specifiable.
4.  If the second attempted import fails, it will be logged to the console natively.
5.  If, in the future, import maps are enhanced to provide an api for resolving (or failing to resolve) a path, then the try catch won't be necessary. [TODO]

For each link tag:

1.  If the href of the link already exists as an id of a link rel=stylesheet outside any shadow DOM, do nothing.
2.  If the href of the link inside the template matches the id of a link rel=preload outside any shadow DOM, get the href value of the link tag, and change the value of the rel from preload to stylesheet.[TODO]
3.  Else clone the link tag inside the template, copy the id attribute to the href, insert in the head tag [TODO]

## Options

Specifying an alternative CDN base url (only applies to script references):

Approach 1:

```html
<html>
    <head>
        <link rel=preconnect id=be-active/baseCDN href=https://cdn.skypack.dev>
    </head>
<body>
    ...
    <template be-active>
        <script id=blah/blah.js integrity=... crossorigin=anonymous></script>
        <link rel=stylesheet href="https://fonts.googleapis.com/css?family=Indie+Flower">
    </template>
</body>
</html>
```

Approach 2:

```html
<template be-active=https://cdn.skypack.dev>
    <script id=blah/blah.js integrity=... crossorigin=anonymous></script>
    <link rel=stylesheet href="https://fonts.googleapis.com/css?family=Indie+Flower">
</template>
```

Approach 2 might be better if only one CDN supports some JS language feature you are using.  Adopt approach 1 when the others catch up.

Note that with approach 1, it affects all components that rely on be-active, where the CDN base url isn't explicitly specified.

CDNpostFix - specify a string to append to end of CDN url.

Example:

```html
<template be-active='{
    "baseCDN": "https://unpkg.com/",
    "CDNPostfix": "?module"
}'>
    <script id=blah/blah.js integrity=... crossorigin=anonymous></script>
    <link rel=stylesheet href="https://fonts.googleapis.com/css?family=Indie+Flower">
</template>
```

data-is-link-ref-only applied to subset of individual script elements - if present, script tag will only use that (bundled) reference if it finds that link rel=preload/lazy tag.  Otherwise, does nothing. [TODO]

data-only-if-no-bundled-link-ref="link-ref-id" - if present, script tag will only add this (unbundled) reference if no link-ref matching the value is found.  Otherwise, does nothing.[TODO]

## Part I -- Preemptive

Recall our first example:

```html
<template be-active>
    <script id=blah/blah.js integrity=... crossorigin=anonymous></script>
    <link rel=stylesheet href="https://fonts.googleapis.com/css?family=Indie+Flower">
</template>
```

## Example 2 -- Lazy Loading [TODO]

Support be-observant style binding.

## Example 3  Support Media Queries [TODO]



