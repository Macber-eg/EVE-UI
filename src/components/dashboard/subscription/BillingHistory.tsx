```tsx
import React from 'react';
import { format } from 'date-fns';
import { Receipt, Download } from 'lucide-react';

interface BillingHistoryProps {
  companyId: string;
}

export default function BillingHistory({ companyId }: BillingHistoryProps) {
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Fetch invoices from API
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [companyId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-white/5 rounded-lg mb-4"></div>
        <div className="h-12 bg-white/5 rounded-lg mb-4"></div>
        <div className="h-12 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <Receipt className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-400">No billing history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div>
            <p className="text-white font-medium">
              {format(new Date(invoice.date), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-400">
              {invoice.description}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              ${invoice.amount.toFixed(2)}
            </span>
            <button
              onClick={() => window.open(invoice.pdf_url, '_blank')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```