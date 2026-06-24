'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

type FeeItem = {
  description: string;
  amount: string;
  statusLabel: string;
  dueDate?: string;
  paidAt?: string;
  reference: string;
};

export default function StudentFeesPage() {
  const [items, setItems] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/student/fees')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-9 w-9 rounded-full border-2 border-[var(--color-nav-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <PortalFeaturePage
      title="Fees & Payments"
      description="View balances, invoices, and make secure online payments."
      icon="wallet"
      items={items.map((item) => ({
        label: item.description,
        value: item.amount,
        meta: item.paidAt
          ? `${item.statusLabel} · ${item.paidAt} · ${item.reference}`
          : `${item.statusLabel}${item.dueDate ? ` · Due ${item.dueDate}` : ''} · ${item.reference}`,
      }))}
      emptyTitle="No fee records"
      emptyDescription="Your fee ledger will appear here once the school issues invoices."
    />
  );
}
