import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hook/useAuth";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const VolunteerRegister = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [allUpazilas, setAllUpazilas] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");

  const upazilaOptions = useMemo(() => {
    if (!districtId) return [];
    return allUpazilas.filter(
      (u) => String(u.district_id) === String(districtId)
    );
  }, [allUpazilas, districtId]);

  useEffect(() => {
    axios.get("/upazila.json").then((res) => {
      setAllUpazilas(res.data.upazilas || []);
    });
    axios.get("/district.json").then((res) => {
      setDistricts(res.data.districts || []);
    });
  }, []);

  const handleVolunteerRegister = async (data) => {
    try {
      // 1. Firebase register
      const result = await registerUser(data.email, data.password);

      // 2. Upload image
      const formData = new FormData();
      formData.append("image", data.photo[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_url}`,
        formData
      );

      const photoURL = imgRes.data.data.url;

      // 3. Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      // 4. Save to backend with role = volunteer
      const volunteerInfo = {
        name: data.name,
        email: data.email,
        photoURL,
        blood: data.blood,
        district: data.district,
        upazila: data.upazila,
        role: "volunteer",
        status: "active",
        createAt: new Date(),
      };

      await axios.post("http://localhost:5000/users", volunteerInfo);

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shadow-2xl">
      <h3 className="text-3xl text-center mt-4">Volunteer Registration</h3>
      <p className="text-center">Register as a Volunteer</p>

      <form className="card-body" onSubmit={handleSubmit(handleVolunteerRegister)}>
        {/* Name */}
        <label className="label">Name</label>
        <input
          {...register("name", { required: true })}
          className="input"
          placeholder="Your Name"
        />

        {/* Email */}
        <label className="label">Email</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="input"
          placeholder="Email"
        />
        {errors.email && <span className="text-red-500">Email is required</span>}

        {/* Photo */}
        <label className="label">Photo</label>
        <input
          type="file"
          {...register("photo", { required: true })}
          className="input"
        />

        <label className="label">Blood Group</label>
        <select {...register("blood", { required: true })} className="select">
          <option value="">Choose Blood Group</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <label className="label">District</label>
        <select
          {...register("district", {
            required: true,
            onChange: (e) => {
              const name = e.target.value;
              const d = districts.find((x) => x.name === name);
              setDistrictId(d?.id ? String(d.id) : "");
              setValue("upazila", "");
            },
          })}
          className="select"
        >
          <option value="">Select Your District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <label className="label">Upazila</label>
        <select
          {...register("upazila", { required: true })}
          className="select"
          disabled={!districtId}
        >
          <option value="">
            {districtId ? "Select Your Upazila" : "Select district first"}
          </option>
          {upazilaOptions.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Password */}
        <label className="label">Password</label>
        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
          })}
          className="input"
          placeholder="Password"
        />
        {errors.password && (
          <span className="text-red-500">
            Password must be strong
          </span>
        )}

        <button className="btn btn-primary mt-4">Register as Volunteer</button>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link className="text-blue-500" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default VolunteerRegister;
