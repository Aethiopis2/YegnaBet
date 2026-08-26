import { EmployeeSidebar } from "./EmployeeSidebar";
import { EmployeeHeader } from "./EmployeeHeader";

interface EmployeeShellProps {
  children: React.ReactNode;
}

export function EmployeeShell({
  children,
}: EmployeeShellProps) {
  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        text-gray-900
        transition-colors

        dark:bg-[#0b0f0d]
        dark:text-white
      "
    >
      <EmployeeSidebar />

      <div
        className="
          min-h-screen
          lg:pl-64
        "
      >
        <EmployeeHeader />

        <main className="px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}