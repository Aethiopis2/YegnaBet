import {
  Navigate,
  useParams,
} from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { ListingDetail } from "../../components/listing/ListingDetails";
import { API, ASSET_URL } from "../../types/api";
import { useState, useEffect } from "react";
import type { Listing } from "../../types/listings";

export function ListingDetailPage() {
  const { id } = useParams();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    API.get(`/listings/${id}`)
      .then((r) => {
        // correct image url if since its always relative
        if (r.data.images) {
          r.data.images = r.data.images.map((img: string) => ASSET_URL + img);
        }

        // do the same for the employee image
        if (r.data.employee?.avatar) {
          r.data.employee.avatar = ASSET_URL + r.data.employee.avatar;
        }
        setListing(r.data);
      })
      .catch((error) => {
        console.error("Failed to load listing", error);
        setListing(null);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  // Don't make any navigation decision while request is pending
  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
        </div>
      </AppShell>
    );
  }

  // API finished, but no listing was returned
  if (!listing) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <AppShell>
      <ListingDetail listing={listing} />
    </AppShell>
  );
}