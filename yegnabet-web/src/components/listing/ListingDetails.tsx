import { useEffect, useState } from "react";

import type { Listing } from "../../types/listings";

import { ListingGallery } from "./ListingGallery";
import { ListingHeader } from "./ListingHeader";
import { ListingFacts } from "./ListingFacts";
import { ListingDescription } from "./ListingDescription";
import { ListingFeatures } from "./ListingFeatures";
import { ListingVerification } from "./ListingVerification";
import { ListingLocation } from "./ListingLocation";
import { ListingBroker } from "./ListingBroker";
import { ListingActionBar } from "./ListingActionBar";

import { CustomerInfoDialog } from "../common/CustomerInfoDialog";
import { Toast } from "../common/Toast";
import { ASSET_URL } from "../../types/api";

interface ListingDetailProps {
  listing: Listing;
}

export function ListingDetail({
  listing,
}: ListingDetailProps) {
  const [saved, setSaved] = useState(
    listing.saved ?? false
  );

  const [showCustomerDialog, setShowCustomerDialog] =
    useState(false);

  const [showToast, setShowToast] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

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

  /*
   * Later this will come from our authentication/session state.
   *
   * For now:
   *   null = guest
   *
   * Later:
   *   const customer = useAuth();
   *   const customerId = customer?.id ?? null;
   */
  const customerId: number | null = null;

  const submitInquiry = async (
    customer?: {
      fullName: string;
      phone: string;
    }
  ) => {
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


      const response = await fetch(
        ASSET_URL + "api/inquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingId: listing.id,
            assignmentId: listing.assignmentId,

            /*
             * Logged-in customer:
             * use the customer ID.
             */
            customerId,

            /*
             * Guest customer:
             * use the information entered
             * in the dialog.
             */
            customerName:
              customer?.fullName ?? null,

            customerPhone:
              customer?.phone ?? null,
          }),
        }
      );

      if (!response.ok) {
        const error =
          await response.json().catch(() => null);

        throw new Error(
          error?.message ??
            "Failed to request viewing."
        );
      }

      /*
       * Inquiry successfully created.
       */
      setShowCustomerDialog(false);
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

    /*
     * Later, authentication will provide
     * the customer ID.
     *
     * Logged in:
     *      submit immediately
     *
     * Guest:
     *      ask for minimal contact information
     */
    if (customerId) {
      submitInquiry();
      return;
    }

    setShowCustomerDialog(true);
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
          />
        </div>
      </div>

      <CustomerInfoDialog
        open={showCustomerDialog}
        onClose={() =>
          setShowCustomerDialog(false)
        }
        onSubmit={submitInquiry}
      />

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