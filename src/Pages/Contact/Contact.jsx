import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../../Hooks/useAxios";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toastApiError, toastSuccess } from "../../utils/toast";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const axiosPublic = useAxios();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosPublic.post("/contacts", data);
      toastSuccess("Your message was sent. We will respond within 2 business days.");
      reset();
    } catch (err) {
      toastApiError(err, "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1>Contact BloodCare</h1>
        <p className="text-base-content/70 mt-2">
          Questions about donation requests, volunteer registration, or technical support?
          Send us a message and our team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">Reach us</h2>
          <p className="flex items-start gap-3 text-sm">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            <span>House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh</span>
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Phone className="w-5 h-5 text-primary shrink-0" />
            <a href="tel:+8801712345678" className="hover:text-primary">+880 1712-345678</a>
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <a href="mailto:support@bloodcare.bd" className="hover:text-primary">support@bloodcare.bd</a>
          </p>
          <p className="text-xs text-base-content/60 pt-2">
            Support hours: Saturday–Thursday, 9:00 AM – 6:00 PM (BST)
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full name"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
                error={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                })}
                error={errors.email?.message}
              />
            </div>
            <Input
              label="Subject"
              {...register("subject", { required: "Subject is required", minLength: { value: 3, message: "Min 3 characters" } })}
              error={errors.subject?.message}
            />
            <label className="form-control w-full gap-1">
              <span className="label-text font-medium">Message</span>
              <textarea
                className={`textarea textarea-bordered rounded-xl min-h-32 w-full ${errors.message ? "textarea-error" : ""}`}
                {...register("message", {
                  required: "Message is required",
                  minLength: { value: 10, message: "Min 10 characters" },
                })}
              />
              {errors.message && <span className="text-error text-xs">{errors.message.message}</span>}
            </label>
            <Button type="submit" loading={submitting} className="w-full sm:w-auto">
              Send message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
