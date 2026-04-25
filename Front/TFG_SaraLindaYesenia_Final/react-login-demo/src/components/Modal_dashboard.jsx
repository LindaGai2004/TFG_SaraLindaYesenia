import { X } from 'lucide-react';

const widthMap = {
  'max-w-md': '32rem',
  'max-w-lg': '36rem',
  'max-w-4xl': '56rem',
};

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null;

  const maxWidth = widthMap[width] || widthMap['max-w-lg'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        style={{ width: 'calc(100vw - 2rem)', maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close">
            <X size={18} color="#6d96a6" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
