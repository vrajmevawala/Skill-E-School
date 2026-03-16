import React from "react";

const TermsOfService = () => {
  return (
    <div className="container py-16 max-w-4xl prose prose-slate">
      <h1 className="text-4xl font-bold mb-8 font-sans">Terms of Service</h1>
      <p className="text-muted-foreground mb-6 font-medium">Last Updated: March 12, 2026</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Skill E-School, you agree to comply with and be bound by these Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Use of Services</h2>
        <p>
          Our services are for educational and professional development purposes. You agree not to use the platform for any illegal or unauthorized activities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
        <p>
          All content provided on Skill E-School is the property of Skill E-School or its content suppliers and is protected by copyright laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account if you violate these terms or engage in behavior that harms the platform or its users.
        </p>
      </section>

      <section className="mb-8 font-medium">
        <p>
          Please reach out to legal@skill-eschool.com if you have any questions regarding these Terms of Service.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
