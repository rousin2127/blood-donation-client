import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hook/useAuth";
import axios from "axios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toastApiError, toastSuccess } from "../../../utils/toast";

const AddRequest = () => {
  const { user } = useAuth();

  const { register, handleSubmit, watch, setValue } = useForm();

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [districtId, setDistrictId] = useState("");

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axios.get("/district.json")
      .then((res) => {
        setDistricts(res.data.districts || []);
      });

    axios.get("/upazila.json")
      .then((res) => {
        setAllUpazilas(res.data.upazilas || []);
      });
  }, []);

  // filtered upazila
  const upazilaOptions = useMemo(() => {
    if (!districtId) return [];

    return allUpazilas.filter(
      (u) => String(u.district_id) === String(districtId)
    );
  }, [allUpazilas, districtId]);

  const onSubmit = (data) => {
    const requestData = {
      ...data,
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      status: "pending",
    };

    console.log(requestData);

    axiosSecure.post("/requests", requestData)
      .then(() => {
        toastSuccess("Donation request created successfully.");
      })
      .catch((error) => {
        console.log(error);
        toastApiError(error, "Failed to create request");
      });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow p-4 sm:p-6">

      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Create Donation Request
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* Requester Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="label">
              Requester Name
            </label>

            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input bg-gray-100"
            />
          </div>

          <div>
            <label className="label">
              Requester Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input bg-gray-100"
            />
          </div>

        </div>

        {/* Recipient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="label">
              Recipient Name
            </label>

            <input
              {...register("recipientName", { required: true })}
              className="input"
              placeholder="Recipient Name"
            />
          </div>

          <div>
            <label className="label">
              Hospital Name
            </label>

            <input
              {...register("hospitalName", { required: true })}
              className="input"
              placeholder="Hospital Name"
            />
          </div>

        </div>

        {/* District + Upazila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* District */}
          <div>
            <label className="label">
              Recipient District
            </label>

            <select
              {...register("district", {
                required: true,

                onChange: (e) => {
                  const districtName = e.target.value;

                  const districtData = districts.find(
                    (d) => d.name === districtName
                  );

                  setDistrictId(
                    districtData?.id
                      ? String(districtData.id)
                      : ""
                  );

                  // reset upazila
                  setValue("upazila", "");
                },
              })}
              className="select select-bordered w-full"
            >
              <option value="">
                Select District
              </option>

              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="label">
              Recipient Upazila
            </label>

            <select
              {...register("upazila", { required: true })}
              className="select select-bordered w-full"
              disabled={!districtId}
            >
              <option value="">
                {districtId
                  ? "Select Upazila"
                  : "Select district first"}
              </option>

              {upazilaOptions.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Address */}
        <div>
          <label className="label">
            Full Address
          </label>

          <input
            {...register("address", { required: true })}
            className="input"
            placeholder="Zahir Raihan Rd, Dhaka"
          />
        </div>

        {/* Blood + Date + Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="label">
              Blood Group
            </label>

            <select
              {...register("bloodGroup", { required: true })}
              className="select"
            >
              <option value="">
                Select Blood Group
              </option>

              {[
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
              ].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              Donation Date
            </label>

            <input
              type="date"
              {...register("donationDate", {
                required: true,
              })}
              className="input"
            />
          </div>

          <div>
            <label className="label">
              Donation Time
            </label>

            <input
              type="time"
              {...register("donationTime", {
                required: true,
              })}
              className="input"
            />
          </div>

        </div>

        {/* Message */}
        <div>
          <label className="label">
            Request Message
          </label>

          <textarea
            {...register("message", { required: true })}
            className="textarea h-28"
            placeholder="Explain why blood is needed..."
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button className="btn btn-primary px-8">
            Request
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddRequest;