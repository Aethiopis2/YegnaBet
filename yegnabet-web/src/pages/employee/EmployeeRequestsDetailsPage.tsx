import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { RequestStatusBadge } from "../../components/employee/RequestStatusBadge";

// import {
//   getEmployeeRequest,
//   updateEmployeeRequestStatus,
// } from "../../lib/employee/employeeRequestService";

import type {
  EmployeeRequest,
  InquiryStatus,
} from "../../types/employee/EmployeeRequest";
import { BASE_URL_STRING } from "../../types/api";
import { getEmployeeRequests, updateInquiryStatus } from "../../lib/employee/employeServices";

function EmployeeRequestDetailsContent() {
  const { id } = useParams();
  const { token } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [request, setRequest] = useState<EmployeeRequest | null>(location.state?.request || null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequest() {
      try {
        setLoading(true);

        const data = await getEmployeeRequests(String(token));
        if (!data) {
          setError("Request not found.");
          return;
        }

        const foundRequest = data.find((r) => r.id === Number(id));
        setRequest(foundRequest || null);
      } catch (err) {
        console.error(err);
        setError("Unable to load this request.");
      } finally {
        setLoading(false);
      }
    }

    //if (!request)
      loadRequest();
  }, [id]);

  async function changeStatus(status: InquiryStatus) {
    if (!request || updating) return;

    try {
      setUpdating(true);
      setError("");

      const updated = await updateInquiryStatus(
        String(token),
        request.id,
        status
      );

      setRequest(updated);
    } catch (err) {
      console.error(err);
      setError("Unable to update request status.");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-xs text-gray-400">
        Loading request...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-white/[0.07] dark:bg-[#101512]">
        <p className="text-sm font-semibold">
          {error || "Request not found."}
        </p>

        <button
          onClick={() => navigate("/employee/requests")}
          className="mt-4 text-xs font-semibold text-yegna-700 dark:text-yegna-400"
        >
          Back to requests
        </button>
      </div>
    );
  }

  const availableActions: {
    label: string;
    status: InquiryStatus;
    icon: typeof CheckCircle2;
    style: string;
  }[] =
    request.status === "New"
      ? [
          {
            label: "Start Negotiating",
            status: "Negotiating",
            icon: ArrowRight,
            style: "bg-yegna-700 text-white hover:bg-yegna-800",
          },
          {
            label: "Cancel Request",
            status: "Cancelled",
            icon: XCircle,
            style: "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10",
          },
        ]
      : request.status === "Negotiating"
        ? [
            {
              label: "Mark as Completed",
              status: "Completed",
              icon: CheckCircle2,
              style: "bg-green-600 text-white hover:bg-green-700",
            },
            {
              label: "Cancel Request",
              status: "Cancelled",
              icon: XCircle,
              style: "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10",
            },
          ]
        : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* PAGE HEADER */}
      <div>
        <button
          onClick={() => navigate("/employee/requests")}
          className="mb-4 flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-yegna-700 dark:text-gray-400 dark:hover:text-yegna-400"
        >
          <ArrowLeft size={15} />
          Back to Requests
        </button>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Request #{request.id}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Request Details
            </h1>
          </div>

          <RequestStatusBadge status={request.status} />
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">

        {/* REQUEST INFORMATION */}
        <div className="space-y-5">

          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#101512]">
            <h2 className="text-sm font-semibold">
              Requested Property
            </h2>

            <div className="mt-4">
              {request.listing.imageUrl ? (
                <img
                  src={BASE_URL_STRING + request.listing.imageUrl}
                  alt={request.listing.title}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-40 place-items-center rounded-xl 
                bg-gray-100 text-xs text-gray-400 dark:bg-white/4">
                  Property image unavailable
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-base font-bold">
                {request.listing.title}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {request.listing.category}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin size={14} />
                {request.listing.location}
              </div>

              {request.listing.price !== undefined && (
                <p className="mt-3 text-lg font-bold text-yegna-700 dark:text-yegna-400">
                  {request.listing.price.toLocaleString("en-US")} ETB
                </p>
              )}
            </div>
          </section>

          {/* CUSTOMER INFORMATION */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#101512]">
            <h2 className="text-sm font-semibold">
              Customer Information
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-yegna-100 text-sm font-bold text-yegna-700 dark:bg-yegna-700/20 dark:text-yegna-400">
                {request.customer.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {request.customer.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  Customer #{request.customer.id}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <Phone size={15} />
                {request.customer.phoneNumber}
              </div>

              {request.customer.email && (
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <Mail size={15} />
                  {request.customer.email}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* REQUEST STATUS AND ACTIONS */}
        <div className="space-y-5">

          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#101512]">
            <h2 className="text-sm font-semibold">
              Request Information
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Request ID
                </span>
                <span className="text-xs font-semibold">
                  #{request.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Listing ID
                </span>
                <span className="text-xs font-semibold">
                  #{request.listing.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Submitted
                </span>
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <CalendarDays size={13} className="text-gray-400" />
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Current Status
                </span>
                <RequestStatusBadge status={request.status} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/[0.07] dark:bg-[#101512]">
            <h2 className="text-sm font-semibold">
              Update Request
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Change the status as you handle this customer request.
            </p>

            {availableActions.length > 0 ? (
              <div className="mt-5 space-y-2">
                {availableActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.status}
                      disabled={updating}
                      onClick={() => changeStatus(action.status)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${action.style}`}
                    >
                      <Icon size={15} />
                      {updating ? "Updating..." : action.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-white/4 dark:text-gray-400">
                This request is {request.status.toLowerCase()}. No further status changes are available.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export function EmployeeRequestDetailsPage() {
  return (
    <EmployeeShell>
      <EmployeeRequestDetailsContent />
    </EmployeeShell>
  );
}