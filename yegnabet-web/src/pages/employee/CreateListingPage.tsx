
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/listing/ListingWizard";
import type { ListingDraft } from "../../types/provider/providerTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { EmployeeShell, useAppContext } from "../../components/employee/EmployeeShell";
import { createEmployeeListing } from "../../lib/employee/employeServices";
import { useState } from "react";
import Loading from "../../components/ui/common/Loading";
import ErrorBlock from "../../components/ui/common/ErrorBlock";


function CreateListingPageComponent() {
  const { user, token } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const handleSubmit = async (draft: ListingDraft) => {
    try {
      setLoading(true);
      setError("");
      await createEmployeeListing(token || location.state?.token, draft);
      navigate('/employee', {
        state: {
          token: token || location.state?.token,
        }});
    } catch (err) {
      console.error("Failed to create listing", err);
      setError("Failed to create listing: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PageContainer><Loading /></PageContainer>;
  if (error) return <PageContainer><ErrorBlock message={error} /></PageContainer>;

  return (
    <PageContainer>
      <ListingWizard
        mode="create"
        employeeId={user?.id}
        locations={[]}
        onSubmit={async (draft) => await handleSubmit(draft)}
        onCancel={async () => navigate('/employee')}
        token={token || location.state?.token}
      />
    </PageContainer>
  );
}


export default function CreateListingPage() {
  return (
    <EmployeeShell>
      <CreateListingPageComponent />
    </EmployeeShell>
  );
}