# markdownlint の独自ルール (Custom Rule)

## 独自ルール

`markdownlint` プラグインは `option.customRules` プロパティを使って独自のルールを追加できます.
独自ルールではビルトインのルールができることはすべて可能で他のパッケージ( [`markdownlint-rule`](https://www.npmjs.com/search?q=keywords:markdownlint-rule) ) からインポートすることもできます.

## 書き方

ルールは次のもので定義されます.

- `names`: 文字列の配列でメッセージの出力と設定でルール名を識別するための値
- `description`: 出力メッセージ内でルールを記述した文字列
- `imfomation`: 任意で設定できる, ルールについて詳細な情報をもった URL
- `tags`: 関連するルールをグループ化するための文字列の配列
- `function`: ルールを実装した同期関数で以下の2つのパラメータを渡される
  - `params`: 解析されるコンテンツを記述しているプロパティをもったオブジェクト
    - `name`; 入力のファイル/文字列を識別するための文字列
    - `tokens`: `line`, `lineNumber` を追加した [`markdown-it Token`](https://markdown-it.github.io/markdown-it/#Token) オブジェクトの配列
    - `lines`: 入力のファイル/文字列に対応した文字列の配列
    - `frontMatterLines`: `lines`に表示されない frontmatter の文字列の配列(md ファイルの先頭に書いてあることのあるメタ情報)
    - `config`: `options.config` 内のルールのエントリに対応したオブジェクト
  - `onError`: ひとつの必須な `Object` パラメータと3つの任意なプロパティを受ける関数
    - `lineNumber`: エラーの1から始まるライン数を指定する必須の `Number`
    - `details`: 任意で, エラーの原因についての情報を持った文字列
    - `context`: 任意で, エラー箇所の周囲に対応したテキスト
    - `range`: 任意で, 1から始まる列とエラーの長さを識別する2つの `Number` による配列

この関数はそれぞれのファイル/文字列の入力に対して一度だけ実行され, パースされた入力と違反に対するログのための関数が渡されます.
シンプルなルールの実装は次のようになります.

```js
const { URL } = require("url");

module.exports = {
  "names": [ "any-blockquote" ],
  "description": "Rule that reports an error for any blockquote",
  "information": new URL("https://example.com/rules/any-blockquote"),
  "tags": [ "test" ],
  "function": function rule(params, onError) {
    params.tokens.filter(function filterToken(token) {
      return token.type === "blockquote_open";
    }).forEach(function forToken(blockquote) {
      var lines = blockquote.map[1] - blockquote.map[0];
      onError({
        "lineNumber": blockquote.lineNumber,
        "detail": "Blockquote spans " + lines + " line(s).",
        "context": blockquote.line.substr(0, 7)
      });
    });
  }
};
```

このルールではすべての引用文 (Markdown では下のように引用を書きます) にエラーメッセージを表示します.

```markdown
# これは Markdown の文章です

> これは Markdown での引用です
> これは Markdown での引用です
> これは Markdown での引用です
```

そのために `function` は `params` でパースされた markdown のオブジェクトを受け取り, エラーの数 `onError` 関数を実行します.
markdown のファイル, 文字列は一番最後に書いてあるようにオブジェクトへパースされます.
今回は まず`params.tokens` を走査して `"blockquote_open` のタイプの token オブジェクトをフィルタリングします.
フィルタリングしたすべての `"blockquote_open` のタイプの token オブジェクト についてそのライン数などの情報を使って `onError` 関数を呼ぶことでエラー表示することができます.
この js ファイルを VSCode の Settings.json の `markdownlint.customRules` に追加してエディタを再起動すればルールが適用されます.

```json
{
  "markdownlint.customRules": [
    ".vscode/markdown-rule.js"
  ]
}
```

```markdown
# Title

Text *text* text.
```

```json
{
  "name": "doc/example.md",
  "tokens": [
    {
      "type": "heading_open",
      "tag": "h1",
      "attrs": null,
      "map": [ 0, 1 ],
      "nesting": 1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "#",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "# Title",
      "lineNumber": 1
    },
    {
      "type": "inline",
      "tag": "",
      "attrs": null,
      "map": [ 0, 1 ],
      "nesting": 0,
      "level": 1,
      "children": [
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 0,
          "children": null,
          "content": "Title",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 1,
          "line": "# Title"
        }
      ],
      "content": "Title",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "# Title",
      "lineNumber": 1
    },
    {
      "type": "heading_close",
      "tag": "h1",
      "attrs": null,
      "map": null,
      "nesting": -1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "#",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false
    },
    {
      "type": "paragraph_open",
      "tag": "p",
      "attrs": null,
      "map": [ 2, 3 ],
      "nesting": 1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "Text *text* text.",
      "lineNumber": 3
    },
    {
      "type": "inline",
      "tag": "",
      "attrs": null,
      "map": [ 2, 3 ],
      "nesting": 0,
      "level": 1,
      "children": [
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 0,
          "children": null,
          "content": "Text ",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "em_open",
          "tag": "em",
          "attrs": null,
          "map": null,
          "nesting": 1,
          "level": 1,
          "children": null,
          "content": "",
          "markup": "*",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 1,
          "children": null,
          "content": "text",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "em_close",
          "tag": "em",
          "attrs": null,
          "map": null,
          "nesting": -1,
          "level": 0,
          "children": null,
          "content": "",
          "markup": "*",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        },
        {
          "type": "text",
          "tag": "",
          "attrs": null,
          "map": null,
          "nesting": 0,
          "level": 0,
          "children": null,
          "content": " text.",
          "markup": "",
          "info": "",
          "meta": null,
          "block": false,
          "hidden": false,
          "lineNumber": 3,
          "line": "Text *text* text."
        }
      ],
      "content": "Text *text* text.",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false,
      "line": "Text *text* text.",
      "lineNumber": 3
    },
    {
      "type": "paragraph_close",
      "tag": "p",
      "attrs": null,
      "map": null,
      "nesting": -1,
      "level": 0,
      "children": null,
      "content": "",
      "markup": "",
      "info": "",
      "meta": null,
      "block": true,
      "hidden": false
    }
  ],
  "lines": [
    "# Title",
    "",
    "Text *text* text.",
    ""
  ],
  "frontMatterLines": [],
  "config": {
    "customValue1": "abc",
    "customValue2": 123
  }
}
```
