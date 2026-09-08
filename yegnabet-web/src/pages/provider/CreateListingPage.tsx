import { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/listing/ListingWizard";
import { API } from "../../types/api";
import type { ProviderTaxonomy } from "../../types/provider";

export default function CreateListingPage() {
  const providerId = 80; // Replace with authenticated provider ID

  const [taxonomy, setTaxonomy] = useState<ProviderTaxonomy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      API.get(`/provider/get-taxonomyNodes`)
        .then((r) => {
          console.log(r.data);
          setTaxonomy(r.data);
        })
        .catch((error) => {
          console.error("Failed to load listing", error);
          setTaxonomy([]);
        })
        .finally(() => {
          setLoading(false);
        });
      }
    , [providerId])

  return (
    <AppShell>
      <PageContainer>
        <ListingWizard
          mode="create"
          taxonomy={taxonomy}
          providerId={providerId}
          locations={[]}
          onSubmit={async () => {}}
        />
      </PageContainer>
    </AppShell>
  );
}