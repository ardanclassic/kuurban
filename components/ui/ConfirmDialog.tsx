"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Konfirmasi Hapus",
  message,
  confirmLabel = "Ya, Hapus",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onCancel}
            className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[501] flex items-center justify-center px-6 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 w-full max-w-sm p-6 pointer-events-auto">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>

              {/* Text */}
              <div className="text-center mb-7">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                >
                  <Trash2 className="w-4 h-4" /> {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
