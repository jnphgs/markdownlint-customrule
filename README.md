# Custom Rule for vscode-markdownlint

This is my custom rule for [vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint).

## Installation

1. Install [vscode-markdownlint](https://github.com/DavidAnson/vscode-markdownlint) to VSCode.
2. Open Settings.json
3. Add Custom Rule like following snippet.

```json
{
  //...
  "markdownlint.customRules": [
    "${PATH_TO_THIS_REPOSITORY}/MD_EXT001.js"
  ]
}
```
