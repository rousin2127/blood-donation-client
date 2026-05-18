import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { toastSuccess, toastWarning } from "../../utils/toast";

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = pk ? loadStripe(pk) : null;

function InnerPayForm({ onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setMsg("");
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (error) throw error;
      if (paymentIntent?.status === "succeeded") {
        await axiosSecure.post("/funding/confirm", {
          paymentIntentId: paymentIntent.id,
        });
        onSuccess();
      } else {
        setMsg(`Payment status: ${paymentIntent?.status || "unknown"}`);
      }
    } catch (err) {
      setMsg(err?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {msg && <p className="text-sm text-error">{msg}</p>}
      <div className="flex flex-wrap gap-2 justify-end">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!stripe || busy}>
          {busy ? "Processing…" : "Pay now"}
        </button>
      </div>
    </form>
  );
}

function StripeCheckout({ amountUsd, onDone, onCancel }) {
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    setClientSecret("");
    setErr("");
    axiosSecure
      .post("/funding/create-payment-intent", { amount: amountUsd })
      .then((res) => {
        if (!cancelled) setClientSecret(res.data.clientSecret);
      })
      .catch((e) => {
        if (!cancelled) setErr(e.response?.data?.message || "Could not start payment");
      });
    return () => {
      cancelled = true;
    };
  }, [amountUsd, axiosSecure]);

  if (err) {
    return (
      <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
        {err}
      </div>
    );
  }
  if (!clientSecret) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe", variables: { colorPrimary: "#b91c1c" } },
      }}
    >
      <InnerPayForm onSuccess={onDone} onCancel={onCancel} />
    </Elements>
  );
}

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [funds, setFunds] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("25");
  const [showPay, setShowPay] = useState(false);

  const loadFunds = useCallback(() => {
    setLoading(true);
    axiosSecure
      .get("/funding")
      .then((res) => {
        setFunds(res.data.funds || []);
        setTotalAmount(res.data.totalAmount ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  if (!pk || !stripePromise) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="alert alert-warning">
          Add <code className="mx-1">VITE_STRIPE_PUBLISHABLE_KEY</code> to your client{" "}
          <code className="mx-1">.env</code> and <code className="mx-1">STRIPE_SECRET_KEY</code>{" "}
          to the server <code className="mx-1">.env</code>, then restart.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Funding</h1>
        <p className="text-base-content/70 mt-1">
          Support the organization. All contributions are listed below.
        </p>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm text-base-content/60">Total raised</p>
            <p className="text-3xl font-bold text-primary">
              ${Number(totalAmount || 0).toFixed(2)}
            </p>
          </div>
          {!showPay ? (
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
              <div>
                <label className="label">
                  <span className="label-text">Amount (USD)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="input input-bordered w-full sm:w-40"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const n = Number(amount);
                  if (!Number.isFinite(n) || n < 1 || n > 5000) {
                    toastWarning("Enter an amount between 1 and 5000 USD.");
                    return;
                  }
                  setShowPay(true);
                }}
              >
                Give fund
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-2">
              <p className="text-sm font-medium">Paying ${Number(amount).toFixed(2)} USD</p>
              <StripeCheckout
                amountUsd={Number(amount)}
                onDone={() => {
                  setShowPay(false);
                  loadFunds();
                  toastSuccess("Thank you! Your fund was recorded.");
                }}
                onCancel={() => setShowPay(false)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">All funds</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : funds.length === 0 ? (
          <p className="text-base-content/60">No funds yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="table table-zebra table-sm sm:table-md min-w-[320px]">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f, i) => (
                  <tr key={f._id || f.paymentIntentId}>
                    <td>{i + 1}</td>
                    <td>{f.donorName || f.donorEmail}</td>
                    <td>${Number(f.amount).toFixed(2)}</td>
                    <td>
                      {f.createdAt
                        ? new Date(f.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Funding;
