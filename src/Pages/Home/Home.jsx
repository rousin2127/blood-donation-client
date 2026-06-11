import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import useAxios from "../../Hooks/useAxios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import DonationRequestCard from "../../components/ui/DonationRequestCard";
import { CardSkeleton } from "../../components/ui/Card";
import { Droplets, HeartHandshake, MapPin, ShieldCheck } from "lucide-react";

const heroSlides = [
  {
    title: "Every donation saves a life",
    subtitle: "Connect with patients who need your blood group today.",
    cta: "Find requests",
    to: "/explore",
  },
  {
    title: "Search donors by location",
    subtitle: "Filter registered donors across all 64 districts of Bangladesh.",
    cta: "Search donors",
    to: "/search",
  },
  {
    title: "Track requests end to end",
    subtitle: "From pending to completed — volunteers help keep the process transparent.",
    cta: "Create account",
    to: "/register",
  },
];

const steps = [
  { n: "1", title: "Register", text: "Sign up with your blood group, district, and upazila." },
  { n: "2", title: "Browse or publish", text: "Explore open requests or create one for a patient." },
  { n: "3", title: "Match & donate", text: "Donors confirm; status moves to in progress." },
  { n: "4", title: "Complete", text: "Mark done after hospital donation or cancel if resolved." },
];

const testimonials = [
  {
    name: "Fatima Rahman",
    role: "Requester, Chattogram",
    quote: "We found an O-negative donor within hours for my father’s surgery. The district filter made all the difference.",
  },
  {
    name: "Karim Hossain",
    role: "Registered donor, Dhaka",
    quote: "I get notified of nearby pending requests. BloodCare keeps the process organized without endless phone calls.",
  },
  {
    name: "Dr. Nusrat Ahmed",
    role: "Volunteer coordinator",
    quote: "Status tracking helps us verify that requests are genuine and donors are matched responsibly.",
  },
];

const partners = [
  { name: "Bangladesh Red Crescent Society", url: "https://bdrcs.org/" },
  { name: "Directorate General of Health Services", url: "https://dghs.gov.bd/" },
  { name: "WHO Blood Safety", url: "https://www.who.int/health-topics/blood-safety" },
];

const Home = () => {
  const axiosPublic = useAxios();
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    axiosPublic.get("/home-stats").then((r) => setStats(r.data)).catch(console.error);
    axiosPublic
      .get("/explore/donation-requests?status=pending&size=4&page=0")
      .then((r) => setFeatured(r.data.items || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, [axiosPublic]);

  return (
    <div className="space-y-16 sm:space-y-20 -mt-2">
      {/* Hero — max ~65vh */}
      <section className="relative rounded-2xl overflow-hidden border border-base-300 min-h-[55vh] max-h-[70vh]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-full min-h-[55vh] max-h-[70vh]"
        >
          {heroSlides.map((s) => (
            <SwiperSlide key={s.title}>
              <div className="h-full min-h-[55vh] max-h-[70vh] bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80 flex items-center">
                <div className="px-6 sm:px-12 py-12 max-w-2xl text-primary-content">
                  <h1 className="text-primary-content text-3xl sm:text-5xl leading-tight">{s.title}</h1>
                  <p className="mt-4 text-lg text-primary-content/90">{s.subtitle}</p>
                  <Link to={s.to} className="inline-block mt-8">
                    <Button variant="secondary" size="lg">{s.cta}</Button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Dynamic statistics */}
      {stats && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Registered donors", value: stats.totalDonors },
            { label: "Open requests", value: stats.pendingRequests },
            { label: "Completed donations", value: stats.completedDonations },
            { label: "Funds raised (USD)", value: `$${Number(stats.totalFundsRaised || 0).toFixed(0)}` },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-base-content/70 mt-1">{s.label}</p>
            </Card>
          ))}
        </section>
      )}

      {/* How it works */}
      <section>
        <h2 className="text-center mb-8">How BloodCare works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => (
            <Card key={s.n} className="text-center">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-primary text-primary-content font-bold">{s.n}</span>
              <h3 className="mt-3">{s.title}</h3>
              <p className="text-sm text-base-content/70 mt-2">{s.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-center mb-8">Why donors and families choose us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, title: "Location search", text: "District and upazila filters across Bangladesh." },
            { icon: Droplets, title: "All blood groups", text: "A+, A-, B+, B-, AB+, AB-, O+, O- supported." },
            { icon: ShieldCheck, title: "Verified users", text: "Firebase authentication and blocked-account protection." },
            { icon: HeartHandshake, title: "Volunteer support", text: "Coordinators monitor status and assist families." },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg">{title}</h3>
              <p className="text-sm text-base-content/70 mt-2">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured requests — backend data */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2>Urgent open requests</h2>
            <p className="text-base-content/70 text-sm mt-1">Live pending requests from our database</p>
          </div>
          <Link to="/explore"><Button variant="outline" size="sm">View all</Button></Link>
        </div>
        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : featured.length === 0 ? (
          <Card><p className="text-base-content/70">No pending requests right now. Check back soon or create one from your dashboard.</p></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((r) => <DonationRequestCard key={r._id} request={r} />)}
          </div>
        )}
      </section>

      {/* Blood group breakdown from API */}
      {stats?.bloodBreakdown?.length > 0 && (
        <section>
          <h2 className="mb-6">Pending requests by blood group</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {stats.bloodBreakdown.map((b) => (
              <Card key={b._id} padding="p-3" className="text-center">
                <p className="font-bold text-primary">{b._id}</p>
                <p className="text-2xl font-semibold">{b.count}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section>
        <h2 className="text-center mb-8">Stories from our community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <Card key={t.name}>
              <p className="text-sm italic text-base-content/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-base-content/60">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-center mb-6">Frequently asked questions</h2>
        <div className="max-w-2xl mx-auto space-y-2">
          {[
            { q: "Is donating through BloodCare free?", a: "Yes. Registration and responding to requests are free. Optional funding supports platform costs." },
            { q: "Who can see my contact details?", a: "Donor name appears on in-progress requests. Email addresses are never shown on public pages." },
            { q: "How fast do donors respond?", a: "Response time varies by location and blood group rarity. Urban areas typically see faster matches." },
          ].map((f) => (
            <div key={f.q} className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl">
              <input type="radio" name="faq" />
              <div className="collapse-title font-medium">{f.q}</div>
              <div className="collapse-content text-sm text-base-content/75">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="text-center">
        <h2 className="mb-6">Resources & partners</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {partners.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm rounded-xl">
              {p.name}
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary text-primary-content p-8 sm:p-12 text-center">
        <h2 className="text-primary-content">Ready to make a difference?</h2>
        <p className="mt-3 text-primary-content/90 max-w-xl mx-auto">
          Join thousands of registered donors helping patients across Bangladesh.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/register"><Button variant="secondary" size="lg">Register as donor</Button></Link>
          <Link to="/contact"><Button variant="outline" size="lg" className="border-primary-content text-primary-content hover:bg-primary-content/10">Contact us</Button></Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
