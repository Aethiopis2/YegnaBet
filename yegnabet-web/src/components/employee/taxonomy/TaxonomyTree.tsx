import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Plus,
} from "lucide-react";

import type { TaxonomyNode } from "./TaxonomyTypes";
import { TaxonomyTreeNode } from "./TaxonomyTreeNode";

interface Props {
  nodes: TaxonomyNode[];

  selectedId: string | null;

  onSelect: (node: TaxonomyNode) => void;

  onMove: (
    draggedId: string,
    targetId: string
  ) => void;

  onAddChild: (parentId: string) => void;
}

export function TaxonomyTree({
  nodes,
  selectedId,
  onSelect,
  onMove,
  onAddChild,
}: Props) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TaxonomyTreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          onMove={onMove}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
}