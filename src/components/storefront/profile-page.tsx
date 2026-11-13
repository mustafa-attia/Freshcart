"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ApiError, apiRequest, unwrapApiData } from "@/lib/api";
import { useStore } from "./store-provider";
import { Notice, StorePage, formButtonClass } from "./store-components";
import type { StoreUser } from "@/types/catalog";

type ProfileValues = {
  name: string;
  email: string;
  phone: string;
};

type Address = {
  id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
};

function object(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : null;
}

function addressFrom(value: unknown): Address | null {
  const raw = object(value);
  const id = raw?._id ?? raw?.id;
  if (!raw || typeof id !== "string") return null;
  return {
    id,
    name: typeof raw.name === "string" ? raw.name : "Address",
    details: typeof raw.details === "string" ? raw.details : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    city: typeof raw.city === "string" ? raw.city : "",
  };
}

function addressesFrom(value: unknown): Address[] {
  const data = unwrapApiData(value);
  const root = object(data);
  const source = Array.isArray(data)
    ? data
    : Array.isArray(root?.addresses)
      ? root.addresses
      : Array.isArray(root?.data)
        ? root.data
        : [];
  return source.flatMap((entry) => {
    const address = addressFrom(entry);
    return address ? [address] : [];
  });
}

function singleAddressFrom(value: unknown): Address | null {
  const data = unwrapApiData(value);
  const root = object(data);
  return addressFrom(root?.address ?? data);
}

function profileValues(user: StoreUser): ProfileValues {
  return { name: user.name, email: user.email, phone: user.phone ?? "" };
}

function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDetailId, setPendingDetailId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<unknown>("/addresses");
      setAddresses(addressesFrom(result));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load your addresses.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadAddresses());
  }, [loadAddresses]);

  async function addAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const address = {
      name: String(formData.get("name") ?? "").trim(),
      details: String(formData.get("details") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
    };
    if (Object.values(address).some((value) => !value)) {
      setError("Complete all address fields before saving.");
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest("/addresses", { method: "POST", body: address });
      form.reset();
      if (await loadAddresses()) setSuccess("Address added.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not add the address.");
    } finally {
      setPending(false);
    }
  }

  async function removeAddress(address: Address) {
    setPendingDeleteId(address.id);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest(`/addresses/${encodeURIComponent(address.id)}`, { method: "DELETE" });
      setAddresses((current) => current.filter((entry) => entry.id !== address.id));
      if (selectedAddress?.id === address.id) setSelectedAddress(null);
      setSuccess("Address removed.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not remove the address.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  async function viewAddress(address: Address) {
    if (selectedAddress?.id === address.id) {
      setSelectedAddress(null);
      return;
    }
    setPendingDetailId(address.id);
    setError(null);
    try {
      const result = await apiRequest<unknown>(`/addresses/${encodeURIComponent(address.id)}`);
      const details = singleAddressFrom(result);
      if (!details) throw new Error("The address response did not contain address details.");
      setSelectedAddress(details);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load the address details.");
    } finally {
      setPendingDetailId(null);
    }
  }

  return (
    <section className="surface-card rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)] sm:p-6" aria-labelledby="addresses-heading">
      <h2 id="addresses-heading" className="font-heading text-2xl font-medium text-navy">Saved addresses</h2>
      <p className="mt-1 text-sm text-copy">Manage delivery addresses for your account.</p>

      <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void addAddress(event)}>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
          Address name
          <input className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10" name="name" placeholder="Home" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
          Phone number
          <input className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10" name="phone" type="tel" autoComplete="tel" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy sm:col-span-2">
          Address details
          <input className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10" name="details" autoComplete="street-address" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
          City
          <input className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10" name="city" autoComplete="address-level2" required />
        </label>
        <div className="flex items-end">
          <button type="submit" className={formButtonClass} disabled={pending}>
            {pending ? "Adding..." : "Add address"}
          </button>
        </div>
      </form>

      {error ? <div className="mt-4"><Notice tone="error">{error}</Notice></div> : null}
      {success ? <div className="mt-4"><Notice tone="success">{success}</Notice></div> : null}

      {loading ? (
        <p className="mt-6 text-sm text-copy">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="mt-6 rounded-lg bg-zinc-50 p-4 text-sm text-copy">No saved addresses yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-navy">{address.name}</h3>
                <p className="mt-1 text-sm text-copy">{address.details}{address.city ? `, ${address.city}` : ""}</p>
                {address.phone ? <p className="mt-1 text-sm text-copy">{address.phone}</p> : null}
                {selectedAddress?.id === address.id ? (
                  <p className="mt-2 text-sm text-copy">
                    {selectedAddress.details}{selectedAddress.city ? `, ${selectedAddress.city}` : ""}
                    {selectedAddress.phone ? ` · ${selectedAddress.phone}` : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  className="text-sm font-medium text-fresh hover:underline disabled:opacity-60"
                  disabled={pendingDetailId === address.id}
                  onClick={() => void viewAddress(address)}
                >
                  {pendingDetailId === address.id ? "Loading..." : selectedAddress?.id === address.id ? "Hide details" : "View details"}
                </button>
                <button
                  type="button"
                  className="text-sm font-medium text-rose-700 hover:underline disabled:opacity-60"
                  disabled={pendingDeleteId === address.id}
                  onClick={() => void removeAddress(address)}
                >
                  {pendingDeleteId === address.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ProfilePage() {
  const { user, updateUser, signOut } = useStore();
  const [values, setValues] = useState<ProfileValues | null>(null);
  const [pending, setPending] = useState(false);
  const [verification, setVerification] = useState<"idle" | "verified" | "failed">("idle");
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const userId = user?._id;
  const formValues = values ?? (user ? profileValues(user) : null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    apiRequest<unknown>("/auth/verifyToken")
      .then(() => {
        if (active) setVerification("verified");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setVerification("failed");
        if (error instanceof ApiError && error.status === 401) {
          signOut();
          setMessage({ text: "Your session has expired. Please sign in again.", success: false });
          return;
        }
        setMessage({
          text: error instanceof Error ? error.message : "Could not verify your account session.",
          success: false,
        });
      });
    return () => { active = false; };
  }, [userId, signOut]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !formValues) return;
    setPending(true);
    setMessage(null);
    try {
      await apiRequest("/users/updateMe/", {
        method: "PUT",
        body: formValues,
      });
      updateUser({ ...user, ...formValues });
      setMessage({ text: "Your profile has been updated.", success: true });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "Could not update your profile.",
        success: false,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <StorePage
      eyebrow="Your account"
      title="Profile"
      description="View and update the details associated with your FreshCart account."
    >
      {!user ? (
        <Notice>
          Please <Link className="font-semibold text-fresh underline" href="/login">sign in</Link> to view your profile.
        </Notice>
      ) : !formValues ? (
        <p className="py-8 text-center text-sm text-copy">Loading profile...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="flex flex-col gap-6">
            <form
            className="surface-card flex flex-col gap-4 rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)] sm:p-6"
              onSubmit={(event) => void saveProfile(event)}
            >
              {verification === "idle" ? (
                <p className="text-sm text-copy">Verifying your account session...</p>
              ) : null}
              {verification === "verified" ? (
                <p className="text-sm text-copy">Your account session is active.</p>
              ) : null}
              <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
                Name
                <input
                  className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10"
                  name="name"
                  autoComplete="name"
                  required
                  value={formValues.name}
                  onChange={(event) => setValues({ ...formValues, name: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
                Email
                <input
                  className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formValues.email}
                  onChange={(event) => setValues({ ...formValues, email: event.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-navy">
                Phone number
                <input
                  className="h-12 rounded-xl border border-line bg-[#faf8f3] px-4 font-normal outline-none transition focus:border-fresh focus:bg-white focus:ring-4 focus:ring-fresh/10"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formValues.phone}
                  onChange={(event) => setValues({ ...formValues, phone: event.target.value })}
                />
              </label>
              {message ? <Notice tone={message.success ? "success" : "error"}>{message.text}</Notice> : null}
              <button type="submit" className={formButtonClass} disabled={pending}>
                {pending ? "Saving..." : "Save profile"}
              </button>
            </form>
            <AddressManager />
          </div>

          <nav aria-label="Account" className="surface-card flex flex-col gap-3 rounded-2xl border border-line p-5 shadow-[0_12px_36px_rgba(23,58,53,0.05)]">
            <Link className="text-sm font-medium text-fresh hover:underline" href="/orders">Order history</Link>
            <Link className="text-sm font-medium text-fresh hover:underline" href="/change-password">Change password</Link>
          </nav>
        </div>
      )}
    </StorePage>
  );
}
