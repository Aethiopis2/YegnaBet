import type { TaxonomyNode } from "../../types/common/taxonomy";

/**
 * @description recursively collects all the leaf nodes from a given TaxonomyNode.
 * 
 * @param node root taxonomyNode to traverse tree from
 * @returns all the leaf nodes under the root node `node`
 */
export function getLeafNodes(node:TaxonomyNode) : TaxonomyNode[] {
    if (node.children.length === 0) {
        return [node];
    }

  return node.children.flatMap(getLeafNodes);
} // end getLeafNodes