import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 leading-relaxed text-gray-700">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Cancellation and Refund Policy</h1>
      <p>
        We maintain a clear and fair resolution process. Please read this policy before placing
        custom or ready-to-order requests.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">1. Cancellation Window</h2>
      <p>
        Orders can be canceled before production starts. Once a design enters customization,
        stitching, or dispatch stage, cancellation may not be possible.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">2. Refund Eligibility</h2>
      <p>
        Approved cancellations are refunded to the original payment source. Non-eligible cases may
        include completed custom work, delivered digital assets, or requests outside the supported
        timeline.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">3. Damaged or Incorrect Delivery</h2>
      <p>
        If you receive a damaged or incorrect item, report it within 48 hours with photos and order
        reference. We will verify and offer a replacement, credit note, or refund as applicable.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">4. Refund Timelines</h2>
      <p>
        Once approved, refunds are generally processed within 5 to 10 business days. Final posting
        depends on your bank or payment provider processing cycle.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">5. Support and Escalations</h2>
      <p>
        Every request is reviewed manually for fairness. Keep your order ID, issue summary, and
        photos ready to speed up resolution.
      </p>

      <p className="mt-8">
        For refund support, contact{" "}
        <a href="mailto:natureembroideries@gmail.com" className="text-purple-700 font-semibold">
          natureembroideries@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default RefundPolicy;
