import {
  Navigate,
  useParams,
} from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { ListingDetail } from "../../components/listing/ListingDetails";

import { listings } from "../../data/listings";

export function ListingDetailPage() {
  const { id } = useParams();

  const listing = listings.find(
    (item) =>
      item.id === Number(id)
  );

  if (!listing) {
    return (
      <Navigate
        to="/explore"
        replace
      />
    );
  }

  return (
    <AppShell>
      <ListingDetail
        listing={listing}
      />
    </AppShell>
  );
}