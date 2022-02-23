# #01. インストール

### パッケージのインストール
現在、ApplizeパッケージはGitHub NPM Registryからのみ提供されます。

PATを任意の`.npmrc`に記述した後に、お好きなパッケージマネージャーで普通のパッケージと同様にインストールしてください。

```bash
yarn init
yarn add @aspulse/applize
```

### プロジェクトを作成する
以下のコマンドを入力すると、Applizeの動作に必要なファイル一式が整います。
```bash
yarn applize
```
プロジェクトのルートディレクトリを聞かれるので、  
カレントディレクトリで良い場合はそのままEnterを、別のディレクトリの場合はパスを入力してEnterを押下してください。

![image](https://user-images.githubusercontent.com/84216737/155279976-50b4e5a4-ed7f-42cf-9f74-c1ad9dbc4fa3.png)

上のようになれば成功です。

### ディレクトリ構造
- `dist/` ... プログラムのビルド結果が入ります。（開発者は基本的にこのフォルダを編集しません。）
- `entry/` ... ユーザーがあなたのサイトに訪れたときに最初に読み込まれるファイルです。<br>（ヘッダーやローディングアニメーションなどが該当します。）
- `pages/` ... Webサイトの各ページのTypeScriptファイルが入ります。
- `src/` ... Webサーバーのソースコードが入ります。
- `build.js` ... `src/` `pages/` `entry/`の中身をビルドして、`dist/`に出力します。

### サーバーを起動する。
もうサーバーを起動できるだけのスクリプトが整っているので、
```bash
node build.js
```
を実行すると`dist/`にビルドされます。

```bash
node dist/index.js
```
でWebサーバーを実行できます。

現時点では、起動時のログが何も表示されません( [#147](https://github.com/AsPulse/applize/issues/147) )が、エラーがなければ正常に起動できています。  
http://localhost:8080/ にアクセスしてみましょう。

![image](https://user-images.githubusercontent.com/84216737/155281135-7d903df3-0e34-4fe2-bd01-eca96270e142.png)

このようなページが立ち上がればOK！

- \>\> 次へ [#02. ページのルーティングと起動時オプション](02-pageroute-and-launchOption.md)
