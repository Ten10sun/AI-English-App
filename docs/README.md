# AI English Conversation App

## 概要
AIを活用した英会話学習アプリケーションです。ユーザーはAIと自然な英会話を楽しみながら、英語力を向上させることができます。

## 主な機能

- **AIとの英会話**: OpenAIのGPTモデルを活用した自然な英会話が可能
- **メッセージの翻訳**: 英語メッセージを日本語に翻訳して表示
- **会話の管理**: 複数の会話スレッドを作成・管理可能
- **レスポンシブデザイン**: スマートフォンやタブレットなど、様々なデバイスで快適に利用可能

## 技術スタック

- **バックエンド**: Laravel 10.x
- **フロントエンド**: 
  - JavaScript (ES6+)
  - Tailwind CSS
- **データベース**: SQLite
- **その他主要パッケージ**:
  - OpenAI PHP Client
  - Laravel Breeze (認証機能)

## システム要件

- PHP 8.1 以上
- Composer
- Node.js 16.x 以上 & npm 8.x 以上
- SQLite 3.8.8 以上

## インストール方法

1. リポジトリをクローン
   ```bash
   git clone [repository-url]
   cd ai-english-app
   ```

2. 依存パッケージのインストール
   ```bash
   composer install
   npm install
   ```

3. 環境設定ファイルの作成と設定
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   `.env`ファイルを編集し、必要な設定（データベース接続、OpenAI APIキーなど）を行ってください。

4. データベースのマイグレーション
   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```

5. アセットのビルド
   ```bash
   npm run build
   ```

6. アプリケーションの起動
   ```bash
   php artisan serve
   ```
   ブラウザで `http://localhost:8000` にアクセスしてください。

## 開発者向け情報

### テストの実行
```bash
php artisan test
```

### コードスタイルチェック
```bash
composer lint
```

### デバッグモードの有効化
`.env`ファイルで`APP_DEBUG=true`に設定することで、詳細なエラーメッセージを表示できます。

## ライセンス

このプロジェクトは [MITライセンス](LICENSE) の下で公開されています。



## 著者

Ten10sun
---

*このドキュメントはプロジェクトの進捗に伴い更新される場合があります。***


