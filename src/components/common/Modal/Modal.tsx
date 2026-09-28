import { type ReactNode, useEffect } from 'react'

interface ModalProps { children: ReactNode; onClose: () => void; className?: string }

export function Modal({ children, className = '', onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])
  return <><button aria-label="Close menu" className="fixed inset-0 z-20 cursor-default bg-transparent" onClick={onClose} /><section className={`absolute z-30 ${className}`}>{children}</section></>
}
