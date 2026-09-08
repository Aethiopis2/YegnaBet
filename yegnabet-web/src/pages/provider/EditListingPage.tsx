import { useParams } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/Listing/ListingWizard";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();

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
          listingId={Number(id)}
        />
      </PageContainer>
    </AppShell>
  );
}