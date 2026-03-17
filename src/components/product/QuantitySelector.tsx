'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  onQuantityChange?: (quantity: number) => void;
  className?: string;
}

export function QuantitySelector({ onQuantityChange, className }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(10, quantity + 1);
    setQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 border border-stone rounded-lg p-3 w-fit',
        className
      )}
    >
      <button
        onClick={handleDecrease}
        disabled={quantity <= 1}
        className="p-1 text-dark hover:bg-stone/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="font-sans text-sm font-medium w-8 text-center">
        {quantity}
      </span>

      <button
        onClick={handleIncrease}
        disabled={quantity >= 10}
        className="p-1 text-dark hover:bg-stone/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
