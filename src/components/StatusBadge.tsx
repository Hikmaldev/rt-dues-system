import React from "react";
import { PaymentStatus } from "@/types/database";

interface StatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  switch (status) {
    case "paid":
      return (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 ${className}`}
        >
          ● Lunas
        </span>
      );
    case "unpaid":
      return (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border border-rose-300 bg-rose-50 text-rose-800 ${className}`}
        >
          ● Belum Bayar
        </span>
      );
    case "partial":
      return (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full border border-amber-300 bg-amber-50 text-amber-900 ${className}`}
        >
          ● Sebagian
        </span>
      );
    default:
      return null;
  }
};
