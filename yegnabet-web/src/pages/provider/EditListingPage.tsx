import { useNavigate, useParams } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/Listing/ListingWizard";
import type { ListingDraft } from "../../types/provider/providerTypes";

export default function EditListingPage() {
  const providerId = 887;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // function fetchListingDraft() : ListingDraft {

  // }

  function handleSubmit(daft) {

  }
  console.log(id);
  if (!id) {
    return (
      <AppShell>
        <PageContainer>
          <div className="py-12 text-center">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              Listing not found
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No listing ID was provided.
            </p>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <ListingWizard
          mode="edit"
          providerId={providerId}
          listingId={Number(id)}
          locations={[]}
          onSubmit={async (draft) => await handleSubmit(draft)}
          onCancel={async () => navigate('/provider')}
        />
      </PageContainer>
    </AppShell>
  );
}