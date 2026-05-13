import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    photoURL: "",
    district: "",
    upazila: "",
    blood: "",
  });

  useEffect(() => {
    axiosSecure.get("/profile")
      .then(res => {
        setUser(res.data);
        setForm({
          displayName: res.data?.displayName || res.data?.name || "",
          photoURL: res.data?.photoURL || "",
          district: res.data?.district || "",
          upazila: res.data?.upazila || "",
          blood: res.data?.blood || "",
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await axiosSecure.patch("/profile", form);
      if (res.data?.modifiedCount > 0) {
        const refreshed = await axiosSecure.get("/profile");
        setUser(refreshed.data);
      }
      setEditing(false);
      alert("Profile updated.");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
        {!editing ? (
          <button className="btn btn-outline" onClick={() => setEditing(true)}>
            Edit
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Profile Image */}
        <div className="flex-shrink-0 text-center">
          <img
            src={form.photoURL || user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="profile"
            className="w-32 h-32 rounded-full mx-auto border"
          />
          {editing && (
            <div className="mt-3">
              <input
                className="input input-bordered w-full"
                placeholder="Photo URL"
                value={form.photoURL}
                onChange={(e) => setForm((p) => ({ ...p, photoURL: e.target.value }))}
              />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            {!editing ? (
              <p className="font-medium text-gray-800">{user?.displayName || user?.name}</p>
            ) : (
              <input
                className="input input-bordered w-full"
                value={form.displayName}
                onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              />
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user?.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">District</p>
              {!editing ? (
                <p className="font-medium">{user?.district || "Not set"}</p>
              ) : (
                <input
                  className="input input-bordered w-full"
                  value={form.district}
                  onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                />
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Upazila</p>
              {!editing ? (
                <p className="font-medium">{user?.upazila || "Not set"}</p>
              ) : (
                <input
                  className="input input-bordered w-full"
                  value={form.upazila}
                  onChange={(e) => setForm((p) => ({ ...p, upazila: e.target.value }))}
                />
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              {!editing ? (
                <p className="font-medium">{user?.blood || "Not set"}</p>
              ) : (
                <select
                  className="select select-bordered w-full"
                  value={form.blood}
                  onChange={(e) => setForm((p) => ({ ...p, blood: e.target.value }))}
                >
                  <option value="">Select</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
