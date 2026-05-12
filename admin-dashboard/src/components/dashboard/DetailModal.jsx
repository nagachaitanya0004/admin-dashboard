import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function DetailModal({ isOpen, onClose, children, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#030305]/80 backdrop-blur-md animate-fade-in"
        style={{ animationDuration: '0.2s' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        tabIndex="-1"
        className="relative w-full max-w-lg bg-[#0c0c11] border border-white/[0.08] rounded-[1.5rem] shadow-glass-glow shadow-glass-edge overflow-hidden animate-[modalScale_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards] focus:outline-none"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
