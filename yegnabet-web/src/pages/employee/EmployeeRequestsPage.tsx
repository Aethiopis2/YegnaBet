import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { RequestStatusBadge } from "../../components/employee/RequestStatusBadge";
//import { getEmployeeRequests } from "../../lib/employee/employeeRequestService";

import type {
  EmployeeRequest,
  InquiryStatus,
} from "../../types/employee/EmployeeRequest";
import { getEmployeeRequests } from "../../lib/employee/employeServices";

type StatusFilter = "All" | InquiryStatus;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// function formatPrice(price?: number) {
//   if (price === undefined) return "Price not specified";

//   return `${price.toLocaleString("en-US")} ETB`;
// }

function EmployeeRequestsPageContent() {
  const { token } = useAppContext();

  const navigate = useNavigate();

  const [requests, setRequests] = useState<EmployeeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await getEmployeeRequests(String(token));
        setRequests(data);
      } catch (error) {
        console.error("Failed to load requests:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const counts = useMemo(() => ({
    All: requests.length,
    New: requests.filter((r) => r.status === "New").length,
    Negotiating: requests.filter((r) => r.status === "Negotiating").length,
    Completed: requests.filter((r) => r.status === "Completed").length,
    Cancelled: requests.filter((r) => r.status === "Cancelled").length,
  }), [requests]);

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();

    return requests
      .filter((request) => {
        const matchesStatus =
          statusFilter === "All" || request.status === statusFilter;

        const matchesSearch =
          !term ||
          request.customer.name.toLowerCase().includes(term) ||
          request.customer.phoneNumber.toLowerCase().includes(term) ||
          request.listing.title.toLowerCase().includes(term) ||
          request.listing.location.toLowerCase().includes(term);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const difference =
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime();

        return sortOrder === "Newest" ? -difference : difference;
      });
  }, [requests, search, statusFilter, sortOrder]);

  const summaryCards: {
    label: StatusFilter;
    value: number;
    icon: typeof ClipboardList;
    color: string;
  }[] = [
    {
      label: "All",
      value: counts.All,
      icon: ClipboardList,
      color: "text-gray-500",
    },
    {
      label: "New",
      value: counts.New,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      label: "Negotiating",
      value: counts.Negotiating,
      icon: SlidersHorizontal,
      color: "text-amber-500",
    },
    {
      label: "Completed",
      value: counts.Completed,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "Cancelled",
      value: counts.Cancelled,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="mx-auto max-w-375 space-y-6">

      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Customer Requests
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Manage and follow up on customer inquiries.
        </p>
      </header>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const selected = statusFilter === card.label;

          return (
            <button
              key={card.label}
              onClick={() => setStatusFilter(card.label)}
              className={`rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-yegna-600 bg-yegna-50/60 dark:border-yegna-600 dark:bg-yegna-600/10"
                  : "border-gray-200 bg-white hover:border-yegna-300 dark:border-white/[0.07] dark:bg-[#101512]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {card.label === "All" ? "All Requests" : card.label}
                </span>
                <Icon className={`size-4 ${card.color}`} />
              </div>

              <p className="mt-3 text-2xl font-bold tabular-nums">
                {card.value}
              </p>
            </button>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or property..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none 
            transition focus:border-yegna-600 dark:border-white/8 dark:bg-[#101512]"
          />
        </div>

        <button
          onClick={() =>
            setSortOrder((current) =>
              current === "Newest" ? "Oldest" : "Newest"
            )
          }
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 
            py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/8 
            dark:bg-[#101512] dark:text-gray-300 dark:hover:bg-white/4"
        >
          <ArrowUpDown size={14} />
          {sortOrder} first
        </button>
      </div>

      {/* REQUEST LIST */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.07] dark:bg-[#101512]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/6">
          <div>
            <h2 className="text-sm font-semibold">Requests</h2>
            <p className="mt-0.5 text-[10px] text-gray-400">
              {filteredRequests.length} result(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-gray-400">
            Loading requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="mx-auto size-8 text-gray-300" />
            <p className="mt-3 text-sm font-semibold">
              No requests found
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400 dark:bg-white/2">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Property</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() =>
                        navigate(`/employee/requests/${request.id}`, {
                          state: { request },
                        })
                      }
                      className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-white/25"
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold">
                          {request.customer.name}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {request.customer.phoneNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium">
                          {request.listing.title}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {request.listing.location}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(request.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <RequestStatusBadge status={request.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <ChevronRight className="ml-auto size-4 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}
            <div className="divide-y divide-gray-100 md:hidden dark:divide-white/5">
              {filteredRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() =>
                    navigate(`/employee/requests/${request.id}`)
                  }
                  className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 dark:hover:bg-white/25"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-yegna-100 text-xs font-bold text-yegna-700 dark:bg-yegna-700/20 dark:text-yegna-400">
                    {request.customer.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-xs font-semibold">
                        {request.customer.name}
                      </p>
                      <RequestStatusBadge status={request.status} />
                    </div>
                    <p className="mt-1 truncate text-[10px] text-gray-500">
                      {request.listing.title}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <ChevronRight className="size-4 shrink-0 text-gray-400" />
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export function EmployeeRequestsPage() {
  return (
    <EmployeeShell>
      <EmployeeRequestsPageContent />
    </EmployeeShell>
  );
}