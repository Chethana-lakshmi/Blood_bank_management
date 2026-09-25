import React from 'react'
import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} fullWidth disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} fullWidth loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
