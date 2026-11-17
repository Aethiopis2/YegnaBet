import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Listing, ListingLifecycleStatus, UpdateManagedListingRequest } from "../../types/customer/listings";
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
import { createInquiry, removeManagedListing, updateManagedListing, updateSavedListing } from "../../lib/customer/customerApi";
import { OkCancelDialog } from "../ui/common/OkCancelDialog";
import { useAppContext } from "../layout/AppShell";


interface ListingDetailProps {
  listing: Listing;
  user: AuthUser | null;
  openSigninDlg?: boolean;
  setOpenSigninDlg?: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string;
  startInEditMode?: boolean;
  onListingUpdated?: (listing: Listing) => void;
}

export function ListingDetail({
  listing,
  user,
  openSigninDlg,
  setOpenSigninDlg,
  token,
  startInEditMode = false,
  onListingUpdated,
}: ListingDetailProps) {
  const navigate = useNavigate();
  const { requestMessage } = useAppContext();
  const isManager = user?.role === "Employee" || user?.role === "Owner";
  const isOwner = user?.role === "Owner";
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [draft, setDraft] = useState<UpdateManagedListingRequest>(() => ({
    title: listing.title,
    description: listing.description ?? "",
    price: listing.price,
    city: listing.location.city,
    area: listing.location.area,
    method: listing.method ?? (listing.status === 1 ? "Rent" : "Buy"),
    listingStatus: listing.listingStatus ?? "Draft",
  }));
  const [savingManagedListing, setSavingManagedListing] = useState(false);
  const [managementError, setManagementError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [savedOverride, setSavedOverride] = useState<{ listingId: number; userId: number | undefined; value: boolean } | null>(null);
  const saved = savedOverride?.listingId === listing.id && savedOverride.userId === user?.id
    ? savedOverride.value
    : Boolean(listing.saved);
  const setSaved = (value: boolean) => {
    if (isManager) return;
    if (!user) {
      setOpenSigninDlg?.(true);
      return;
    }

    const previousValue = saved;
    setSavedOverride({ listingId: listing.id, userId: user.id, value });
    void updateSavedListing({
      userId: Number(user.id),
      listingId: listing.id,
      saved: value,
    }).catch(error => {
      console.error("Failed to update saved listing", error);
      setSavedOverride({ listingId: listing.id, userId: user.id, value: previousValue });
    });
  };

  const saveManagedChanges = async () => {
    if (!isManager || !token) return;
    setSavingManagedListing(true);
    setManagementError("");
    try {
      const updated = await updateManagedListing(listing.id, token, draft);
      onListingUpdated?.({
        ...listing,
        ...updated,
        images: listing.images,
        media: listing.media,
      });
      setIsEditing(false);
    } catch (saveError) {
      console.error("Failed to update listing", saveError);
      setManagementError("Could not save listing changes.");
    } finally {
      setSavingManagedListing(false);
    }
  };

  const removeManagedListingConfirmed = async () => {
    if (!isOwner || !token) return;
    setRemoving(true);
    try {
      await removeManagedListing(listing.id, token);
      setConfirmRemove(false);
      navigate("/explore", { replace: true });
    } catch (removeError) {
      console.error("Failed to remove listing", removeError);
      setManagementError("Could not remove this listing.");
    } finally {
      setRemoving(false);
    }
  };

  const [showToast, setShowToast] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [requestSentFor, setRequestSentFor] = useState<string | null>(null);
  const inquiryKey = `${listing.id}:${user?.id ?? "guest"}`;
  const requestSend = requestSentFor === inquiryKey;

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
      setRequestSentFor(inquiryKey);
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
    if (!listing.employee) return;

    requestMessage({
      id: listing.employee.id,
      fullName: listing.employee.name,
      role: "Employee",
      avatar: listing.employee.avatar,
    });
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
          key={listing.id}
          listing={listing}
          saved={saved}
          onSavedChange={setSaved}
          showSave={!isManager}
        />

        <div
          className="
            mx-auto
            max-w-3xl
          "
        >
          {isManager && isEditing ? (
            <section className="space-y-4 px-4 pt-5 sm:px-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit listing</h1>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Title
                <input value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" />
              </label>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                Description
                <textarea value={draft.description ?? ""} onChange={event => setDraft(current => ({ ...current, description: event.target.value }))} rows={4} className="mt-1.5 w-full rounded-xl border border-black/10 bg-white p-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Price
                  <input type="number" min="0" value={draft.price ?? ""} onChange={event => setDraft(current => ({ ...current, price: event.target.value === "" ? undefined : Number(event.target.value) }))} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" />
                </label>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Listing method
                  <select value={draft.method} onChange={event => setDraft(current => ({ ...current, method: event.target.value as UpdateManagedListingRequest["method"] }))} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-[#17201b] dark:text-white">
                    <option value="Buy">For sale</option>
                    <option value="Rent">For rent</option>
                    <option value="Contract">Contract</option>
                    <option value="Service">Service</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  City
                  <input value={draft.city} onChange={event => setDraft(current => ({ ...current, city: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" />
                </label>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Area
                  <input value={draft.area} onChange={event => setDraft(current => ({ ...current, area: event.target.value }))} className="mt-1.5 h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-gray-900 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-white" />
                </label>
              </div>
            </section>
          ) : <ListingHeader listing={listing} />}

          {listing.metadata?.length > 0 && (
            <ListingFacts
              metadata={listing.metadata}
            />
          )}

          {!isEditing && listing.description && (
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

          {!isEditing && <ListingLocation location={listing.location} />}

          {listing.employee && (
            <ListingBroker
              broker={listing.employee}
            />
          )}

          {isManager ? (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/6 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#111]/95 sm:static sm:mt-8 sm:rounded-2xl sm:border sm:p-3">
              <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2">
                <label className="flex h-11 min-w-40 flex-1 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-xs text-gray-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-gray-300 sm:flex-none">
                  Status
                  <select value={draft.listingStatus} onChange={event => setDraft(current => ({ ...current, listingStatus: event.target.value as ListingLifecycleStatus }))} className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-gray-800 outline-none dark:text-white">
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </label>
                {!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="h-11 rounded-xl border border-yegna-200 px-4 text-xs font-bold text-yegna-800 dark:border-yegna-900 dark:text-yegna-300">Edit details</button>}
                {isEditing && <button type="button" onClick={() => {
                  setDraft({
                    title: listing.title,
                    description: listing.description ?? "",
                    price: listing.price,
                    city: listing.location.city,
                    area: listing.location.area,
                    method: listing.method ?? (listing.status === 1 ? "Rent" : "Buy"),
                    listingStatus: listing.listingStatus ?? "Draft",
                  });
                  setIsEditing(false);
                }} className="h-11 rounded-xl border border-black/10 px-4 text-xs font-semibold text-gray-600 dark:border-white/10 dark:text-gray-300">Cancel</button>}
                <button type="button" onClick={() => void saveManagedChanges()} disabled={savingManagedListing} className="h-11 flex-1 rounded-xl bg-yegna-700 px-5 text-xs font-bold text-white shadow-lg shadow-yegna-700/15 hover:bg-yegna-800 disabled:opacity-60 sm:flex-none">{savingManagedListing ? "Saving…" : "Save changes"}</button>
                {isOwner && <button type="button" onClick={() => setConfirmRemove(true)} className="h-11 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-700 dark:bg-red-900/20 dark:text-red-300">Remove listing</button>}
              </div>
              {managementError && <p role="alert" className="mx-auto mt-2 max-w-3xl text-xs text-red-600">{managementError}</p>}
            </div>
          ) : <ListingActionBar
              onMessage={handleMessage}
              onRequestViewing={handleViewing}
              requestSend={requestSend}
              showMessage={!user || user.role === "Customer"}
              messageDisabled={!listing.employee}
            />}
        </div>
      </div>

      <Toast
        open={showToast}
        message="Viewing request sent successfully."
        onClose={() =>
          setShowToast(false)
        }
      />
      <OkCancelDialog
        open={confirmRemove}
        title="Remove this listing?"
        message={`“${listing.title}” will be removed from the marketplace.`}
        okText="Remove listing"
        variant="danger"
        busy={removing}
        onOk={() => void removeManagedListingConfirmed()}
        onCancel={() => !removing && setConfirmRemove(false)}
      />

      {/*
       * We don't need to visually expose submitting
       * here yet. The dialog can be enhanced later
       * with a loading state.
       */}
    </div>
  );
}