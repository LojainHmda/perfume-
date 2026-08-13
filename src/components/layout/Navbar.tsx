import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useCursorStore } from '../../store/useStore';
import { ShoppingBag, User } from 'lucide-react';

/**
 * Two-tier maison header: the wordmark holds the centre, navigation sits on its
 * own line beneath, and account/bag stay out at the right margin. The bar is
 * weightless over the hero and only gains a ground once the page moves.
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { items, toggleCart } = useCartStore();
  const { setCursor, resetCursor } = useCursorStore();
  const [lifted, setLifted] = useState(false);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToCollection = (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        lifted
          ? 'border-b border-[color:var(--border-subtle)] bg-obsidian/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="relative flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        {/* Left: sections */}
        <nav className="flex items-center gap-6 sm:gap-8" aria-label="Primary">
          <a
            href="#collection"
            onClick={goToCollection}
            onMouseEnter={() => setCursor('THE BOARD', 'button')}
            onMouseLeave={resetCursor}
            className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-porcelain transition-opacity hover:opacity-60 sm:text-xs"
          >
            Shop
          </a>
          <Link
            to="/story"
            onMouseEnter={() => setCursor('THE HOUSE', 'button')}
            onMouseLeave={resetCursor}
            className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-porcelain transition-opacity hover:opacity-60 sm:text-xs"
          >
            Brand
          </Link>
        </nav>

        {/* Centre: wordmark */}
        <Link
          to="/"
          onMouseEnter={() => setCursor('HOME', 'magnetic')}
          onMouseLeave={resetCursor}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-sm font-bold uppercase tracking-[0.18em] text-porcelain transition-opacity hover:opacity-60 sm:text-base sm:tracking-[0.24em]"
        >
          Checkmate<sup className="ml-0.5 text-[0.55em] align-super">®</sup>
        </Link>

        {/* Right: utilities */}
        <div className="flex items-center gap-5 sm:gap-7">
          <button
            onClick={() => navigate('/admin')}
            onMouseEnter={() => setCursor('ACCOUNT', 'button')}
            onMouseLeave={resetCursor}
            className="hidden font-sans text-xs font-bold uppercase tracking-[0.16em] text-porcelain transition-opacity hover:opacity-60 sm:block"
          >
            Account
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-porcelain sm:hidden"
            aria-label="Account"
          >
            <User className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
          </button>

          <button
            onClick={toggleCart}
            onMouseEnter={() => setCursor('BAG', 'button')}
            onMouseLeave={resetCursor}
            className="flex items-center gap-2 text-porcelain transition-opacity hover:opacity-60"
            aria-label={`Cart, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
          >
            <ShoppingBag className="h-[1.05rem] w-[1.05rem] sm:hidden" strokeWidth={1.5} />
            <span className="hidden font-sans text-xs font-bold uppercase tracking-[0.16em] sm:inline">
              Cart ({totalQuantity})
            </span>
            <span className="notation sm:hidden">{String(totalQuantity).padStart(2, '0')}</span>
          </button>
        </div>
      </div>

    </header>
  );
};
