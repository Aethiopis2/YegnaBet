import {
  BriefcaseBusiness,
  Building2,
  Folder,
  FolderTree,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { TaxonomyNodeFront, EmployeeTaxonomyNodeDto } from "./../common/taxonomy";

const iconMap: Record<string, LucideIcon> = {
  property: Building2,
  service: Wrench,
  professional: Users,
  business: BriefcaseBusiness,
};

function getIcon(slug: string): LucideIcon {
  return iconMap[slug.toLowerCase()] ?? Folder;
}

export function mapTaxonomyNode(dto: EmployeeTaxonomyNodeDto): TaxonomyNodeFront {
  return {
    id: String(dto.id),
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    icon: getIcon(dto.slug),
    active: dto.isActive,
    parentId:
      dto.parentId === null
        ? null
        : String(dto.parentId),
    sortOrder: dto.sortOrder,
    listingCount: dto.listingCount,
    attributes: [],
    children: dto.children.map(mapTaxonomyNode),
  };
}

export function mapTaxonomyTree(dto: EmployeeTaxonomyNodeDto[]): TaxonomyNodeFront[] {
  return dto.map(mapTaxonomyNode);
}