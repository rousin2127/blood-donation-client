import React from "react";
import Card from "../../components/ui/Card";

const Privacy = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <h1>Privacy policy</h1>
    <Card className="prose prose-sm max-w-none text-base-content/80 space-y-4">
      <p><strong>Last updated:</strong> June 2026</p>
      <p>BloodCare collects your name, email, blood group, district, upazila, and profile photo when you register. Donation requests store recipient and hospital details you provide.</p>
      <p>We use Firebase Authentication for secure sign-in. API requests use encrypted HTTPS and short-lived ID tokens. We do not sell personal data to third parties.</p>
      <p>Contact form messages are stored in our database for support follow-up. Administrators can view messages to respond to inquiries.</p>
      <p>You may request profile updates or account deletion by emailing support@bloodcare.bd. Blocked accounts retain records for abuse prevention as required by law.</p>
    </Card>
  </div>
);

export default Privacy;
