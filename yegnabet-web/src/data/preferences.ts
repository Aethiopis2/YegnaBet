import { Flame, Heart, ShieldCheck, Sparkles } from "lucide-react";

export const perferences = [
    {
        id: "match",
        title: "Find My Match",
        description: "Get personalized results",
        icon: Sparkles,
        route: '/find-my-match'
    },
    {
        id: "saved",
        title: "Saved",
        description: "Your favorite listings",
        icon: Heart,
        route: '/saved'
    },
    {
        id: "trending",
        title: "Trending",
        description: "Popular this week",
        icon: Flame,
        route: '/trending'
    },
    {
        id: "verified",
        title: "Verified",
        description: "Trusted and verified",
        icon: ShieldCheck,
        route: '/verified'
    },
]