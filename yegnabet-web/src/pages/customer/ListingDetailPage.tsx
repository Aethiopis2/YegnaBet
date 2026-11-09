import {
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import { AppShell, useAppContext } from "../../components/layout/AppShell";
import { ListingDetail } from "../../components/listing/ListingDetails";
import { useState, useEffect } from "react";
import type { Listing } from "../../types/customer/listings";
import Loading from "../../components/ui/common/Loading";
import { getListing, updateListingViewCount } from "../../lib/customer/customerApi";
import ErrorBlock from "../../components/ui/common/ErrorBlock";

function ListingDetailPageComponent() {
  const locations = useLocation();
  const { id } = useParams();
  const { user, openSigninDlg, setOpenSigninDlg, token } = useAppContext();

  const [listing, setListing] = useState<Listing | null>(locations.state?.listing ?? null);
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
    
    fetchListing();
  }, [id]);

  // update the listingViewCount
  useEffect(() => {
    const updateViewCount = async () => {
      if (!listing) return;
      try {
        await updateListingViewCount(
          { 
            listingId: listing.id, 
            userId: locations.state?.currentUser?.id 
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

    updateViewCount();
  }, [listing]);

  // Don't make any navigation decision while request is pending
  if (loading) return <Loading />;

  if (error) return <ErrorBlock message={error} />;

  // API finished, but no listing was returned
  if (!listing) return <Navigate to="/explore" replace />;

  return (
    <ListingDetail listing={listing} user={user} 
      openSigninDlg={openSigninDlg} setOpenSigninDlg={(isOpen) => setOpenSigninDlg(isOpen)}
      token={token}  />
  );
}


export function ListingDetailPage() {
  return (
    <AppShell>
      <ListingDetailPageComponent />
    </AppShell>
  )
}