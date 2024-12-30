import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../../test/utils/test-utils';
import CompanyCreationFlow from '../CompanyCreationFlow';
import { useCompanyStore } from '../../../../store/companyStore';

describe('CompanyCreationFlow', () => {
  beforeEach(() => {
    useCompanyStore.setState({
      company: null,
      loading: false,
      error: null
    });
  });

  it('starts with company type selection', () => {
    render(<CompanyCreationFlow />);
    expect(screen.getByText('Choose Your Company Type')).toBeInTheDocument();
    expect(screen.getByText('Corporation')).toBeInTheDocument();
    expect(screen.getByText('LLC')).toBeInTheDocument();
    expect(screen.getByText('Non-Profit')).toBeInTheDocument();
  });

  it('progresses through all steps', async () => {
    render(<CompanyCreationFlow />);

    // Select company type
    fireEvent.click(screen.getByText('Corporation'));
    await waitFor(() => {
      expect(screen.getByText('Company Information')).toBeInTheDocument();
    });

    // Fill company info
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Test Company' }
    });
    fireEvent.change(screen.getByLabelText(/Jurisdiction/i), {
      target: { value: 'Delaware' }
    });
    fireEvent.click(screen.getByText('Continue'));

    // Fill settings
    await waitFor(() => {
      expect(screen.getByText('Company Settings')).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    const mockError = 'Company creation failed';
    useCompanyStore.setState({
      error: mockError
    });

    render(<CompanyCreationFlow />);
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('shows loading state during company creation', async () => {
    useCompanyStore.setState({
      loading: true
    });

    render(<CompanyCreationFlow />);
    expect(screen.getByText('Creating your company...')).toBeInTheDocument();
  });
});