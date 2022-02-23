# #02. ページのルーティングと起動時オプション

それでは、`src/index.ts`を覗いてみましょう。
```ts
import { Applize, PageRoute } from "@aspulse/applize";
import { index } from "../pages/index";
import { APISchema } from "./apiSchema";

const applize = new Applize<APISchema>(); // 1.

applize.addPageRoute(PageRoute.fromPage(index)?.urlRoute('/')?.code(200));

applize.run({}); // 2.
```
1. Applizeのサーバーは、`Applize`クラスの上に全て構築され、
2. `.run()`を実行することでサーバーがスタートします。

今回、runの引数には空のObjectを渡していますが、オプションを渡すこともできます。以下のとおりです。

### 起動時オプションの一覧
- port: number<br>　サーバーを開始するポート番号を指定します。(デフォルト: 8080)
- trailingSlash<br>　URL末尾のスラッシュについての振る舞いを指定します。
  - `'RedirectWithSlash'`<br>　スラッシュ付きのURLに常にリダイレクトします。
  - `'RedirectWithoutSlash'`<br>　スラッシュなしのURLに常にリダイレクトします。
  - `'NoChange'`<br>　特に何も行いません。（デフォルト）
- rootEndPoint<br>　ページが存在しなかったときのリダイレクト先です。今は特に気にする必要はありません。
- distRoot<br>　ビルド済みのフォルダが格納されたディレクトリのパスを指定します。（デフォルト: `./dist/`)

### ページのルーティング

前述の通り、サイト上の1ページ1ページは全て`pages/`の一ファイルに対応します。  
`pages/`内のTypeScriptファイルは、`ApplizePage`クラスをエクスポートしていなければなりません。（ここの記述は次の節で説明します。）  
```ts
import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

export const index = new ApplizePage<APISchema>(adb => {
    adb.build('h1').text('Hello World!');
});
```
例えば、ここでエクスポートした`index`を、URL`/`に紐付け長ければ、
```ts
import { index } from "../pages/index";
applize.addPageRoute(PageRoute.fromPage(index)?.urlRoute('/')?.code(200));
```
のように記述します。

### ページを追加してみる
試しに、`pages/index.ts`をコピーして、 `pages/test.ts`という新しいページを作ってみましょう。
コピーしたら、以下の点を変更してみてください。

```ts
import { ApplizePage } from "@aspulse/applize/lib/clientPage";
import { APISchema } from "../src/apiSchema";

export const test = new ApplizePage<APISchema>(adb => { //1.
    adb.build('h1').text('This is a test page!'); //2.
    adb.finish({ title: 'Test Page' }); //3.
});

```

1. `index`となっていた変数名を、`test`に変更します。
2. 目印用のテキスト(`<h1>`タグ)を変更します。
3. タイトルバーに表示させるテキストを変更します。

では、`src/index.ts`に、先のページを`/test`にルーティングさせるコードを記述してみましょう。
```diff
  import { Applize, PageRoute } from "@aspulse/applize";
  import { index } from "../pages/index";
+ import { test } from "../pages/test";
  import { APISchema } from "./apiSchema";

  const applize = new Applize<APISchema>();

  applize.addPageRoute(PageRoute.fromPage(index)?.urlRoute('/')?.code(200));
+ applize.addPageRoute(PageRoute.fromPage(test)?.urlRoute('/test')?.code(200));

  applize.run({});

```
例によってビルドしてサーバーを起動し、
```bash
node build.js
node dist/index.js
```
http://localhost:8080/test にアクセスしてみましょう。

![image](https://user-images.githubusercontent.com/84216737/155283900-f9a9343a-0e8a-4f84-837d-cde30b9199e8.png)

このようになれば成功です！

- \<\< 前へ [#01. ページのルーティングと起動時オプション](01-installation.md)
- \>\> 次へ [#03. HTMLを記述する](03-how-to-write-html.md)

