# Cloudflare Turnstile CAPTCHA 導入プロンプト

以下をClaudeに送ってください（[ ] 内は自分のプロジェクトに合わせて変更）：

---

私のウェブサイトのログインページとサインアップページに、Cloudflare TurnstileのCAPTCHA（「私はロボットではありません」）を導入したいです。

## プロジェクト情報
- フレームワーク: [Next.js 14 / Next.js 15 / React / etc.]
- 認証: [Supabase Auth / Firebase Auth / NextAuth / etc.]
- ホスティング: [Vercel / Netlify / etc.]
- ログインページのパス: [src/app/login/page.tsx]
- サインアップページのパス: [src/app/signup/page.tsx]

## Cloudflare Turnstileの情報
- Site Key: [あなたのSite Key]
- Secret Key: [あなたのSecret Key]

## やってほしいこと

1. **パッケージインストール**: `@marsidev/react-turnstile` をインストール

2. **ログインページに追加**:
   - Turnstileウィジェットをフォームのsubmitボタンの上に配置
   - CAPTCHAトークンをstateで管理
   - トークンが取得されていない場合はsubmitをブロック
   - 認証プロバイダーの `signInWithPassword` に `captchaToken` を渡す

3. **サインアップページに追加**:
   - 同様にTurnstileウィジェットを配置
   - `signUp` に `captchaToken` を渡す

4. **環境変数の設定**:
   - `.env.local` に `NEXT_PUBLIC_TURNSTILE_SITE_KEY` を追加
   - `.env.example` にも追加（値はプレースホルダー）

5. **認証プロバイダー側の設定手順も教えて**:
   - Secret Keyをどこに設定するか
   - Bot Protection / CAPTCHA の有効化手順

全ての変更をコードで実装してください。

---

## 補足: Cloudflare Turnstile の取得方法（まだ持っていない場合）

1. https://dash.cloudflare.com にログイン
2. 左メニュー「Turnstile」をクリック
3. 「Add site」でサイトを追加
4. Widget Mode は「Managed」を選択
5. 表示される Site Key と Secret Key をメモ

## 補足: Supabase を使っている場合の設定

1. Supabase Dashboard → Authentication → Attack Protection
2. 「Enable Captcha protection」をオン
3. 「Choose Captcha Provider」で「Turnstile by Cloudflare」を選択
4. 「Captcha secret」に Secret Key を貼り付け
5. 「Save changes」

## 補足: Vercel にデプロイしている場合

1. Vercel Dashboard → Project → Settings → Environment Variables
2. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = [あなたのSite Key] を追加
3. 再デプロイ
