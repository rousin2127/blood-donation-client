import React from "react";
import { Link } from "react-router";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Heart, Shield, Users, Zap } from "lucide-react";

const About = () => (
  <div className="space-y-10 max-w-4xl mx-auto">
    <div>
      <h1>About BloodCare</h1>
      <p className="text-base-content/70 mt-3 leading-relaxed">
        BloodCare is a Bangladesh-focused blood donation coordination platform. We help patients
        and families publish verified requests, connect with registered donors by location and
        blood group, and track each request from pending through completion with volunteer oversight.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { icon: Heart, title: "Patient-first", text: "Every request includes hospital, location, and urgency details donors need to respond quickly." },
        { icon: Shield, title: "Verified accounts", text: "Donors register with email authentication. Blocked accounts cannot create or fulfill requests." },
        { icon: Users, title: "Volunteer network", text: "Trained volunteers monitor request status and support donors through the donation process." },
        { icon: Zap, title: "Real-time status", text: "Requests move from pending → in progress → done or canceled with full audit visibility." },
      ].map(({ icon: Icon, title, text }) => (
        <Card key={title}>
          <Icon className="w-8 h-8 text-primary mb-3" />
          <h3>{title}</h3>
          <p className="text-sm text-base-content/70 mt-2">{text}</p>
        </Card>
      ))}
    </div>

    <Card>
      <h2>Our mission</h2>
      <p className="text-base-content/80 mt-3 leading-relaxed">
        Bangladesh faces recurring blood shortages, especially for rare groups and during emergencies.
        BloodCare reduces search time by matching donors geographically, publishing open requests
        publicly, and funding platform operations through transparent community contributions.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/register"><Button>Become a donor</Button></Link>
        <Link to="/explore"><Button variant="outline">Browse requests</Button></Link>
      </div>
    </Card>
  </div>
);

export default About;
