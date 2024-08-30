import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import { InvoiceDetailsView } from 'src/sections/invoice/view';
import axios from 'axios';  // Import axios
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const metadata = { title: `Invoice details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${id}`);
        setCurrentInvoice(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading invoice: {error.message}</p>;
  if (!currentInvoice) return <p>Invoice not found.</p>;

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <InvoiceDetailsView invoice={currentInvoice} />
    </>
  );
}
