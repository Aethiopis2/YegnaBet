import React, { useEffect, useState } from "react";
import type { Listing } from "../../types/customer/listings";
import { ListingGallery } from "./ListingGallery";
import { ListingHeader } from "./ListingHeader";
import { ListingFacts } from "./ListingFacts";
import { ListingDescription } from "./ListingDescription";
import { ListingFeatures } from "./ListingFeatures";
import { ListingVerification } from "./ListingVerification";
import { ListingLocation } from "./ListingLocation";
import { ListingBroker } from "./ListingBroker";
import { ListingActionBar } from "./ListingActionBar";
import { Toast } from "../common/Toast";
import type { AuthUser } from "../../types/auth/authTypes";
import { createInquiry } from "../../lib/customer/customerApi";


interface ListingDetailProps {
  listing: Listing;
  user: AuthUser | null;
  openSigninDlg?: boolean;
  setOpenSigninDlg?: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string;
}

export function ListingDetail({
  listing,
  user,
  openSigninDlg,
  setOpenSigninDlg,
  token,
}: ListingDetailProps) {

  const [saved, setSaved] = useState(
    listing.saved ?? false
  );

  const [showToast, setShowToast] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [requestSend, setRequestSend] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowToast(false);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showToast]);


  useEffect(() => {
     
  }, [user])

  const submitInquiry = async () => {
    if (!listing.assignmentId) {
      console.error(
        "No employee assignment available."
      );

      return;
    }

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      console.log(
        "Creating inquiry for listing:",
        listing.id, listing.assignmentId
      );
  
      await createInquiry(token??"", {
        listingId: listing.id,
        assignmentId: listing.assignmentId
      });
      

      /*
       * Inquiry successfully created.
       */
      setRequestSend(true);
      setShowToast(true);
    } catch (error) {
      console.error(
        "Request viewing failed:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessage = () => {
    console.log(
      "Message broker:",
      listing.id
    );
  };

  const handleViewing = () => {
    /*
     * No assignment means we cannot safely
     * create an inquiry.
     */
    if (!listing.assignmentId) {
      console.error(
        "No employee assignment available."
      );

      return;
    }

    if (user) {
      submitInquiry();
      return;
    }

    setOpenSigninDlg?.(!openSigninDlg);
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        pb-24
        dark:bg-[#0d0f0e]
        sm:pb-10
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
          sm:px-6
          lg:px-8
        "
      >
        <ListingGallery
          listing={listing}
          saved={saved}
          onSavedChange={setSaved}
        />

        <div
          className="
            mx-auto
            max-w-3xl
          "
        >
          <ListingHeader
            listing={listing}
          />

          {listing.metadata?.length > 0 && (
            <ListingFacts
              metadata={listing.metadata}
            />
          )}

          {listing.description && (
            <ListingDescription
              description={listing.description}
            />
          )}

          {listing.features?.length ? (
            <ListingFeatures
              features={listing.features}
            />
          ) : null}

          <ListingVerification
            verified={listing.verified}
          />

          <ListingLocation
            location={listing.location}
          />

          {listing.employee && (
            <ListingBroker
              broker={listing.employee}
            />
          )}

          <ListingActionBar
            onMessage={handleMessage}
            onRequestViewing={handleViewing}
            requestSend={requestSend}
          />
        </div>
      </div>

      <Toast
        open={showToast}
        message="Viewing request sent successfully."
        onClose={() =>
          setShowToast(false)
        }
      />

      {/*
       * We don't need to visually expose submitting
       * here yet. The dialog can be enhanced later
       * with a loading state.
       */}
    </div>
  );
}