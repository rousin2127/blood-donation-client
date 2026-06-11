import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAxios from "../../Hooks/useAxios";
import DonationRequestCard from "../../components/ui/DonationRequestCard";
import { CardSkeleton } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const BLOOD_GROUPS = ["all", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const SORT_OPTIONS = [
  { value: "createAt-desc", sortBy: "createAt", order: "desc", label: "Newest first" },
  { value: "createAt-asc", sortBy: "createAt", order: "asc", label: "Oldest first" },
  { value: "donationDate-asc", sortBy: "donationDate", order: "asc", label: "Donation date (soonest)" },
  { value: "recipientName-asc", sortBy: "recipientName", order: "asc", label: "Recipient name (A–Z)" },
];

const Explore = () => {
  const axiosPublic = useAxios();
  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [filters, setFilters] = useState({
    bloodGroup: "all",
    district: "all",
    upazila: "all",
    status: "pending",
    sort: "createAt-desc",
    page: 0,
  });
  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/district.json").then((r) => setDistricts(r.data.districts || []));
    axios.get("/upazila.json").then((r) => setAllUpazilas(r.data.upazilas || []));
  }, []);

  const upazilaOptions = useMemo(() => {
    if (!districtId) return [];
    return allUpazilas.filter((u) => String(u.district_id) === String(districtId));
  }, [allUpazilas, districtId]);

  const sortConfig = SORT_OPTIONS.find((s) => s.value === filters.sort) || SORT_OPTIONS[0];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      bloodGroup: filters.bloodGroup,
      district: filters.district,
      upazila: filters.upazila,
      status: filters.status,
      sortBy: sortConfig.sortBy,
      order: sortConfig.order,
      page: String(filters.page),
      size: "12",
    });
    axiosPublic
      .get(`/explore/donation-requests?${params}`)
      .then((res) => setData(res.data))
      .catch(() => setData({ items: [], total: 0, totalPages: 0 }))
      .finally(() => setLoading(false));
  }, [axiosPublic, filters, sortConfig]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return data.items || [];
    const q = search.toLowerCase();
    return (data.items || []).filter(
      (r) =>
        r.recipientName?.toLowerCase().includes(q) ||
        r.hospitalName?.toLowerCase().includes(q) ||
        r.district?.toLowerCase().includes(q)
    );
  }, [data.items, search]);

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 0 }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Explore blood requests</h1>
        <p className="text-base-content/70 mt-2 max-w-2xl">
          Search and filter open donation requests by blood group, district, and upazila.
          All data is loaded from our live database.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/60">Filters</h2>
            <label className="form-control">
              <span className="label-text">Blood group</span>
              <select
                className="select select-bordered rounded-xl w-full"
                value={filters.bloodGroup}
                onChange={(e) => setFilter("bloodGroup", e.target.value)}
              >
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>{b === "all" ? "All groups" : b}</option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text">District</span>
              <select
                className="select select-bordered rounded-xl w-full"
                value={filters.district}
                onChange={(e) => {
                  const name = e.target.value;
                  const d = districts.find((x) => x.name === name);
                  setDistrictId(d?.id ? String(d.id) : "");
                  setFilters((f) => ({ ...f, district: name || "all", upazila: "all", page: 0 }));
                }}
              >
                <option value="all">All districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text">Upazila</span>
              <select
                className="select select-bordered rounded-xl w-full"
                value={filters.upazila}
                disabled={filters.district === "all"}
                onChange={(e) => setFilter("upazila", e.target.value)}
              >
                <option value="all">All upazilas</option>
                {upazilaOptions.map((u) => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text">Status</span>
              <select
                className="select select-bordered rounded-xl w-full"
                value={filters.status}
                onChange={(e) => setFilter("status", e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In progress</option>
                <option value="done">Completed</option>
                <option value="all">All statuses</option>
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <label className="form-control">
              <span className="label-text font-semibold">Sort by</span>
              <select
                className="select select-bordered rounded-xl w-full"
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-4">
          <input
            type="search"
            placeholder="Search by recipient, hospital, or district…"
            className="input input-bordered w-full rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center text-base-content/70">
              No requests match your filters. Try broadening your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map((r) => (
                <DonationRequestCard key={r._id} request={r} />
              ))}
            </div>
          )}

          {!loading && data.totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page <= 0}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {filters.page + 1} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= data.totalPages - 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
