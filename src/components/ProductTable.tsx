import React from 'react';

export interface ProductRow {
  id: string;
  category: string;
  description: string;
  packaging: string;
  quantity: number;
  chefComment?: string;
  binCode?: string;
}

interface ProductTableProps {
  products: ProductRow[];
  onChange: (id: string, field: 'quantity' | 'chefComment', value: string | number) => void;
  rowRefs?: React.MutableRefObject<{ [key: string]: HTMLTableRowElement | null }>;
  highlightedId?: string | null;
  highlightedIds?: string[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onChange, rowRefs, highlightedId, highlightedIds }) => {
  let lastCategory = '';
  let skipNext = false;
  return (
  <div className="overflow-x-auto">
      <style>{`
        /* Hide number input spinners on desktop */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    <table className="min-w-full border border-gray-200 bg-white">
      <thead className="bg-blue-900 text-white">
        <tr>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Bin Code</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Packaging</th>
          <th className="px-4 py-2">Quantity</th>
          <th className="px-4 py-2">Chef Comment</th>
        </tr>
      </thead>
      <tbody>
          {products.map((row, idx) => {
            const showSubcategory = row.category && row.category !== lastCategory;
            let subcategoryRow = null;
            if (showSubcategory) {
              subcategoryRow = (
                <tr key={`subcat-${row.category}-${idx}`}>
                  <td colSpan={6} className="bg-blue-900 text-white text-2xl font-bold text-center py-4" style={{letterSpacing: '1px'}}>
                    {row.category}
                  </td>
                </tr>
              );
              skipNext = false;
            }
            // If this is the first row after a subcategory header and all fields except category are empty, skip it
            if (
              showSubcategory &&
              !row.description &&
              !row.packaging &&
              (!row.quantity || row.quantity === 0) &&
              !row.chefComment
            ) {
              skipNext = true;
              lastCategory = row.category;
              return subcategoryRow;
            }
            if (skipNext) {
              skipNext = false;
              lastCategory = row.category;
              return null;
            }
            lastCategory = row.category;
            const isHighlighted = (highlightedIds && highlightedIds.includes(row.id)) || highlightedId === row.id;
            return (
              <React.Fragment key={row.id}>
                {subcategoryRow}
                <tr
                  ref={el => rowRefs && (rowRefs.current[row.id] = el)}
                  className={`border-b${isHighlighted ? ' bg-yellow-100' : ''}`}
                >
            <td className="px-4 py-2 whitespace-nowrap">{row.category}</td>
            <td className="px-4 py-2 whitespace-nowrap">{row.binCode}</td>
            <td className={`px-4 py-2 whitespace-nowrap${isHighlighted ? ' bg-yellow-300 font-bold' : ''}`}>{row.description}</td>
            <td className="px-4 py-2 whitespace-nowrap">{row.packaging}</td>
            <td className="px-4 py-2">
              <input
                type="number"
                min={0}
                max={99999}
                step={0.01}
                value={row.quantity}
                onChange={e => onChange(row.id, 'quantity', Math.max(0, Math.min(99999, parseFloat(e.target.value) || 0)))}
                className="w-20 border rounded px-2 py-1"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="text"
                maxLength={500}
                value={row.chefComment || ''}
                onChange={e => onChange(row.id, 'chefComment', e.target.value.slice(0, 500))}
                className="w-40 border rounded px-2 py-1"
              />
            </td>
          </tr>
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  </div>
);
};

export default ProductTable;