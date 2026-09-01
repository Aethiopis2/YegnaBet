import {
  BedDouble,
  Bath,
  Car,
  Maximize,
  Home,
  LandPlot,
  Building2,
  Sofa,
  ShieldCheck,
  Calendar,
  Ruler,
  CircleHelp,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";


export function resolveIcon(
  key?: string
): LucideIcon {

  const value =
    key?.toLowerCase().trim() ?? "";


  if (
    value.includes("bedroom") ||
    value.includes("bed")
  ) {
    return BedDouble;
  }


  if (
    value.includes("bathroom") ||
    value.includes("bath")
  ) {
    return Bath;
  }


  if (
    value.includes("parking") ||
    value.includes("car")
  ) {
    return Car;
  }


  if (
    value.includes("area") ||
    value.includes("size") ||
    value.includes("square") ||
    value.includes("floor_area")
  ) {
    return Maximize;
  }


  if (
    value.includes("land") ||
    value.includes("plot")
  ) {
    return LandPlot;
  }


  if (
    value.includes("apartment") ||
    value.includes("unit")
  ) {
    return Building2;
  }


  if (
    value.includes("house") ||
    value.includes("home")
  ) {
    return Home;
  }


  if (
    value.includes("furnished") ||
    value.includes("furniture")
  ) {
    return Sofa;
  }


  if (
    value.includes("verified")
  ) {
    return ShieldCheck;
  }


  if (
    value.includes("date") ||
    value.includes("year")
  ) {
    return Calendar;
  }


  if (
    value.includes("length") ||
    value.includes("width") ||
    value.includes("height")
  ) {
    return Ruler;
  }


  return CircleHelp;
}