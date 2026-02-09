import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 leading-relaxed text-gray-700">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
      <p>
        Nature Embroidery respects your privacy and handles your personal data with care.
        This policy explains what we collect, why we collect it, and how we keep it protected.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">1. Data We Collect</h2>
      <p>
        We collect information you provide during account creation, checkout, and contact
        requests. This may include your name, email address, phone number, shipping address,
        order notes, and profile details.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">2. How We Use Your Information</h2>
      <p>
        Your data is used to process orders, share order updates, arrange delivery, resolve
        support queries, and improve service quality. We do not sell customer data to third
        parties for advertising purposes.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">3. Payments and Security</h2>
      <p>
        Payment and authentication operations are handled through secure third-party providers.
        We apply role-based access controls for internal operations and restrict sensitive access
        to authorized personnel only.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">4. Data Retention</h2>
      <p>
        Order and support records are retained for operational, accounting, and legal compliance
        purposes. When records are no longer required, we remove or anonymize them.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">5. Customer Rights</h2>
      <p>
        You can request correction of inaccurate profile details, ask for a copy of your stored
        information, and request deletion where legally permitted.
      </p>

      <h2 className="text-xl font-semibold mt-8 text-gray-900">6. Policy Updates</h2>
      <p>
        We may update this policy to reflect legal or platform changes. Major updates are
        published on this page with revised wording.
      </p>

      <p className="mt-8">
        For privacy-related requests, contact{" "}
        <a href="mailto:natureembroideries@gmail.com" className="text-purple-700 font-semibold">
          natureembroideries@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
