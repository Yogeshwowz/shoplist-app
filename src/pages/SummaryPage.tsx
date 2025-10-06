import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import CustomerDetailsForm from '../components/CustomerDetailsForm';
import useOrderStore from '../hooks/useOrderStore';
import { downloadOrderXlsx } from '../lib/excel';
import { NavLink } from 'react-router-dom';

const HEADER_HEIGHT = 72;

const Sidebar: React.FC<{ categories: string[], isMobile?: boolean, open?: boolean, onClose?: () => void }> = ({ categories, isMobile, open, onClose }) => {
  return (
    <>
      {/* Overlay for mobile drawer */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50"
          onClick={onClose}
          style={{ touchAction: 'none' }}
        />
      )}
      <aside
        className={`sidebar-vertical${isMobile ? ' mobile-sidebar' : ''}${isMobile && open ? ' open' : ''}`}
        style={isMobile ? {
          position: 'fixed',
          left: open ? 0 : '-200px',
          top: HEADER_HEIGHT,
          zIndex: 60,
          width: 170,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          background: '#fff',
          borderRight: '1px solid #e5e7eb',
          transition: 'left 0.3s',
          boxShadow: open ? '2px 0 8px rgba(0,0,0,0.08)' : 'none',
        } : {}}
      >
        <div className="font-bold text-lg mb-3 text-blue-900 flex items-center justify-between">
          Categories
          {isMobile && (
            <button onClick={onClose} className="ml-2 text-2xl font-bold text-blue-900">×</button>
          )}
        </div>
        {categories.map(cat => (
          <NavLink
            key={cat}
            to={`/category/${encodeURIComponent(cat)}`}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition font-semibold text-blue-900 hover:bg-blue-100 ${isActive ? 'bg-blue-100 ring-2 ring-blue-700' : ''}`
            }
            onClick={onClose}
          >
            {cat}
          </NavLink>
        ))}
      </aside>
    </>
  );
};

const SummaryPage: React.FC = () => {
  const { items, customer, setCustomer, reset } = useOrderStore();
  // Flatten items and filter for quantity > 0
  const initialAllItems = Object.values(items).flat().filter(item => item.quantity > 0);
  const [localItems, setLocalItems] = useState(initialAllItems);
  const [categories, setCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Fetch categories for sidebar
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'src/data/catalog.json')
      .then(res => res.json())
      .then(data => setCategories(Object.keys(data)));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync localItems if items change (e.g., after navigation)
  React.useEffect(() => {
    setLocalItems(Object.values(items).flat().filter(item => item.quantity > 0));
  }, [items]);

  const handleDownload = () => {
      setDownloadError(null);
    if (!customer.email || customer.email.trim() === '') {
      setDownloadError('Please enter your email before downloading the Excel sheet.');
      return;
    }
    if (!localItems.length) {
      setDownloadError('Order summary is empty. Please add at least one product before downloading.');
      return;
    }

    downloadOrderXlsx(items, localItems, customer, customer.orderNumber);
    reset();
  };

  const handleSummaryEdit = (id: string, field: 'quantity' | 'chefComment' | 'shopperComment', value: string | number) => {
    setLocalItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Submit order: send data to backend
  const handleSubmitOrder = async () => {
    try {
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: localItems,
          customer,
        }),
      });
      if (response.ok) {
        alert('Order submitted and emails sent!');
        reset();
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (err) {
      alert('Error submitting order. Please check your connection.');
    }
  };

  return (
    <div>
      <Header onHamburgerClick={() => setSidebarOpen(true)} showHamburger={isMobile} />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
        {/* Sidebar as drawer on mobile, as column on desktop */}
        {(!isMobile || sidebarOpen) && (
          <Sidebar categories={categories} isMobile={isMobile} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main style={{
          flex: '1 1 0%',
          maxWidth: '900px',
          padding: '1rem',
          fontFamily: `'Segoe UI', 'Roboto', 'Arial', sans-serif`,
          color: '#222',
        }}>
          <div className="max-w-5xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <CustomerDetailsForm details={customer} onChange={setCustomer} />
            <h3 className="text-xl font-semibold mt-8 mb-4">Order Summary</h3>
            <OrderSummary
              items={localItems}
              onChange={handleSummaryEdit}
              onDelete={(id) => setLocalItems(prev => prev.filter(item => item.id !== id))}
            />
<div className="">
   {downloadError && (
                <div
  className="text-red-600 text-sm mb-2"
  style={{
    alignSelf: 'flex-end',
    color: 'red',
    fontWeight: 700,
    padding: '2%',
    marginTop: '1%',
    border: '1px solid #ccc',
    textAlign: 'center',
  }}
>
  {downloadError}
</div>
              )}
</div>

            <div className="flex justify-end mt-8 gap-4">

             

              <button
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition"
                style={{ padding:'1%' , minWidth: 150, cursor: 'pointer', backgroundColor: '#1d4ed8', color: '#fff', opacity: 1 }}
                onClick={handleDownload}
                type="button"
                tabIndex={0}
                aria-disabled={false}
              >
                Submit Order
              </button>
              {/* <button className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-green-800 transition" type="button" onClick={handleSubmitOrder}>
                Submit Order
              </button> */}
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .sidebar-vertical {
          width: 170px;
          min-height: 100vh;
          background: #fff;
          border-right: 1px solid #e5e7eb;
          padding: 1.5rem 1rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          position: sticky;
          top: ${HEADER_HEIGHT}px;
          z-index: 40;
          height: calc(100vh - ${HEADER_HEIGHT}px);
        }
        @media (max-width: 767px) {
          .sidebar-vertical {
            position: fixed !important;
            left: -200px;
            top: ${HEADER_HEIGHT}px;
            z-index: 60;
            width: 170px;
            height: calc(100vh - ${HEADER_HEIGHT}px);
            transition: left 0.3s;
            box-shadow: none;
          }
          .sidebar-vertical.mobile-sidebar.open {
            left: 0 !important;
            box-shadow: 2px 0 8px rgba(0,0,0,0.08);
          }
        }
      `}</style>
    </div>
  );
};

export default SummaryPage;