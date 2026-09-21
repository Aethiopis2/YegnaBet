import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/listing/ListingWizard";
import type { ListingDraft } from "../../types/provider/providerTypes";
import { API } from "../../types/api";
import { useNavigate } from "react-router-dom";
import { createListingDraftFormData } from "../../lib/provider/providerManagement";


export default function CreateListingPage() {
  const providerId = 887; // Replace with authenticated provider ID
  const navigate = useNavigate();

  const handleSubmit = async (draft: ListingDraft) => {
    API.post(`/provider`, createListingDraftFormData(draft))
      .then(res => {
        console.log(res)
        navigate('/provider');
      })
      .catch(err => console.log("API upload failed", err.message));
  }

  return (
    <AppShell>
      <PageContainer>
        <ListingWizard
          mode="create"
          providerId={providerId}
          locations={[]}
          onSubmit={async (draft) => await handleSubmit(draft)}
          onCancel={async () => navigate('/provider')}
        />
      </PageContainer>
    </AppShell>
  );
}