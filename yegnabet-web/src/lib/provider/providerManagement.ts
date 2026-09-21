import type { ListingDraft, ListingAttribute } from "../../types/provider/providerTypes";


export function createEmptyListingDraft(providerId: number): ListingDraft {
  return {
    title: "",
    description: "",

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
    let attr: ListingAttribute[] = [];
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

    // video urls
    if (draft.videos.length > 0) {
        formData.append("Videos", JSON.stringify(draft.videos));
    }

    return formData;
} // end createListingDraftFormData