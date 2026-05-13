import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAxios from "../../Hooks/useAxios";

const Search = () => {
  const axiosPublic = useAxios();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazila, setUpazila] = useState("");

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("/district.json").then((res) => setDistricts(res.data?.districts || []));
    axios.get("/upazila.json").then((res) => setUpazilas(res.data?.upazilas || []));
  }, []);

  const upazilaOptions = useMemo(() => {
    if (!districtId) return [];
    return upazilas.filter(
      (u) => String(u.district_id) === String(districtId)
    );
  }, [upazilas, districtId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);
    try {
      // This endpoint can be implemented later; for now fallback to client-side filter if you already have users locally.
      const res = await axiosPublic.get("/donors", {
        params: { bloodGroup, district, upazila },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Search Donors</h1>
        <p className="text-gray-600">Filter by blood group and location to find donors.</p>
      </div>

      <form onSubmit={handleSearch} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Blood group</span>
            </label>
            <select className="select select-bordered w-full" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
              <option value="">Select</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text">District</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={district}
              onChange={(e) => {
                const name = e.target.value;
                setDistrict(name);
                const d = districts.find((x) => x.name === name);
                setDistrictId(d?.id ? String(d.id) : "");
                setUpazila("");
              }}
              required
            >
              <option value="">Select</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Upazila</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              required
              disabled={!districtId}
            >
              <option value="">Select</option>
              {upazilaOptions.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="btn btn-error text-white w-full" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Results</h2>

        {!searched && (
          <p className="text-gray-600">Fill the form and click search to see donors.</p>
        )}

        {searched && !loading && results.length === 0 && (
          <p className="text-gray-600">No donors found for your search.</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((d) => (
              <div key={d._id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={d.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    alt="donor"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{d.displayName || d.name}</p>
                    <p className="text-sm text-gray-600">{d.district}, {d.upazila}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="badge badge-outline border-red-300 text-red-600">{d.blood}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p><span className="text-gray-500">Email:</span> {d.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
