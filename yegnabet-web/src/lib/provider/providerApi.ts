export function loadProviderDashboard() {
    API.get(`/provider/${providerId}`)
        .then((r) => {
            setLoading(true);

            // correct image url if since its always relative
            r.data.listings.forEach((listing: any) => {
            if (listing.image && !listing.image.startsWith("http")) {
                listing.image = ASSET_URL + listing.image;
            }
            });

            setProvider(r.data);
        })
        .catch((error) => {
            console.error("Failed to load listing", error);
            setProvider(null);
        })
        .finally(() => {
            setLoading(false);
        });
}