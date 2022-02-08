# be-active

Activate template content.

```html
<template be-active>
    <script id=blah/blah.js></script>
    <link href="https://fonts.googleapis.com/css?family=Indie+Flower">
</template>
```

The content inside becomes imported into the current page.

The same syntax above can be used in the following settings:

1.  If the syntax above is part of a SSR or SSG stream, even in some declarative Shadow DOM, based on the be-active attribute acting as a custom attribute / decorator / behavior, similar to how custom elements are activated.
2.  If the syntax above is encountered during template instantiation.
    1.  A plugin is provided that makes this template instantiation a simple config setting if using [DTR](https://github.com/bahrus/trans-render/#declarative-trans-render-syntax-via-plugins) for template instantiation.  [Demo](https://github.com/bahrus/be-active/blob/baseline/demo/pluginTest.html).  
    2.  The plugin approach above will work if the library is already loaded when template instantiation begins.  If the library is not loaded, *Nuk ka problem*, the custom attribute / decorator / behavior fallback will pick it up just fine.

## Why do we need this functionality?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM (at least if the tag was cloned from a template).  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.
2.  Font dependencies of a web component have to be added outside of any shadow DOM.
3.  If a web component separates the JS payload from the file containing HTML (like a JSON file or an actual HTML file), it is convenient to list the dependencies in the file that actually uses them.
4.  Lazy loading dependencies becomes much more natural if the dependencies are closely positioned to their actual use.  So even if HTML Modules become a thing, this could still be useful in that context. 
5.  Added plus of placing dependencies close to their use:  Developer can avoid vertiginousness, and not have to scroll up and down so much while adding imports.
6.  Support for hash integrities and for bundled CDN resources and for preloading resources is missing from import maps.
7.  This allows HTML streams to be used both as standalone web pages and also work as part of an embedded stream within the app / page via web components.

## Priors

Jquery's [load function](https://api.jquery.com/load/) provides support for loading script as well. As does the millions hits / month [shoelace include](https://shoelace.style/components/include) component.

[lazy-imports](https://github.com/Polymer/lazy-imports) also shares similar goals.

be-active is a declarative alternative to [xtal-sip](https://github.com/bahrus/xtal-sip).

It is also a non-blasphemous alternative to part of what [templ-mount](https://github.com/bahrus/templ-mount) does.


## **NBs:** 

Adopting this approach means, for now, your JavaScript references **cannot benefit from local bundling tools**.  Plugins for bundling tools are not yet available.

Regardless, the solution *can* already work with both import maps and CDN's.

Each script reference must have an id.  Inner inline script will be ignored.  You can add type=module if you wish, but it doesn't matter -- this only works for ES Modules, so that is assumed.

By default, CDN provider [jsdelivr.com](https://www.jsdelivr.com/esm) is used in the case that import maps fail.  However, alternative CDN's, such as cdn.skypack.dev, or unpkg.com or maybe an internal CDN, can be used.

The required id is used in two ways:  If the id matches to a link rel=preload (or link rel=anything, really) be-active will get the href from that link. Optional hash integrities will be copied from the link tag.  Same with crossorigin settings.

Also, use of an id will block other instances from trying to resolve to something else.  The id should be the bare import specifier that is recommended when referencing the resource in code. This helps to avoid cluttering the head tag, which is where the script tags are placed.

What be-active does:

For each script tag found inside the be-active adorned template: 

1.  If the id of the script tag matches a link tag, a dynamic import of the href is added to the head tag.  The link tag is removed.  End of story.
2.  One script tag will be created in the head tag, with the same id (assuming such an id doesn't already exist).
2.  The id will be turned into a dynamic import inside the head script tag.  However, the import attempt will be intercepted if it fails.
3.  Should the import fail, the src reference will be prepended with the CDN base url, and that will be tried. An optional postfix parameter will be specifiable.
4.  If the second attempted import fails, it will be logged to the console natively.
5.  If, in the future, import maps are enhanced to provide an api for resolving (or failing to resolve) a path, then the try catch won't be necessary. [TODO]

For each link tag:

1.  If the href of the link already exists as an id of a link rel=stylesheet outside any shadow DOM, do nothing.
2.  If the href of the link inside the template matches the id of a link rel=preload outside any shadow DOM, change the value of the rel from preload to stylesheet.
3.  Else clone the link tag inside the template, copy the href attribute to the id, insert in the head tag 

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

## Specify version for CDN backup

```html
<template>
    <script data-version=1.2.34 id=blah/blah.js></script>
</template>
```

<!--
data-is-link-ref-only applied to subset of individual script elements - if present, script tag will only use that (bundled) reference if it finds that link rel=preload/lazy tag.  Otherwise, does nothing. [TODO]

data-only-if-no-bundled-link-ref="link-ref-id" - if present, script tag will only add this (unbundled) reference if no link-ref matching the value is found.  Otherwise, does nothing.[TODO]

-->

## Prioritize via waiting

Each script tag can have a comma delimited list of web component definitions it should wait for before loading.

```html
<script data-when=my-custom-element-1,my-custom-element-2>
```


##  Block duplicate web component references

Normally, if web components are using ES modules, and all users of the dependency use ES modules syntax, and all resolve to the same version, then there is no extra network load imposed on the browser.  So developers don't need to worry about including import statements to libraries when in fact in some deployment scenarios, those references will already be imported from third party components.  No extra downloads occur.

But there are scenarios where a web component dependency may be defined in more than one way -- for example a web component provides both an SSR/HTML reference, and an alternative JS reference. 

In that case, we could end up doubling the network load, potentially seeing errors or warnings about multiple web component registrations with the same name, etc.

To minimize the chances of this happening, add an additional optional attribute to the script tag:

<script id=blah/blah.js data-for=blah-blah></script>

be-active will check before requesting the resource that there is no web component already registered with name "blah-blah", and if so, avoid doing anything. 

## Lazy Loading [TODO]

## Media Queries [TODO]

## Bundled References [TODO]



