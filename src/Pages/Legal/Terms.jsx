import React from "react";
import Card from "../../components/ui/Card";

const Terms = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <h1>Terms & conditions</h1>
    <Card className="space-y-4 text-base-content/80 text-sm leading-relaxed">
      <p><strong>Last updated:</strong> June 2026</p>
      <p>By using BloodCare you agree to provide accurate registration and request information. Misrepresenting blood group, location, or medical urgency may result in account suspension.</p>
      <p>BloodCare coordinates connections between donors and requesters but does not perform medical screening. Donors must meet hospital and national blood donation eligibility requirements.</p>
      <p>Funding payments processed through Stripe are voluntary contributions to platform operations and are non-refundable except where required by payment provider policies.</p>
      <p>Administrators and volunteers may update request status to maintain platform integrity. Users must not harass others or publish fraudulent requests.</p>
      <p>These terms are governed by the laws of Bangladesh. Contact support@bloodcare.bd for disputes or questions.</p>
    </Card>
  </div>
);

export default Terms;
