'use client';

import { useEffect, useState } from 'react';
import PortalFeaturePage from '@/components/portal/PortalFeaturePage';

type FeeItem = {
  description: string;
  amount: string;
  statusLabel: string;
  dueDate?: string;
  paidAt?: string;
  studentName?: string;
};

export default function ParentFeesPage() {
  const [items, setItems] = useState<FeeItem[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/parent/fees')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setTotalOutstanding(d.summary?.totalOutstanding || '');
      })
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

  const displayItems = items.map((item) => ({
    label: item.studentName ? `${item.studentName} — ${item.description}` : item.description,
    value: item.amount,
    meta: item.paidAt
      ? `${item.statusLabel} · ${item.paidAt}`
      : `${item.statusLabel}${item.dueDate ? ` · Due ${item.dueDate}` : ''}`,
  }));

  if (items.length > 0 && totalOutstanding) {
    displayItems.push({
      label: 'Family total outstanding',
      value: totalOutstanding,
      meta: 'Pay online or at the school office',
    });
  }

  return (
    <PortalFeaturePage
      title="Fees & Payments"
      description="Consolidated fee ledger for all linked children."
      icon="wallet"
      items={displayItems}
      emptyTitle="No fee records"
      emptyDescription="Fee invoices for your children will appear here once issued by the school."
    />
  );
}
