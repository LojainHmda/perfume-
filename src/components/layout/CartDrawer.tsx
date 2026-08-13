import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore, useCursorStore } from '../../store/useStore';
import { useAudio } from '../../hooks/useAudio';
import { X, Trash2, ShoppingBag, Sparkles, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore();
  const { setCursor, resetCursor } = useCursorStore();
  const { playClick } = useAudio();
  const [checkoutSubmitted, setCheckoutSubmitted] = React.useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    playClick();
    setCheckoutSubmitted(true);
    setTimeout(() => {
      clearCart();
      setCheckoutSubmitted(false);
      closeCart();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[990] bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[995] w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg tracking-widest uppercase">
                  HAUTE PARFUMERIE BAG
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {checkoutSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl uppercase tracking-wider text-white">
                    Order Received
                  </h4>
                  <p className="text-xs font-sans text-zinc-400 tracking-widest uppercase max-w-xs">
                    Your luxury order is being prepared with gold foil gift packaging and signature wax seal.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-zinc-700" />
                  <p className="font-serif text-base text-zinc-400 uppercase tracking-widest">
                    Your Bag is Empty
                  </p>
                  <p className="text-xs text-zinc-600 max-w-xs">
                    Explore our three provocative fragrances to discover your signature scent.
                  </p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={`${item.fragrance.id}-${item.size}-${index}`}
                    className="flex gap-4 p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/80"
                  >
                    <div className="w-16 h-24 bg-black/80 rounded-lg p-1 flex items-center justify-center overflow-hidden border border-zinc-800 shrink-0">
                      <img
                        src={item.fragrance.image}
                        alt={item.fragrance.name}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-base text-white uppercase tracking-wider">
                            {item.fragrance.name}
                          </h4>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs font-sans tracking-widest text-amber-300 uppercase">
                          {item.size} • ${item.price}
                        </p>
                        {item.engravingText && (
                          <div className="mt-1 text-[10px] font-sans tracking-widest text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Engraved: "{item.engravingText}"</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && !checkoutSubmitted && (
              <div className="p-6 border-t border-zinc-800 space-y-4 bg-zinc-950">
                <div className="space-y-1 text-xs font-sans uppercase tracking-widest text-zinc-400">
                  <div className="flex justify-between">
                    <span>Complimentary Gift Box & Samples</span>
                    <span className="text-amber-300">Included</span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-zinc-900">
                    <span>Total</span>
                    <span className="text-amber-300 font-bold">${subtotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  onMouseEnter={() => setCursor('CHECKOUT', 'button')}
                  onMouseLeave={resetCursor}
                  className="w-full py-4 bg-gradient-to-r from-red-900 via-amber-600 to-red-900 text-white font-sans text-xs uppercase tracking-[0.3em] rounded-full shadow-lg hover:brightness-115 transition-all"
                >
                  Proceed to Checkout (${subtotal})
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
