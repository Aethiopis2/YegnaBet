import {
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { ListingDetail } from "../../components/listing/ListingDetails";
import { useState, useEffect } from "react";
import type { Listing } from "../../types/customer/listings";
import Loading from "../../components/ui/common/Loading";
import { getListing } from "../../lib/customer/customerApi";

export function ListingDetailPage() {
  const locations = useLocation();
  const { id } = useParams();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchListing = async () => {
      try {
        const response = await getListing(Number(id));
        setListing(response);
      } catch (err) {
        console.error(err);
        setError(String(err || "An error occurred while fetching the listing."));
      } finally {
        setLoading(false);
      }
    }; 
    
    if (locations.state?.listing && locations.state.listing.id === Number(id)) {
      setListing(locations.state.listing);
      setLoading(false);
    } else {
      fetchListing();
    }
  }, [id]);

  // Don't make any navigation decision while request is pending
  if (loading) {
    return <Loading />;
  }

  // API finished, but no listing was returned
  if (!listing) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <AppShell currentUser={locations.state?.currentUser} mode={locations.state?.mode}>
      <ListingDetail listing={listing} />
    </AppShell>
  );
}