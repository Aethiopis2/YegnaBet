import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Clock,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";

import { EmployeeShell } from "../../components/employee/EmployeeShell";
import { DashboardStat } from "../../components/employee/DashboardStat";
import { DashboardPanel } from "../../components/employee/DashboardPanel"
import { Task } from "../../components/employee/Task";
import { ScheduleItem } from "../../components/employee/ScheduleItem";
import { Request } from "../../components/employee/Request";
import { Appointment } from "../../components/employee/Appointment";
import { QuickAction } from "../../components/employee/QuickAction";

export function EmployeeDashboardPage() {
  return (
    <EmployeeShell>
      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* GREETING */}

        <header>
          <h1 className="text-2xl font-bold tracking-tight">
            Good morning, Hana! 👋
          </h1>

          <p className="mt-1 text-xs text-gray-400">
            Here's what's happening with
            your work today.
          </p>
        </header>

        {/* STATS */}

        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <DashboardStat
            title="New Requests"
            value="6"
            trend="20% from yesterday"
            icon={ClipboardList}
          />

          <DashboardStat
            title="My Active Requests"
            value="24"
            description="View all requests"
            icon={UserPlus}
          />

          <DashboardStat
            title="Today's Appointments"
            value="5"
            description="View calendar"
            icon={CalendarDays}
          />

          <DashboardStat
            title="Deals in Progress"
            value="7"
            description="View pipeline"
            icon={BriefcaseBusiness}
          />
        </div>

        {/* TASKS + SCHEDULE */}

        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <DashboardPanel
            title="My Tasks Today"
            action="View all tasks"
          >
            <Task
              title="Follow up with Daniel"
              subtitle="3 bedroom house in CMC"
              time="09:30 AM"
              priority="High"
            />

            <Task
              title="Send property options to Sara"
              subtitle="Apartment in Bole"
              time="10:15 AM"
              priority="Medium"
              completed
            />

            <Task
              title="Schedule viewing for Mekdes"
              subtitle="Land in Sululta"
              time="11:00 AM"
              priority="Medium"
            />

            <Task
              title="Call Michael"
              subtitle="Commercial office space"
              time="02:00 PM"
              priority="High"
            />

            <Task
              title="Send documents to Yared"
              subtitle="House in Gerji"
              time="04:30 PM"
              priority="Low"
            />
          </DashboardPanel>

          <DashboardPanel
            title="Today's Schedule"
            action="View full calendar"
          >
            <ScheduleItem
              time="09:30 AM"
              title="Follow up call"
              description="Daniel · House in CMC"
            />

            <ScheduleItem
              time="10:30 AM"
              title="Property presentation"
              description="Sara · Apartment in Bole"
            />

            <ScheduleItem
              time="12:00 PM"
              title="Lunch Break"
              description=""
            />

            <ScheduleItem
              time="02:00 PM"
              title="Property viewing"
              description="Mekdes · Land in Sululta"
            />

            <ScheduleItem
              time="04:00 PM"
              title="Client meeting"
              description="Michael · Office Space"
            />
          </DashboardPanel>
        </div>

        {/* LOWER GRID */}

        <div
          className="
            grid
            gap-5
            lg:grid-cols-3
          "
        >
          <DashboardPanel
            title="My Active Requests"
            action="View all"
          >
            <Request
              name="Sara Alemu"
              detail="3 Bed House · CMC"
              status="New"
            />

            <Request
              name="Daniel Kebede"
              detail="House · Bole"
              status="Contacted"
            />

            <Request
              name="Mekdes Yohannes"
              detail="Land · Sululta"
              status="Viewing"
            />

            <Request
              name="Yared Bekele"
              detail="4 Bed House · Gerji"
              status="In Progress"
            />
          </DashboardPanel>

          <DashboardPanel
            title="Upcoming Appointments"
            action="View all"
          >
            <Appointment
              time="09:30 AM"
              title="House Viewing"
              customer="Daniel Kebede"
            />

            <Appointment
              time="11:00 AM"
              title="Apartment Viewing"
              customer="Sara Alemu"
            />

            <Appointment
              time="02:00 PM"
              title="Land Inspection"
              customer="Mekdes Yohannes"
            />
          </DashboardPanel>

          <DashboardPanel title="Quick Actions">
            <QuickAction
              icon={Plus}
              label="Add New Property"
            />

            <QuickAction
              icon={UserPlus}
              label="New Customer Request"
            />

            <QuickAction
              icon={CalendarDays}
              label="Schedule Appointment"
            />

            <QuickAction
              icon={Search}
              label="Search Properties"
            />
          </DashboardPanel>
        </div>
      </div>
    </EmployeeShell>
  );
}