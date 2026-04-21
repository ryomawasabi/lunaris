import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Specified Commercial Transactions Act | YINYANG GUARDIAN',
  description: 'Information required under the Specified Commercial Transactions Act for YINYANG GUARDIAN.',
}

export default function TokuteiPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-8 py-6 border-b border-stone-light">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-stone hover:text-dark transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-stone" />
          <span className="text-dark font-medium">Specified Commercial Transactions Act</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl text-dark mb-10">
          特定商取引法に基づく表記
        </h1>
        <p className="font-sans text-sm text-warm mb-10">
          Notation based on the Specified Commercial Transactions Act
        </p>

        <div className="space-y-0 border-t border-stone-light">
          <Row label="販売業者" sublabel="Seller">
            YINYANG GUARDIAN
          </Row>
          <Row label="運営責任者" sublabel="Representative">
            内田 稜真
          </Row>
          <Row label="所在地" sublabel="Address">
            〒220-0071 神奈川県横浜市西区浅間町1丁目4-3 ウィザードビル402
          </Row>
          <Row label="電話番号" sublabel="Phone">
            請求があった場合に遅滞なく開示いたします
          </Row>
          <Row label="メールアドレス" sublabel="Email">
            creseraairise@gmail.com
          </Row>
          <Row label="販売URL" sublabel="Website">
            https://www.yinyangguardian.com
          </Row>
          <Row label="販売価格" sublabel="Pricing">
            各商品ページに表示された価格（税込）
          </Row>
          <Row label="商品代金以外の必要料金" sublabel="Additional Fees">
            送料（$150以上のご注文で国内送料無料）、決済手数料はかかりません
          </Row>
          <Row label="お支払い方法" sublabel="Payment Methods">
            クレジットカード（Visa、Mastercard、American Express）、PayPal
          </Row>
          <Row label="お支払い時期" sublabel="Payment Timing">
            ご注文時に即時決済
          </Row>
          <Row label="商品の引き渡し時期" sublabel="Delivery">
            ご注文確認後、3〜5営業日以内に発送。国内配送は5〜7営業日、海外配送は10〜14営業日が目安です。
          </Row>
          <Row label="返品・交換" sublabel="Returns & Exchanges">
            商品到着後14日以内に限り、未使用・未開封の商品に限り返品・交換を承ります。お客様都合による返品の送料はお客様負担となります。不良品・誤配送の場合は当店負担にて対応いたします。
          </Row>
          <Row label="返品送料" sublabel="Return Shipping">
            不良品・誤配送の場合：当社負担。お客様都合の場合：お客様負担。
          </Row>
        </div>
      </div>
    </main>
  )
}

function Row({ label, sublabel, children }: { label: string; sublabel: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] border-b border-stone-light">
      <div className="bg-stone-light/30 px-6 py-4">
        <p className="font-sans text-sm font-medium text-dark">{label}</p>
        <p className="font-sans text-xs text-warm">{sublabel}</p>
      </div>
      <div className="px-6 py-4">
        <p className="font-sans text-sm text-dark leading-relaxed">{children}</p>
      </div>
    </div>
  )
}
