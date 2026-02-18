import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PackageCard from '@/components/PackageCard';
import SearchBar from '@/components/SearchBar';
import { formatNumber, formatBytes, starRating, type Package } from '@/lib/utils';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockPkg: Package = {
  id: 'test-1', name: 'Test MCP Server', slug: 'test-mcp-server',
  description: 'A test MCP server for testing', category: 'mcp-tools',
  version: '1.2.0', author: 'tester', license: 'MIT',
  magnet_uri: 'magnet:?xt=urn:btih:test', platform: '["any"]',
  compatibility: '["claude","gpt"]', dependencies: '[]', tags: '["test","mcp"]',
  downloads: 42000, rating: 4.5, review_count: 23, seeders: 150,
  status: 'published', featured: 0, created_at: '2024-01-01', updated_at: '2024-01-01',
};

describe('PackageCard', () => {
  it('renders package name', () => {
    render(<PackageCard pkg={mockPkg} />);
    expect(screen.getByText('Test MCP Server')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<PackageCard pkg={mockPkg} />);
    expect(screen.getByText('A test MCP server for testing')).toBeInTheDocument();
  });

  it('renders rating', () => {
    render(<PackageCard pkg={mockPkg} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<PackageCard pkg={mockPkg} />);
    expect(screen.getByText('MCP Tool')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<PackageCard pkg={mockPkg} />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('mcp')).toBeInTheDocument();
  });

  it('links to package page', () => {
    render(<PackageCard pkg={mockPkg} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/package/test-mcp-server');
  });

  it('shows version', () => {
    render(<PackageCard pkg={mockPkg} />);
    expect(screen.getByText('v1.2.0')).toBeInTheDocument();
  });
});

describe('SearchBar', () => {
  it('renders input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<SearchBar defaultValue="test query" />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('has search button', () => {
    render(<SearchBar />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('allows typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });
});

describe('Utility functions', () => {
  it('formatNumber handles thousands', () => {
    expect(formatNumber(42000)).toBe('42.0K');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(500)).toBe('500');
  });

  it('formatBytes works', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('starRating generates correct stars', () => {
    expect(starRating(5)).toBe('★★★★★');
    expect(starRating(3)).toBe('★★★☆☆');
    expect(starRating(0)).toBe('☆☆☆☆☆');
  });
});
