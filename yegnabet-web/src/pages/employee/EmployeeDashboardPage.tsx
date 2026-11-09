
import {
  BriefcaseBusiness,
  ClipboardList,
  Clock,
  Plus,
  Search,
  UserPlus,
  TrendingUp,
} from "lucide-react";

import {
  EmployeeShell,
  useAppContext,
} from "../../components/employee/EmployeeShell";

import { DashboardStat } from "../../components/employee/DashboardStat";
import { DashboardPanel } from "../../components/employee/DashboardPanel";
import { Request } from "../../components/employee/Request";
import { QuickAction } from "../../components/employee/QuickAction";
import { type EmployeeInquiryDto, type DailyInquiryTrend, type EmployeeDashboardStats } from "../../types/employee/employeeDashboard";
import { useEffect, useState } from "react";
import { EmployeeDashboard } from "../../lib/employee/employeServices";
import Loading from "../../components/ui/common/Loading";
import ErrorBlock from "../../components/ui/common/ErrorBlock";
import { useNavigate } from "react-router-dom";

function EmployeeDashboardPageComponent() {
  const navigate = useNavigate();
  const { user, token } = useAppContext();
  
  const [stats, setStats] = useState<EmployeeDashboardStats>({
    newRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    needsAttention: 0,
    requestGrowth: 0,
  });
  const [weeklyActivities, setWeeklyActivities] = useState<DailyInquiryTrend[]>([]);
  const [recentRequests, setRecentRequests] = useState<EmployeeInquiryDto[]>([])
  const [activeRequests, setActiveRequests] = useState<EmployeeInquiryDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadDashboardStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await EmployeeDashboard(token);
        setStats(dashboardStats.stats);
        setWeeklyActivities(dashboardStats.weeklyActivities);
        setRecentRequests(dashboardStats.recentRequests);
        setActiveRequests(dashboardStats.activeRequests);
      } catch (err) {
        console.error(err);
        setError(String(err));
      }
      finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [token]);

  const maxActivity = Math.max(
    ...weeklyActivities?.map(x => x.count),
    1
  );

  function getDayOfWeek(dateString: string, short = false) {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      "en-US",
      {weekday: short ? "short" : "long"}
    );
  }


  if (loading) return <Loading />

  if (error) return <ErrorBlock message={error} />

  return (
    <>
      <div className="mx-auto max-w-375 space-y-5">

        {/* GREETING */}

        <header>
          <h1 className="text-2xl font-bold tracking-tight">
            Good morning, {user?.fullName || "User"} 👋
          </h1>

          <p className="mt-1 text-xs text-gray-400">
            Here's what's happening with your work today.
          </p>
        </header>


        {/* OVERVIEW STATS */}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <DashboardStat
            title="New Requests"
            value={stats.newRequests.toString()}
            trend={`${stats.requestGrowth}% from yesterday`}
            icon={ClipboardList}
            onClick={() => navigate("/employee/requests")}
          />

          <DashboardStat
            title="My Active Requests"
            value={stats.activeRequests.toString()}
            description="View all requests"
            icon={UserPlus}
          />

          <DashboardStat
            title="Completed Requests"
            value={stats.completedRequests.toString()}
            description="This month"
            icon={BriefcaseBusiness}
          />

          <DashboardStat
            title="Needs Attention"
            value={stats.needsAttention.toString()}
            description="New requests awaiting action"
            icon={Clock}
          />

        </div>


        {/* ACTIVITY + RECENT REQUESTS */}

        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">

          {/* REQUEST ACTIVITY */}

          <DashboardPanel
            title="Request Activity"
            action="Last 7 days"
          >
            <div className="space-y-5">

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold tracking-tight">
                    {weeklyActivities?.reduce(
                      (sum, x) => sum + x.count,
                      0
                    )}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Total requests this week
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-green-500">
                  <TrendingUp size={15} />
                  {stats.requestGrowth}% growth
                </div>
              </div>


              {/* SIMPLE ACTIVITY BARS */}

              <div className="flex h-36 items-end justify-between gap-3 pt-3">

                {weeklyActivities?.map((item, index) => (
                  <div
                    key={item.date + String(index)}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-[10px] text-gray-400">
                      {item.count}
                    </span>

                    <div
                      className={`
                        w-full max-w-10 rounded-t-md
                        transition-all duration-300
                        ${
                          index === weeklyActivities?.length - 1
                            ? "bg-green-500"
                            : "bg-green-500/20"
                        }
                      `}
                      style={{
                        height: `${(item.count / maxActivity) * 100}%`,
                      }}
                    />

                    <span className="text-[10px] text-gray-400">
                      {getDayOfWeek(String(item.date))}
                    </span>
                  </div>
                ))}

              </div>

            </div>
          </DashboardPanel>


          {/* RECENT REQUESTS */}

          <DashboardPanel
            title="Recent Requests"
            action="View all"
          >

            {recentRequests.map(request => (
              <Request
                key={request.id}
                name={request.customerName}
                detail={request.listingTitle}
                status={request.status}
              />
            ))}

          </DashboardPanel>

        </div>


        {/* LOWER GRID */}

        <div className="grid gap-5 lg:grid-cols-2">

          {/* ACTIVE REQUESTS */}

          <DashboardPanel
            title="My Active Requests"
            action="View all"
          >

            {activeRequests?.map((r:EmployeeInquiryDto) =>   {
              return (
                <Request 
                  key={r.id}
                  name={r.customerName}
                  detail={r.listingTitle}
                  status={r.status}
                />
              )
            })}

          </DashboardPanel>


          {/* QUICK ACTIONS */}

          <DashboardPanel title="Quick Actions">

            <QuickAction
              icon={Plus}
              label="Add New Property"
              onClick={() => navigate("/employee/create-listing", {
                state: {
                  token,
                }
              })}
            />

            <QuickAction
              icon={UserPlus}
              label="New Customer Request"
              onClick={() => {}}
            />

            <QuickAction
              icon={Search}
              label="Search Properties"
              onClick={()=>{}}
            />

          </DashboardPanel>

        </div>

      </div>
    </>
  );
}


export function EmployeeDashboardPage() {
  return (
    <EmployeeShell>
      <EmployeeDashboardPageComponent />
    </EmployeeShell>
  );
}