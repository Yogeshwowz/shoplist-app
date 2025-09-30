import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Header from '../components/Header';
import ProductTable, { ProductRow } from '../components/ProductTable';
import useOrderStore from '../hooks/useOrderStore';

const HEADER_HEIGHT = 72; // px, adjust if your header height changes

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

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState('');
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { updateItem } = useOrderStore();
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});
  const [filteredProducts, setFilteredProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'src/data/catalog.json')
      .then(res => res.json())
      .then(data => {
        setCategories(Object.keys(data));
        // Merge with store data
        const storeItems = useOrderStore.getState().items[name!] || [];
        const rows = (data[name!] || []).map((row: any, idx: number) => {
          const id = `${name}-${idx}`;
          const storeItem = storeItems.find((item: any) => item.id === id);
          return {
            ...row,
            id,
            quantity: storeItem?.quantity ?? 0,
            chefComment: storeItem?.chefComment ?? '',
            binCode: row.binCode ?? storeItem?.binCode ?? '',
            description: row.description ?? storeItem?.description ?? '',
            packaging: row.packaging ?? storeItem?.packaging ?? '',
          };
        });
        setProducts(rows);
        setFilteredProducts(rows);
      });
  }, [name]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (id: string, field: 'quantity' | 'chefComment', value: string | number) => {
    setProducts(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    setFilteredProducts(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    const row = products.find(r => r.id === id);
    if (row) {
      // Always update all relevant fields in the store
      updateItem(name!, id, 'quantity', field === 'quantity' ? value : row.quantity);
      updateItem(name!, id, 'chefComment', field === 'chefComment' ? value : row.chefComment);
      updateItem(name!, id, 'binCode', row.binCode);
      updateItem(name!, id, 'description', row.description);
      updateItem(name!, id, 'packaging', row.packaging);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) {
      setHighlightedIds([]);
      setFilteredProducts(products);
      return;
    }
    const matches = products.filter(row =>
      row.description && row.description.toLowerCase().includes(value.toLowerCase())
    );
    setHighlightedIds(matches.map(row => row.id));
    setFilteredProducts(matches);
  };

  // Scroll to the first match after highlightedIds update
  React.useEffect(() => {
    if (highlightedIds.length > 0) {
      const firstId = highlightedIds[0];
      setTimeout(() => {
        rowRefs.current[firstId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightedIds]);

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '4px',
              marginBottom: '16px',
              position: 'sticky',
              top: `${HEADER_HEIGHT}px`,
              background: '#f6f8fa',
              zIndex: 45,
              padding: '0.5rem 0',
            }}
          >
            <h2 className="text-2xl font-bold mb-0" style={{ margin: 0 }}>{name}</h2>
            <input
              type="text"
              placeholder="Search product name..."
              value={search}
              onChange={handleSearch}
              className="border px-3 py-2 rounded w-full max-w-md ml-auto"
              style={{ marginLeft: '16px' }}
            />
          </div>
          <ProductTable
            products={filteredProducts}
            onChange={handleChange}
            rowRefs={rowRefs}
            highlightedIds={highlightedIds}
          />
          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition"
              onClick={() => navigate('/summary')}
            >
              Go to Summary
            </button>
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

export default CategoryPage;