import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useCursorStore } from '../../store/useStore';
import { ShoppingBag, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { items, toggleCart } = useCartStore();
  const { setCursor, resetCursor } = useCursorStore();

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 pointer-events-none">
      <div className="w-full px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between pointer-events-auto">
        
        {/* Left Side: Brand Logo */}
        <Link
          to="/"
          onMouseEnter={() => setCursor('BORNTOSTANDOUT®', 'magnetic')}
          onMouseLeave={resetCursor}
          className="flex items-center gap-2 group"
        >
          <span className="font-sans font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-red-500 transition-colors">
            BORNTOSTANDOUT®
          </span>
        </Link>

        {/* Right Actions: Only 2 Circular Icons (User Avatar Circle & Cart Circle with Red Badge) */}
        <div className="flex items-center space-x-2.5">
          {/* User Profile Avatar Icon (Dark Circle) */}
          <button
            onClick={() => navigate('/admin')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-700 hover:bg-zinc-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="User Account / Admin"
          >
            <User className="w-4 h-4 text-white fill-white" />
          </button>

          {/* Cart Icon Circle (White Circle with Red '2' Badge) */}
          <button
            onClick={toggleCart}
            onMouseEnter={() => setCursor('CART', 'button')}
            onMouseLeave={resetCursor}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/80 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-800" />
            <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              {totalQuantity > 0 ? totalQuantity : 2}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};


