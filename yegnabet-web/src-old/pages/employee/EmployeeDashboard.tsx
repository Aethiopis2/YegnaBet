import EmployeeHeader from "../../components/employee/EmployeeHeader";
import {EmployeeSidebar} from "../../components/employee/EmployeeSidebar";
import RequestTable from "../../components/employee/RequestTable";
import { SummaryCard } from "../../components/employee/SummaryCard";
import { useState } from "react";
import { RequestDetailsDrawer } from "../../components/employee/RequestDetailsDrawer";

export default function EmployeeDashboardPage() {

    const [selectedRequest, setSelectedRequest] =
    useState<Request | null>(null);

    return (
        <div className="
            min-h-screen
            bg-stone-50
        ">

            <EmployeeSidebar />

            <EmployeeHeader />

            <main className="
                ml-64
                pt-16
            ">

                <div className="
                    mx-auto
                    max-w-[1600px]
                    p-8
                ">

                    <div className="mb-8">
                        <h1 className="
                            text-2xl
                            font-semibold
                            text-stone-900
                        ">
                            Dashboard
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-stone-500
                        ">
                            Monitor and process Yegna Bet requests.
                        </p>
                    </div>


                    <div className="
                        grid
                        grid-cols-4
                        gap-4
                    ">

                        <SummaryCard
                            label="Pending requests"
                            value={18}
                            description="Require attention"
                        />

                        <SummaryCard
                            label="In progress"
                            value={7}
                            description="Currently being handled"
                        />

                        <SummaryCard
                            label="Awaiting contact"
                            value={12}
                            description="Need coordination"
                        />

                        <SummaryCard
                            label="Completed today"
                            value={26}
                            description="Successfully processed"
                        />

                    </div>


                    <div className="mt-8">
                        <RequestTable 
                            setSelectedRequest={setSelectedRequest}/>
                    </div>

                </div>

            </main>

            <RequestDetailsDrawer
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
            />
        </div>
    );
}