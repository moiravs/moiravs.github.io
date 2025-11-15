import { NetworkShortcutUtils } from "./network_ds.js";
import { Heap } from "heap-js";

/**
 * Utility class for general network shortcuts
 */
class GeneralNetworkShortcutUtils {
	/**
	 * Return a point along edge at ratio t in [0,1] (0=u, 1=v)
	 * @param {Edge} edge
	 * @param {number} t
	 * @return {[number, number]}
	 */
	static _point_on_edge(edge, t) {
		const { u, v } = edge.vertices;
		x = u.coordinates[0] + t * (v.coordinates[0] - u.coordinates[0]);
		y = u.coordinates[1] + t * (v.coordinates[1] - u.coordinates[1]);
		return [x, y];
	}

	/**
	 * Check if point p lies on closed segment seg (with small tolerance).
	 * @param {[number, number]} p
	 * @param {[[number, number], [number, number]]} seg
	 * @returns {boolean}
	 */
	static point_on_segment(p, seg) {
		const [[ax, ay], [bx, by]] = seg;
		const px = p[0],
			py = p[1];

		const cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax);
		const eps = 1e-8;
		if (Math.abs(cross) > eps) return false; // not collinear

		// Check bounding box
		const [minX, maxX] = [Math.min(ax, bx) - eps, Math.max(ax, bx) + eps];
		const [minY, maxY] = [Math.min(ay, by) - eps, Math.max(ay, by) + eps];

		return px >= minX && px <= maxX && py >= minY && py <= maxY;
	}

	/**
	 * Intersection of two closed segments A=(ax,ay)-(bx,by) and C=(cx,cy)-(dx,dy).
        Returns intersection point (x,y) if they intersect (including endpoints), else None.
        Robust enough for our use (treats near-parallel as no intersection unless endpoints touch).
	 * @param {[[number, number], [number, number]]} segment_a
	 * @param {[[number, number], [number, number]]} segment_b
	 * @returns { [number, number] | null }
	 */
	static segment_intersection(segment_a, segment_b) {
		const [[ax, ay], [bx, by]] = segment_a;
		const [[cx, cy], [dx, dy]] = segment_b;

		A_dx = bx - ax;
		A_dy = by - ay;
		C_dx = dx - cx;
		C_dy = dy - cy;

		denom = A_dx * C_dy - A_dy * C_dx;
		const eps = 1e-12;
		if (Math.abs(denom) < eps) {
			// parallel or collinear: treat endpoint-to-segment touches as valid
			for (const [px, py] of [
				[ax, ay],
				[bx, by],
			]) {
				if (GeneralNetworkShortcutUtils.point_on_segment([px, py], segment_b)) {
					return [px, py];
				}
			}

			for (const [px, py] of [
				[cx, cy],
				[dx, dy],
			]) {
				if (GeneralNetworkShortcutUtils.point_on_segment([px, py], segment_a)) {
					return [px, py];
				}
			}

			return null;
		}

		const t = ((cx - ax) * C_dy - (cy - ay) * C_dx) / denom;
		const u = ((cx - ax) * A_dy - (cy - ay) * A_dx) / denom;

		if (t >= -eps && t <= 1 + eps && u >= -eps && u <= 1 + eps) {
			const ix = ax + t * A_dx;
			const iy = ay + t * A_dy;
			return [ix, iy];
		}

		return null;
	}
}

/**
 * Class implementing shortcut finding algorithm  ~ O(n^10) for general networks
 */
class GeneralNetworkShortcut {
	/**
	 * Implements the dijkstra algorithm to compute the shortest paths from source to all other vertices
	 * @param {Network} network
	 * @param {Vertex} source
	 * @returns {Map<Vertex, float>} shortest paths from source to each vertex
	 */
	static dijkstra(network, source) {
		const distances = new Map();
		for (const vertex of network.vertices) {
			distances.set(vertex, Infinity);
		}

		distances.set(source, 0);
		let heap = [[0, source]]; // min-heap of [distance, vertex]

		while (heap) {
			const { d, u } = Heap.pop(heap); // vertex with smallest distance
			if (d > distances.get(u)) {
				continue;
			}

			for (const edge of network.edges) {
				if (edge.vertices.includes(u)) {
					const v =
						edge.vertices[1] === u ? edge.vertices[0] : edge.vertices[1];
					const alt = distances.get(u) + edge.length;
					if (alt < distances.get(v)) {
						distances.set(v, alt);
						Heap.heappush(heap, [alt, v]);
					}
				}
			}
		}

		return distances;
	}

	/**
	 * Compute all-pairs shortest paths using Dijkstra's algorithm from each vertex
	 * @param {Network} network
	 * @returns {Map<Vertex, Map<Vertex, float>>} shortest paths between all vertex pairs
	 */
	static allPairsShortestPaths(network) {}
}
