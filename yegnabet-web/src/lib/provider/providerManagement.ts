import type { ListingDraft, ListingAttribute } from "../../types/provider/providerTypes";


export function createEmptyListingDraft(providerId: number): ListingDraft {
  return {
    title: "",
    description: "",

    provider: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },

    price: "",
    priceUnit: "",
    method: "",

    taxonomyId: null,
    providerId: providerId,
    
    // locationId: null,
    city: "",
    area: "",
    subArea: "",

    attributes: {},

    photos: [],
    videos: [],

    latitude: null,
    longitude: null,

    preciseLocation: false,
  };
} // end createEmpyListingDrafr


export function createListingDraftFormData(draft: ListingDraft) : FormData {
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

    formData.append("ProviderId", String(draft.providerId));
    formData.append("Provider.ProviderId", draft.provider.providerId ? String(draft.provider.providerId) : "");
    formData.append("Provider.FullName", draft.provider.fullName);
    formData.append("Provider.PhoneNumber", draft.provider.phoneNumber);
    formData.append("Provider.Email", draft.provider.email);
    formData.append("Provider.Password", draft.provider.password);
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
    const attr: ListingAttribute[] = [];
    Object.entries(draft.attributes).forEach(([key, value]) => {
        attr.push({
        name: key,
        value: String(value)
        })
    });
    formData.append("Attributes", JSON.stringify(attr));

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

    // Bind video items as structured form fields for ASP.NET's form model binder.
    draft.videos.forEach((video, index) => {
        if (video.id != null) {
            formData.append(`Videos[${index}].Id`, String(video.id));
        }
        formData.append(`Videos[${index}].Url`, video.url);
    });

    return formData;
} // end createListingDraftFormData
