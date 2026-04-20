'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import PlaceholderImage from '@/components/layout/PlaceholderImage'

export function CartDrawer() {
  const { items, itemCount, total, removeItem, updateQuantity, isCartOpen, setCartOpen } = useCart()
  const { t } = useLanguage()

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-dark/40 z-[60] transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-cream z-[70] shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-light">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-dark" />
            <h2 className="font-serif text-xl text-dark">
              {t('cart.yourCart')} ({itemCount})
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-stone-light rounded-lg transition-colors"
          >
            <X size={20} className="text-dark" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-stone mb-4" />
              <p className="font-serif text-lg text-dark mb-2">{t('cart.emptyCart')}</p>
              <p className="font-sans text-sm text-warm mb-6">
                {t('cart.discoverEssenceOils')}
              </p>
              <button
                onClick={() => setCartOpen(false)}
              >
                <Link
                  href="/products"
                  className="px-6 py-3 bg-dark text-cream font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
                >
                  {t('cart.shopNow')}
                </Link>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-stone-light last:border-0">
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-stone-light">
                    <PlaceholderImage
                      width="w-20"
                      height="h-20"
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm text-dark truncate mb-1">
                      {item.name}
                    </h3>
                    <p className="font-sans text-sm font-medium text-dark mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-stone-light rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-stone-light transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-sans text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="p-1.5 hover:bg-stone-light transition-colors disabled:opacity-40"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-warm hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-light px-6 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-warm">{t('cart.subtotal')}</span>
              <span className="font-serif text-lg text-dark">{formatPrice(total)}</span>
            </div>
            <p className="font-sans text-xs text-warm">
              {t('cart.shippingCalculated')}
            </p>

            {/* Checkout Button */}
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="block w-full px-6 py-3.5 bg-dark text-cream text-center font-sans text-sm font-medium uppercase tracking-wider hover:bg-charcoal transition-colors"
            >
              {t('cart.viewCartCheckout')}
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center font-sans text-sm text-warm hover:text-dark transition-colors"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
