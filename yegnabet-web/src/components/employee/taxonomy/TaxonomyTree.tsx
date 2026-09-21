import { TaxonomyTreeNode } from "./TaxonomyTreeNode";
import type { TaxonomyNodeFront } from "../../../types/common/taxonomy";

interface Props {
  nodes: TaxonomyNodeFront[];

  selectedId: string | null;

  onSelect: (node: TaxonomyNodeFront) => void;

  onMove: (
    draggedId: string,
    targetId: string
  ) => void;

  onAddChild: (parentId: string) => void;
}

export function flattenTree(
  nodes: TaxonomyNodeFront[]
): TaxonomyNodeFront[] {
  const result: TaxonomyNodeFront[] = [];

  function visit(node: TaxonomyNodeFront) {
    result.push(node);

    for (const child of node.children) {
      visit(child);
    }
  }

  for (const node of nodes) {
    visit(node);
  }

  return result;
}

export function containsNode(node: TaxonomyNodeFront, id: string): boolean {
  if (node.id === id)
    return true;

  return node.children.some(
    child => containsNode(child, id)
  );
}

export function isDescendant(
  node: TaxonomyNodeFront,
  ancestorId: string,
  candidateId: string
): boolean {
  if (node.id !== ancestorId)
    return false;

  return containsNode(node, candidateId);
}


export function getDescendantIds(
  node: TaxonomyNodeFront
): Set<string> {
  const ids = new Set<string>();

  function visit(current: TaxonomyNodeFront) {
    for (const child of current.children) {
      ids.add(child.id);
      visit(child);
    }
  }

  visit(node);

  return ids;
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