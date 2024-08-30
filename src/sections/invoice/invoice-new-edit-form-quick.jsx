// src/components/invoice-new-edit-form.js
import axios from 'axios';
import React, { useState } from 'react';


export const createInvoice = async (invoiceParameter) => {
  try {
    const response = await axios.post(`/api/invoices`, { invoiceParameter });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export function InvoiceNewEditFormQuick() {
  const [invoiceParameter, setInvoiceParameter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Replace with your API call
      await createInvoice(invoiceParameter);
      //alert('Invoice created successfully!');
    } catch (err) {
      setError('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="invoiceParameter">Invoice Parameter:</label>
        <input
          type="text"
          id="invoiceParameter"
          name="invoiceParameter"
          value={invoiceParameter}
          onChange={(e) => setInvoiceParameter(e.target.value)}
          placeholder="nbHours-Month (example:160-5)"
          required
          className="large-input" // Apply CSS class if using a stylesheet
           style={{ width: '100%', maxWidth: '600px' }} // Alternatively, use inline styles
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
