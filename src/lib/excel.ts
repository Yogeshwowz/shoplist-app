// excel.ts
// Helper for generating Excel export with all tabs and updated order summary

import { OrderItem } from '../hooks/useOrderStore';
import { CustomerDetails } from '../components/CustomerDetailsForm';
import * as XLSX from 'xlsx';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

 
export async  function downloadOrderXlsx (
  allTabsData: Record<string, OrderItem[]>,
  orderSummary: OrderItem[],
  customer: CustomerDetails,
  orderNumber: string
) {
  let email: string
  // Prepare customer details as a 2D array (table) matching the web structure
  const customerRows = [
    ['Name', 'Phone', 'Order Date *'],
    [customer.name, customer.phone, customer.orderDate],
    ['Email', 'Boat Name *', ''],
    [customer.email, customer.boatName, ''],
    ['Order Number', customer.orderNumber, ''],
  ];



const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});


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

   const fileName = `${customer.orderNumber || orderNumber}Order_.xlsx`;
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Order');

  // Download the file
  const buffer = XLSX.writeFile(wb, `Order_${customer.orderNumber || orderNumber}.xlsx`);

   const command = new PutObjectCommand({
    Bucket: "excelfile-shoresupport",
    Key: `${fileName}`,
    //Key: `${fileName}`,
    Body: buffer,
    ContentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
     //ACL: "public-read", 
  });

  await s3.send(command);
    const url = `${import.meta.env.VITE_AWS_BUCKET_NAME}${fileName}`;

  console.log(url);
  console.log("Uploaded directly to S3!");
  email = customer?.email;
// alert('aaaaaaaaaaa=>' + customer.email);
// console.log('customer object:', customer);
// alert('customer email: ' + customer?.email);

  try {
  const VITE_NODE_API_URL = import.meta.env.VITE_NODE_API_URL;
  const response = await fetch(VITE_NODE_API_URL+"/api/user/sendMailAttachment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderNumber, url, email }),
  });

  if (!response.ok) {
    // If server returned an error
    const errorText = await response.text();
    alert(`Failed to save order: ${errorText}`);
    return;
  }

  alert("✅ Order saved successfully!");
} catch (err) {
  alert("✅ error successfully!");
  console.error(err);
  alert("❌ Network or server error while saving order.");
}




}