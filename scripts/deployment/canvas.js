'use strict';

/**
 * canvas.js — minimal JSONCanvas reader for KCD deployment tooling.
 *
 * A canvas is { nodes:[{ id, text, styleAttributes:{ shape } }], edges:[{ fromNode, toNode }] }.
 * Edges are directed parent -> child: `fromNode` is the parent, `toNode` is the child.
 * (e.g. Project Root -> _Claude -> generators -> {generatorname} -> {generatorname}.md)
 *
 * Convention encoded in the canvas (locked):
 *   - straight box (no shape)      = folder
 *   - parallelogram (shape set)    = file
 *   - {curly} name in node text    = a per-instance shape, not a literal path
 *
 * This is application-layer tooling (it folds into Starmind). It is NOT a kcd artifact.
 * Reusable by the future deploy script; flush.js uses it today to derive a delete whitelist.
 */

const fs = require('fs');

function load(canvasPath) {
  const data = JSON.parse(fs.readFileSync(canvasPath, 'utf8'));
  const nodes = data.nodes || [];
  const edges = data.edges || [];
  return { nodes, edges, byId: new Map(nodes.map((n) => [n.id, n])) };
}

/** Clean folder/file name from a node's text, stripping human annotations.
 *  "kcd ( shouldn't change ever! )" -> "kcd"   |   "generators" -> "generators" */
function nameOf(node) {
  return String(node.text || '').trim().split(/\s+/)[0];
}

/** A node is a file iff it is drawn as a parallelogram. */
function isFile(node) {
  return !!(node.styleAttributes && node.styleAttributes.shape === 'parallelogram');
}

/** A per-instance placeholder node, e.g. {lensname} — not a literal path. */
function isPlaceholder(node) {
  return /\{.*\}/.test(String(node.text || ''));
}

/** First node whose trimmed text exactly equals `text`. */
function findByText(canvas, text) {
  return canvas.nodes.find((n) => String(n.text || '').trim() === text);
}

/** Direct children of a node (the nodes its edges point to). */
function childrenOf(canvas, nodeId) {
  return canvas.edges
    .filter((e) => e.fromNode === nodeId)
    .map((e) => canvas.byId.get(e.toNode))
    .filter(Boolean);
}

/** The single parent of a node (the node whose edge points to it), or null at the root. */
function parentOf(canvas, nodeId) {
  const e = canvas.edges.find((edge) => edge.toNode === nodeId);
  return e ? canvas.byId.get(e.fromNode) : null;
}

/**
 * Full path from the deployment root down to `node`, as name segments.
 * Walks parent edges up; the root node (Project Root — it has no parent) is excluded,
 * so paths start at "_Claude". e.g. the AI folder under work/{lensname} ->
 *   ["_Claude", "work", "{lensname}", "AI"]
 * Placeholder segments are kept verbatim so callers can substitute an instance name.
 */
function pathOf(canvas, node) {
  const segs = [];
  const seen = new Set();                       // cycle guard
  let cur = node;
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    const parent = parentOf(canvas, cur.id);
    if (!parent) break;                         // cur is the root — don't include it
    segs.unshift(nameOf(cur));
    cur = parent;
  }
  return segs;
}

/**
 * Every node belonging to a placeholder identity, ANYWHERE in the canvas — i.e. whose
 * path contains the placeholder segment. This is the broad, by-identity match: a single
 * identity like "{lensname}" lives in several disconnected branches (lenses/, work/, logs/)
 * and they all come back together.
 */
function instanceNodes(canvas, placeholder) {
  return canvas.nodes.filter((n) => pathOf(canvas, n).includes(placeholder));
}

module.exports = {
  load, nameOf, isFile, isPlaceholder, findByText, childrenOf, parentOf, pathOf, instanceNodes,
};
