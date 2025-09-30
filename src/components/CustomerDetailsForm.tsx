import React from 'react';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  boatName: string;
  orderDate: string;
  deliverBy: string;
  orderName: string;
  orderNumber: string;
}

interface CustomerDetailsFormProps {
  details: CustomerDetails;
  onChange: (field: keyof CustomerDetails, value: string) => void;
  errors?: Partial<Record<keyof CustomerDetails, string>>;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ details, onChange, errors }) => (
  <form className="w-full my-6">
    <table className="w-full border border-gray-300">
      <tbody>
        <tr>
          <td className="border px-2 py-2 font-semibold">Name</td>
          <td className="border px-2 py-2">
            <input
              type="text"
              value={details.name}
              onChange={e => onChange('name', e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors?.name && <div className="text-red-600 text-sm">{errors.name}</div>}
          </td>
          <td className="border px-2 py-2 font-semibold">Phone</td>
          <td className="border px-2 py-2">
            <input
              type="text"
              value={details.phone}
              onChange={e => onChange('phone', e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors?.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
          </td>
          <td className="border px-2 py-2 font-semibold">Delivery Date *</td>
          <td className="border px-2 py-2">
            <input
              type="date"
              value={details.orderDate}
              onChange={e => onChange('orderDate', e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors?.orderDate && <div className="text-red-600 text-sm">{errors.orderDate}</div>}
          </td>
        </tr>
        <tr>
          <td className="border px-2 py-2 font-semibold">Email</td>
          <td className="border px-2 py-2">
            <input
              type="email"
              value={details.email}
              onChange={e => onChange('email', e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors?.email && <div className="text-red-600 text-sm">{errors.email}</div>}
          </td>
          <td className="border px-2 py-2 font-semibold">Boat Name *</td>
          <td className="border px-2 py-2">
            <input
              type="text"
              value={details.boatName}
              onChange={e => onChange('boatName', e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors?.boatName && <div className="text-red-600 text-sm">{errors.boatName}</div>}
          </td>
          <td className="border px-2 py-2"></td>
          <td className="border px-2 py-2"></td>
        </tr>
      </tbody>
    </table>
  </form>
);

export default CustomerDetailsForm;