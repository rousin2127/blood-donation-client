import React from "react";
import { Link } from "react-router";
import Card from "../../components/ui/Card";

const faqs = [
  {
    q: "Who can register on BloodCare?",
    a: "Anyone aged 18+ in Bangladesh with a valid email can register as a donor. Administrators can promote trusted donors to volunteer roles.",
  },
  {
    q: "How do I respond to a blood request?",
    a: "Browse Explore or Donation Requests, open a pending request, and click Donate while logged in. Your name is attached when the status becomes in progress.",
  },
  {
    q: "Can I edit or cancel my request?",
    a: "Yes. From Dashboard → My requests you can edit details, mark a match as done or canceled, or delete the request with confirmation.",
  },
  {
    q: "How is funding used?",
    a: "Community funding supports server hosting, SMS notifications, and volunteer coordination. All contributions are listed on the Funding page.",
  },
  {
    q: "I forgot my password. What should I do?",
    a: "Use Firebase password reset from the login page (contact support@bloodcare.bd if you need manual assistance).",
  },
];

const Help = () => (
  <div className="space-y-8 max-w-3xl mx-auto">
    <div>
      <h1>Help & support</h1>
      <p className="text-base-content/70 mt-2">
        Answers to common questions. Need more help?{" "}
        <Link to="/contact" className="link link-primary">Contact our team</Link>.
      </p>
    </div>
    <div className="space-y-3">
      {faqs.map((f) => (
        <Card key={f.q} padding="p-4 sm:p-5">
          <h3 className="text-base">{f.q}</h3>
          <p className="text-sm text-base-content/75 mt-2 leading-relaxed">{f.a}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default Help;
