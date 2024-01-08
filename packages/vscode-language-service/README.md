<br>
<div align="center">

<p align="center">
    Master CSS Language Service for Visual Studio Code
</p>

</div>

##### On this page
- [Features](#features)
  - [Code-completion](#code-completion)
  - [Syntax highlighting](#syntax-highlighting)
- [Documentation](#documentation)
  - [Generate preview](#generate-preview)
- [Settings](#settings)
  - [`editor.quickSuggestions`](#editorquicksuggestions)
  - [`masterCSS.languages`](#mastercsslanguages)
  - [`masterCSS.files.exclude`](#mastercssfilesexclude)
  - [`masterCSS.classMatch`](#mastercssclassmatch)
  - [`masterCSS.previewColors: true`](#mastercsspreviewcolors-true)
  - [`masterCSS.inspect: true`](#mastercssinspect-true)
  - [`masterCSS.suggestions: true`](#mastercsssuggestions-true)
  - [`masterCSS.config`](#mastercssconfig)

<br>

[![Install to Visual Studio Code now](https://user-images.githubusercontent.com/33840671/185619535-3b426030-7efd-4470-a8d1-d35b5698ee0e.jpg)](https://marketplace.visualstudio.com/items?itemName=masterco.master-css-language-service)


## Features

### Code-completion
Smart suggestions for style names, values, semantics and selectors.

![code-completion](https://user-images.githubusercontent.com/33840671/185128193-de6c0550-7fa6-4b2d-842c-72f6b79e6d8f.gif)

### Syntax highlighting
Highlight class names to make them easier to read and identify.

![syntax-highlighting](https://user-images.githubusercontent.com/33840671/185127233-1556414a-2859-425f-a421-4b30ff228b9e.jpg)

Master CSS has pioneered applying syntax highlighting to class names in markup, which solves the problem of unreadable classes that are too long.

## Documentation
Visit [rc.css.master.co/docs/language-service](https://rc.css.master.co/docs/language-service) to view the full documentation

### Generate preview
Hover over Master class names to see their CSS generation.

![rendering-preview](https://user-images.githubusercontent.com/33840671/185128766-614f302e-7cc3-4294-9179-76f29069d4a6.gif)

## Settings
- [User and Workspace Settings - Visual Studio Code](https://code.visualstudio.com/docs/getstarted/settings#:~:text=To%20open%20the%20Settings%20editor,macOS%20%2D%20Code%20%3E%20Preferences%20%3E%20Settings)

### `editor.quickSuggestions`
```json
"editor.quickSuggestions": {
    "strings": true
},
```

### `masterCSS.languages`
Configure which languages should apply the Master CSS Language Service.
```json
"masterCSS.languages": [
  "html",
  "php",
  "javascript",
  "typescript",
  "javascriptreact",
  "typescriptreact",
  "vue",
  "svelte",
  "rust"
],
```

### `masterCSS.files.exclude`
Configure a glob pattern to prevent Master CSS Language Service from being applied.
```json
"masterCSS.files.exclude": [
    "**/.git/**",
    "**/node_modules/**",
    "**/.hg/**"
],
```

### `masterCSS.classMatch`
Configure Regex patterns as conditions for triggering Suggestions and generating previews.
```json
"masterCSS.classMatch": [
  "(class(?:Name)?\\s?=\\s?)((?:\"[^\"]+\")|(?:'[^']+')|(?:`[^`]+`))",
  "(class(?:Name)?={)([^}]*)}",
  "(?:(\\$|(?:(?:element|el)\\.[^\\s.`]+)`)([^`]+)`)",
  "(classList.(?:add|remove|replace|replace|toggle)\\()([^)]*)\\)",
  "(template\\s*\\:\\s*)((?:\"[^\"]+\")|(?:'[^']+')|(?:`[^`]+`))"
],
```

### `masterCSS.previewColors: true`
Render color boxes by color-related class names as previews.

### `masterCSS.inspect: true`
Preview the generated CSS rules when hovering over a class name.

### `masterCSS.suggestions: true`
Enable autocomplete suggestions.

### `masterCSS.config`
Configure the config file path.
```json
"masterCSS.config": "master.css.*"
```
