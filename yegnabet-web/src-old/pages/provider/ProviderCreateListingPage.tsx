import { useState } from "react";
import { SubmissionSuccess } from "../../components/provider/SubmissionSuccess";
import { ListingForm } from "../../components/provider/ListingForm";

interface TypeCardProps {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
}

function TypeCard({
    icon,
    title,
    description,
    onClick
}: TypeCardProps) {

    return (
        <button
            onClick={onClick}
            className="
                rounded-2xl
                border
                border-stone-200
                bg-white
                p-6
                text-left
                transition
                hover:-translate-y-1
                hover:border-stone-300
                hover:shadow-md
            "
        >

            <div className="text-3xl">
                {icon}
            </div>

            <div className="
                mt-4
                font-semibold
                text-stone-900
            ">
                {title}
            </div>

            <div className="
                mt-1
                text-sm
                text-stone-500
            ">
                {description}
            </div>

        </button>
    );
}


type ListingType =
    | "house"
    | "apartment"
    | "land"
    | "service";

export default function ProviderCreateListingPage() {

    const [type, setType] =
        useState<ListingType | null>(null);

    const [submitted, setSubmitted] =
        useState(false);


    if (submitted) {
        return (
            <SubmissionSuccess />
        );
    }


    return (
        <main className="
            min-h-screen
            bg-stone-50
            p-6
            lg:p-8
        ">

            <div className="
                mx-auto
                max-w-3xl
            ">

                <h1 className="
                    text-2xl
                    font-semibold
                    text-stone-900
                ">
                    Add a listing
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-stone-500
                ">
                    Submit a property or service for verification.
                </p>


                {!type ? (

                    <div className="mt-8">

                        <h2 className="
                            text-sm
                            font-medium
                            text-stone-700
                        ">
                            What would you like to register?
                        </h2>

                        <div className="
                            mt-4
                            grid
                            grid-cols-2
                            gap-4
                        ">

                            <TypeCard
                                icon="🏠"
                                title="House"
                                description="House for rent or sale"
                                onClick={() => setType("house")}
                            />

                            <TypeCard
                                icon="🏢"
                                title="Apartment"
                                description="Apartment for rent or sale"
                                onClick={() => setType("apartment")}
                            />

                            <TypeCard
                                icon="🌳"
                                title="Land"
                                description="Land for sale or lease"
                                onClick={() => setType("land")}
                            />

                            <TypeCard
                                icon="👷"
                                title="Service"
                                description="Professional or household service"
                                onClick={() => setType("service")}
                            />

                        </div>

                    </div>

                ) : (

                    <ListingForm
                        type={type}
                        onBack={() => setType(null)}
                        onSubmit={() => setSubmitted(true)}
                    />

                )}

            </div>

        </main>
    );
}