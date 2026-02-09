import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 leading-relaxed text-gray-700">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Shipping Policy</h1>
      <p>
        Nature Embroidery dispatches products with careful packaging and status updates at each
        major stage. This page explains timelines, delivery coverage, and what to expect.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">1. Processing Timeline</h2>
      <p>
        Orders are typically prepared within 2 to 5 business days depending on design complexity,
        customization, and order volume. Bulk and custom boutique requests can require additional
        preparation time.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">2. Shipping Regions</h2>
      <p>
        We currently ship across India through trusted courier partners. Delivery availability to
        remote locations depends on courier service coverage.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">3. Delivery Estimates</h2>
      <p>
        Standard deliveries usually arrive within 3 to 7 business days after dispatch. Delays can
        happen due to weather, courier disruptions, public holidays, or incomplete address details.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">4. Tracking and Notifications</h2>
      <p>
        Once your order is shipped, tracking details are shared through your order status page and
        communication channels available on your account profile.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">5. Address Accuracy</h2>
      <p>
        Customers are responsible for entering complete and accurate delivery details. Additional
        charges may apply for re-delivery in case of incorrect or incomplete addresses.
      </p>

      <p className="mt-8">
        For dispatch and shipping support, contact{" "}
        <a href="mailto:natureembroideries@gmail.com" className="text-purple-700 font-semibold">
          natureembroideries@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default ShippingPolicy;
