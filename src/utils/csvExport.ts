// CSV Export Utility Functions
export interface CSVExportData {
  [key: string]: string | number | boolean | null | undefined;
}

export function convertToCSV(data: CSVExportData[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const csvHeaders = headers.join(',');
  
  // Create CSV data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string and escape quotes
      const stringValue = String(value);
      
      // If the value contains commas, quotes, or newlines, wrap in quotes and escape internal quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  // Create blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

export function formatTransactionsForCSV(transactions: any[]) {
  return transactions.map(transaction => ({
    'Date': new Date(transaction.transaction_date).toLocaleDateString(),
    'Description': transaction.description,
    'Category': transaction.category?.name || transaction.category || 'Uncategorized',
    'Account': transaction.account?.account_name || transaction.account_name || 'Unknown Account',
    'Type': transaction.type,
    'Amount': transaction.amount,
    'Created At': transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A'
  }));
}

export function formatAccountsForCSV(accounts: any[]) {
  return accounts.map(account => ({
    'Account Name': account.account_name,
    'Account Type': account.account_type,
    'Current Balance': account.current_balance,
    'Created At': account.created_at ? new Date(account.created_at).toLocaleDateString() : 'N/A'
  }));
}

export function formatInvestmentsForCSV(investments: any[]) {
  return investments.map(investment => ({
    'Symbol': investment.symbol,
    'Company Name': investment.name,
    'Shares': investment.shares,
    'Current Price': investment.current_price,
    'Total Value': investment.total_value,
    'Day Change': investment.day_change,
    'Day Change %': investment.day_change_percent,
    'Sector': investment.sector,
    'Market Cap': investment.market_cap,
    'P/E Ratio': investment.pe,
    'Dividend': investment.dividend,
    'Rating': investment.rating,
    'Last Updated': investment.updated_at ? new Date(investment.updated_at).toLocaleDateString() : 'N/A'
  }));
}