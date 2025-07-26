import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { convertToCSV, downloadCSV, formatTransactionsForCSV, formatAccountsForCSV } from '../csvExport';
import { mockTransaction, mockAccount } from '../../test/utils/test-utils';

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement and related DOM methods
const mockLink = {
  setAttribute: vi.fn(),
  click: vi.fn(),
  style: { visibility: '' },
};

global.document.createElement = vi.fn(() => mockLink as any);
global.document.body.appendChild = vi.fn();
global.document.body.removeChild = vi.fn();

describe('csvExport utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('convertToCSV', () => {
    it('should convert simple data to CSV format', () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' },
      ];

      const result = convertToCSV(data);
      const expected = 'name,age,city\nJohn,30,New York\nJane,25,Los Angeles';

      expect(result).toBe(expected);
    });

    it('should handle data with commas by wrapping in quotes', () => {
      const data = [
        { name: 'John, Jr.', description: 'Software Engineer, Senior' },
      ];

      const result = convertToCSV(data);
      const expected = 'name,description\n"John, Jr.","Software Engineer, Senior"';

      expect(result).toBe(expected);
    });

    it('should handle data with quotes by escaping them', () => {
      const data = [
        { name: 'John "Johnny" Doe', quote: 'He said "Hello"' },
      ];

      const result = convertToCSV(data);
      const expected = 'name,quote\n"John ""Johnny"" Doe","He said ""Hello"""';

      expect(result).toBe(expected);
    });

    it('should handle null and undefined values', () => {
      const data = [
        { name: 'John', age: null, city: undefined },
      ];

      const result = convertToCSV(data);
      const expected = 'name,age,city\nJohn,,';

      expect(result).toBe(expected);
    });

    it('should return empty string for empty array', () => {
      const result = convertToCSV([]);
      expect(result).toBe('');
    });

    it('should handle newlines in data', () => {
      const data = [
        { name: 'John', description: 'Line 1\nLine 2' },
      ];

      const result = convertToCSV(data);
      const expected = 'name,description\nJohn,"Line 1\nLine 2"';

      expect(result).toBe(expected);
    });
  });

  describe('downloadCSV', () => {
    it('should create and trigger download', () => {
      const csvContent = 'name,age\nJohn,30';
      const filename = 'test.csv';

      downloadCSV(csvContent, filename);

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      );
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', filename);
      expect(mockLink.click).toHaveBeenCalled();
      expect(global.document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(global.document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('should set link visibility to hidden', () => {
      downloadCSV('test', 'test.csv');
      expect(mockLink.style.visibility).toBe('hidden');
    });
  });

  describe('formatTransactionsForCSV', () => {
    it('should format transactions correctly', () => {
      const transactions = [
        {
          ...mockTransaction,
          transaction_date: '2024-01-15T10:30:00Z',
          created_at: '2024-01-15T10:30:00Z',
        },
      ];

      const result = formatTransactionsForCSV(transactions);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        'Date': '1/15/2024',
        'Description': 'Test Transaction',
        'Category': 'Food',
        'Account': 'Test Checking',
        'Type': 'expense',
        'Amount': 100,
        'Created At': '1/15/2024',
      });
    });

    it('should handle missing category', () => {
      const transactions = [
        {
          ...mockTransaction,
          category: null,
          transaction_date: '2024-01-15T10:30:00Z',
        },
      ];

      const result = formatTransactionsForCSV(transactions);
      expect(result[0]['Category']).toBe('Uncategorized');
    });

    it('should handle missing created_at', () => {
      const transactions = [
        {
          ...mockTransaction,
          created_at: null,
          transaction_date: '2024-01-15T10:30:00Z',
        },
      ];

      const result = formatTransactionsForCSV(transactions);
      expect(result[0]['Created At']).toBe('N/A');
    });
  });

  describe('formatAccountsForCSV', () => {
    it('should format accounts correctly', () => {
      const accounts = [
        {
          ...mockAccount,
          created_at: '2024-01-15T10:30:00Z',
        },
      ];

      const result = formatAccountsForCSV(accounts);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        'Account Name': 'Test Checking',
        'Account Type': 'checking',
        'Current Balance': 5000,
        'Created At': '1/15/2024',
      });
    });

    it('should handle missing created_at', () => {
      const accounts = [
        {
          ...mockAccount,
          created_at: null,
        },
      ];

      const result = formatAccountsForCSV(accounts);
      expect(result[0]['Created At']).toBe('N/A');
    });
  });
});