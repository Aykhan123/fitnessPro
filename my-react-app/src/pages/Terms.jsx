import React from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handleBackClick}
        className="mb-4 inline-flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">Last Updated: 09/09/2024</p>

      <p className="mb-4">
        Welcome to FitnessPro! These Terms and Conditions ("Terms") govern your
        use of our website, application, and services (collectively, the
        "Service"). By accessing or using the Service, you agree to be bound by
        these Terms. If you do not agree with these Terms, please do not use the
        Service.
      </p>

      <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By using our Service, you agree to these Terms and our Privacy Policy.
        We may update these Terms from time to time. Any changes will be posted
        on this page, and your continued use of the Service constitutes
        acceptance of those changes.
      </p>

      <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
      <p className="mb-4">
        To use certain features of the Service, you may need to create an
        account. You are responsible for maintaining the confidentiality of your
        account information and for all activities that occur under your
        account. You agree to notify us immediately of any unauthorized use of
        your account.
      </p>

      <h2 className="text-xl font-semibold mb-2">3. Use of the Service</h2>
      <p className="mb-4">
        You agree to use the Service only for lawful purposes and in accordance
        with these Terms. You must not:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>
          Use the Service in any way that violates any applicable federal,
          state, local, or international law.
        </li>
        <li>
          Impersonate any person or entity or falsely state or misrepresent your
          affiliation with a person or entity.
        </li>
        <li>
          Engage in any activity that interferes with or disrupts the Service.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">4. Content</h2>
      <p className="mb-4">
        You retain ownership of any content you submit to the Service, but you
        grant us a worldwide, non-exclusive, royalty-free license to use,
        reproduce, modify, and display such content in connection with the
        Service. You are solely responsible for the content you submit and must
        ensure that it does not infringe on any third-party rights.
      </p>

      <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
      <p className="mb-4">
        All intellectual property rights in the Service, including but not
        limited to trademarks, copyrights, and patents, are owned by FitnessPro
        or its licensors. You may not use any intellectual property without our
        prior written consent.
      </p>

      <h2 className="text-xl font-semibold mb-2">6. Disclaimers</h2>
      <p className="mb-4">
        The Service is provided "as is" and "as available." We make no
        warranties, express or implied, regarding the Service, including but not
        limited to the accuracy, completeness, or reliability of any information
        provided.
      </p>

      <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
      <p className="mb-4">
        To the fullest extent permitted by law, FitnessPro shall not be liable
        for any indirect, incidental, special, consequential, or punitive
        damages arising out of or in connection with your use of the Service,
        even if we have been advised of the possibility of such damages.
      </p>

      <h2 className="text-xl font-semibold mb-2">8. Indemnification</h2>
      <p className="mb-4">
        You agree to indemnify and hold harmless FitnessPro, its affiliates, and
        their respective officers, directors, employees, and agents from and
        against any claims, liabilities, damages, losses, and expenses arising
        out of or in connection with your use of the Service or your breach of
        these Terms.
      </p>

      <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
      <p className="mb-4">
        We may terminate or suspend your access to the Service immediately,
        without prior notice, for any reason, including if we believe that you
        have violated these Terms.
      </p>

      <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
      <p className="mb-4">
        These Terms shall be governed by and construed in accordance with the
        laws of New York, without regard to its conflict of law principles.
      </p>

      <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms, please contact us at:
      </p>
      <p className="mb-4">
        FitnessPro
        <br />
        +1-111-111-1111
        <br />
        FitnessPro@nutrition.com
      </p>
    </div>
  );
};

export default TermsAndConditions;
