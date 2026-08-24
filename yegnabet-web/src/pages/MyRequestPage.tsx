import {
  ArrowLeft,
  Bell,
  Home,
  Search,
  Clock3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { PageContainer } from "../components/layout/PageContainer";

import type { UserRequest } from "../types/request";

function getRequests(): UserRequest[] {
  try {
    return JSON.parse(
      localStorage.getItem(
        "yegna-requests"
      ) ?? "[]"
    );
  } catch {
    return [];
  }
}

export function MyRequestsPage() {
  const navigate = useNavigate();

  const requests = getRequests();

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-3xl px-1 py-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mb-5
              grid
              size-9
              place-items-center
              rounded-full
              text-gray-500
              hover:bg-gray-100
              dark:hover:bg-white/[0.06]
            "
          >
            <ArrowLeft className="size-4" />
          </button>

          <header>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              My Requests
            </h1>

            <p className="mt-1 text-xs text-gray-400">
              Things you've asked Yegna Bet
              to find for you.
            </p>
          </header>

          {requests.length === 0 ? (
            <div
              className="
                mt-8
                rounded-3xl
                border
                border-black/[0.05]
                bg-white
                p-10
                text-center
                dark:border-white/[0.06]
                dark:bg-white/[0.035]
              "
            >
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-yegna-50 text-yegna-700 dark:bg-yegna-900/20 dark:text-yegna-300">
                <Search className="size-6" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                Nothing here yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                Tell us what you're looking
                for and we'll help you find it.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/requests/property"
                  )
                }
                className="
                  mt-5
                  rounded-xl
                  bg-yegna-700
                  px-5
                  py-3
                  text-xs
                  font-bold
                  text-white
                "
              >
                Request a property
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="
                    rounded-2xl
                    border
                    border-black/[0.05]
                    bg-white
                    p-4
                    dark:border-white/[0.06]
                    dark:bg-white/[0.035]
                  "
                >
                  <div className="flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-yegna-50 text-yegna-700 dark:bg-yegna-900/20 dark:text-yegna-300">
                      {request.type ===
                      "alert" ? (
                        <Bell className="size-5" />
                      ) : (
                        <Home className="size-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {request.type ===
                        "alert"
                          ? request.title
                          : `${request.propertyType ?? "Property"} request`}
                      </h2>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {request.areas.length
                          ? request.areas.join(
                              " · "
                            )
                          : "Any area"}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-medium text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">
                          <Clock3 className="size-3" />

                          {request.status ===
                          "pending"
                            ? "Waiting"
                            : request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </PageContainer>
    </AppShell>
  );
}