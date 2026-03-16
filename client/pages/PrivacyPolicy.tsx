import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container py-16 max-w-4xl prose prose-slate">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">Last Updated: March 12, 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p>
          We collect personal information such as your name, email address, and payment details when you create an account, enroll in courses, or contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>
          Your information is used to provide our services, process transactions, communicate with you, and improve our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
        <p>
          We do not sell your personal information. We may share data with service providers who assist us in operating our platform and providing services to you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information. Please contact us for any privacy-related requests.
        </p>
      </section>

      <section className="mb-8 font-medium">
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@skill-eschool.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
