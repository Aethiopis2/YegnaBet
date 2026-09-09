import { Key } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";
import { ListingWizard } from "../../components/provider/listing/ListingWizard";
import type { ListingDraft } from "../../types/providerListings";
import { API } from "../../types/api";


export default function CreateListingPage() {
  const providerId = 80; // Replace with authenticated provider ID

  const handleSubmit = async (draft: ListingDraft) => {
    const formData = new FormData();

    formData.append("Title", draft.title);
    formData.append("Description", draft.description);
    formData.append("Price", draft.price);
    formData.append("PriceUnit", draft.priceUnit);
    formData.append("Method", draft.method);

    if (draft.id != null)
      formData.append("Id", String(draft.id));

    if (draft.taxonomyId != null)
      formData.append("TaxonomyId", String(draft.taxonomyId));

    formData.append("City", draft.city);
    formData.append("Area", draft.area);

    if (draft.subArea)
      formData.append("SubArea", draft.subArea);

    if (draft.latitude != null)
      formData.append("Latitude", String(draft.latitude));

    if (draft.longitude != null)
      formData.append("Longitude", String(draft.longitude));

    formData.append(
      "PreciseLocation",
      String(draft.preciseLocation)
    );

    // now attributes
    Object.entries(draft.attributes).forEach(([key, value]) => {
      formData.append(`Attributes[${key}]`, String(value));
    });

    // photo uploads
    draft.photos.forEach((photo, index) => {
      if (photo.id != null) {
        formData.append(
          `Photos[${index}].Id`,
          String(photo.id)
        );
      }

      if (photo.url) {
        formData.append(
          `Photos[${index}].Url`,
          photo.url
        );
      }

      if (photo.file) {
        formData.append(
          `Photos[${index}].File`,
          photo.file
        );
      }

      formData.append(
        `Photos[${index}].IsPrimary`,
        String(photo.isPrimary)
      );
    });

    // video urls
    if (draft.videos.length > 0) {
      formData.append("Videos", JSON.stringify(draft.videos));
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    API.post(`/provider`, formData)
      .then(res => console.log(res))
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
        />
      </PageContainer>
    </AppShell>
  );
}