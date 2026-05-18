import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toastApiError, toastSuccess } from "../../../utils/toast";

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [loadedRow, setLoadedRow] = useState(null);

  const watchedDistrict = watch("district");

  useEffect(() => {
    axios.get("/district.json").then((res) => {
      setDistricts(res.data.districts || []);
    });
    axios.get("/upazila.json").then((res) => {
      setAllUpazilas(res.data.upazilas || []);
    });
  }, []);

  useEffect(() => {
    if (!watchedDistrict || !districts.length) return;
    const districtData = districts.find((d) => d.name === watchedDistrict);
    setDistrictId(districtData?.id ? String(districtData.id) : "");
  }, [watchedDistrict, districts]);

  useEffect(() => {
    if (!loadedRow || !districts.length) return;
    const dRow = districts.find((d) => d.name === loadedRow.district);
    setDistrictId(dRow?.id ? String(dRow.id) : "");
  }, [loadedRow, districts]);

  const upazilaOptions = useMemo(() => {
    if (!districtId) return [];
    return allUpazilas.filter(
      (u) => String(u.district_id) === String(districtId)
    );
  }, [allUpazilas, districtId]);

  useEffect(() => {
    if (!id || !user?.email) return;
    if (role === "volunteer") {
      setLoading(false);
      return;
    }
    setLoading(true);
    axiosSecure
      .get(`/donation-requests/${id}`)
      .then((res) => {
        const r = res.data;
        const allowed = r.requesterEmail === user.email || role === "admin";
        if (!allowed) {
          setForbidden(true);
          return;
        }
        setLoadedRow(r);
        reset({
          recipientName: r.recipientName || "",
          hospitalName: r.hospitalName || "",
          district: r.district || "",
          upazila: r.upazila || "",
          address: r.address || "",
          bloodGroup: r.bloodGroup || "",
          donationDate: r.donationDate || "",
          donationTime: r.donationTime || "",
          message: r.message || "",
        });
      })
      .catch(() => setForbidden(true))
      .finally(() => setLoading(false));
  }, [axiosSecure, id, user?.email, role, reset]);

  const onSubmit = (data) => {
    axiosSecure
      .patch(`/donation-requests/${id}`, data)
      .then((res) => {
        if (res.data?.modifiedCount >= 0) {
          toastSuccess("Donation request updated.");
          navigate("/dashboard/my-donation-requests");
        }
      })
      .catch((err) => {
        console.error(err);
        toastApiError(err, "Update failed");
      });
  };

  if (role === "volunteer") {
    return (
      <div className="max-w-xl mx-auto rounded-xl border border-base-300 bg-base-100 p-6">
        <p className="text-base-content/80">
          Volunteers cannot edit donation request details. You may update
          status only from the all requests list.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="max-w-xl mx-auto rounded-xl border border-base-300 bg-base-100 p-6">
        <p className="text-base-content/80">
          You cannot edit this request. Only the request owner or an admin may
          update it.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Edit donation request</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Requester name</label>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input bg-gray-100 w-full"
            />
          </div>
          <div>
            <label className="label">Requester email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input bg-gray-100 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Recipient name</label>
            <input
              {...register("recipientName", { required: true })}
              className="input w-full"
              placeholder="Recipient name"
            />
          </div>
          <div>
            <label className="label">Hospital name</label>
            <input
              {...register("hospitalName", { required: true })}
              className="input w-full"
              placeholder="Hospital name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Recipient district</label>
            <select
              {...register("district", {
                required: true,
                onChange: (e) => {
                  const districtName = e.target.value;
                  const districtData = districts.find(
                    (d) => d.name === districtName
                  );
                  setDistrictId(
                    districtData?.id ? String(districtData.id) : ""
                  );
                  setValue("upazila", "");
                },
              })}
              className="select select-bordered w-full"
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Recipient upazila</label>
            <select
              {...register("upazila", { required: true })}
              className="select select-bordered w-full"
              disabled={!districtId}
            >
              <option value="">
                {districtId ? "Select upazila" : "Select district first"}
              </option>
              {upazilaOptions.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Full address</label>
          <input
            {...register("address", { required: true })}
            className="input w-full"
            placeholder="Address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Blood group</label>
            <select
              {...register("bloodGroup", { required: true })}
              className="select w-full"
            >
              <option value="">Select blood group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Donation date</label>
            <input
              type="date"
              {...register("donationDate", { required: true })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="label">Donation time</label>
            <input
              type="time"
              {...register("donationTime", { required: true })}
              className="input w-full"
            />
          </div>
        </div>

        <div>
          <label className="label">Request message</label>
          <textarea
            {...register("message", { required: true })}
            className="textarea h-28 w-full"
            placeholder="Explain why blood is needed..."
          />
        </div>

        <div className="text-right">
          <button type="submit" className="btn btn-primary px-8">
            Update donation request
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonationRequest;
