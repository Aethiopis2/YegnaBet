export function formatPrice(value: number, currency = "ETB") : string {
    return `${new Intl.NumberFormat("en-US").format(value)} ${currency}`
}

export function formatArea(value?: number) : string {
    if (!value) return "";

    return `{new Intl.NumberFormat("en-US").format(value)} m²`;
}