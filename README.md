# be-active [TODO]

Activate template content.

## Example 1

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

Appends each DOM element to head if no matching id found (id optional)

Why?  

1.  Outside shadow DOM, when a script tag is inserted, the browser "picks it up" and loads the dependency.  Not so inside Shadow DOM.  This strangely inconsistent behavior can be inconvenient, especially if we want to lazy load / prioritize how scripts are loaded.

2.  Font dependencies of a web component have to be added outside of any shadow DOM.

## Example 2  Support Media Queries 

## Example 3  Support link preload tags.

If same id found as a link rel=preload tag, insert that script instead.

