// excel.ts
// Helper for generating Excel export with all tabs and updated order summary

import { OrderItem } from '../hooks/useOrderStore';
import { CustomerDetails } from '../components/CustomerDetailsForm';
import * as XLSX from 'xlsx';

export function downloadOrderXlsx(
  allTabsData: Record<string, OrderItem[]>,
  orderSummary: OrderItem[],
  customer: CustomerDetails,
  orderNumber: string
) {
  // Prepare customer details as a 2D array (table) matching the web structure
  const customerRows = [
    ['Name', 'Phone', 'Order Date *'],
    [customer.name, customer.phone, customer.orderDate],
    ['Email', 'Boat Name *', ''],
    [customer.email, customer.boatName, ''],
    ['Order Number', customer.orderNumber, ''],
  ];

  // Prepare order summary header and rows
  const summaryHeader = [
    'Category',
    'Bin Code',
    'Description',
    'Packaging',
    'Quantity',
    'Chef Comment',
  ];
  const summaryRows = orderSummary.map(item => [
    item.category,
    item.binCode || '',
    item.description,
    item.packaging,
    item.quantity,
    item.chefComment || '',
  ]);

  // Combine all for the main sheet
  const wsData = [
    ['Customer Details'],
    ...customerRows,
    [],
    ['Order Summary'],
    summaryHeader,
    ...summaryRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Order');

  // Download the file
  XLSX.writeFile(wb, `Order_${customer.orderNumber || orderNumber}.xlsx`);
}