import { AppShell, useAppContext } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/listing/ListingWizard";
import type { ListingDraft } from "../../types/provider/providerTypes";
import { API } from "../../types/api";
import { useLocation, useNavigate } from "react-router-dom";
import { createListingDraftFormData } from "../../lib/provider/providerManagement";


function CreateListingPageComponent() {
  const { user, token } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (draft: ListingDraft) => {
    API.post(`/provider`, createListingDraftFormData(draft), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log(res)
        navigate('/employee');
      })
      .catch(err => console.log("API upload failed", err.message));
  }

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
    <AppShell>
      <CreateListingPageComponent />
    </AppShell>
  );
}