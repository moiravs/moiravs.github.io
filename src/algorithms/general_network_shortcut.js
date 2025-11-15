import { Edge, Network, Vertex } from "./network_ds.js";
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
			const top = heap.pop(); // vertex with smallest distance

			if (!top) break;
			const [d, u] = top;
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
	static allPairsShortestPaths(network) {
		const allPaths = new Map();
		for (const vertex of network.vertices) {
			const distances = GeneralNetworkShortcut.dijkstra(network, vertex);
			allPaths.set(vertex, distances);
		}

		return allPaths;
	}

	/**
	 * Find all diametral pairs in the network, given all-pairs shortest paths.
	 * @param {Network} network
	 * @param {Map<Vertex, Map<Vertex, float>>} allPairsPaths
	 * @returns {Tuple[[Tuple[Vertex, Vertex]], float]} list of diametral pairs
	 */
	static diametralPairs(network, allPairsPaths) {
		let max_distance = 0;
		const pairs = [];

		const vertices = network.vertices;
		for (let i = 0; i < vertices.length; i++) {
			for (let j = i + 1; j < vertices.length; j++) {
				const u = vertices[i];
				const v = vertices[j];

				const distancesToU = allPairsPaths.get(u);
				const d = distancesToU.get(v);

				if (d > max_distance) {
					max_distance = d;
					pairs.length = 0; // reset pairs list
					pairs.push([u, v]);
				} else if (d === max_distance) {
					pairs.push([u, v]);
				}
			}
		}

		return [pairs, max_distance];
	}

	/**
	 * Compute f_{w,z}^{alpha,beta} for candidate shortcut (p,q) relative to diametral pair (alpha,beta).
	 * @param {Network} network
	 * @param {Vertex} p
	 * @param {Vertex} q
	 * @param {[Vertex, Vertex]} diametralPair
	 * @param {Map<Vertex, Map<Vertex, float>>} allPairsPaths
	 * @returns {number}
	 */
	static computeShortcutFunction(network, p, q, diametralPair, allPairsPaths) {
		const [alpha, beta] = diametralPair;

		// Compute distances from alpha to p and from beta to q (d(alpha, p) and d(beta, q))
		const apsp_alpha = allPairsPaths.get(alpha);
		const apsp_beta = allPairsPaths.get(beta);

		let min_d_alpha_vertex = Infinity;
		let min_d_beta_vertex = Infinity;

		for (const vertex of network.vertices) {
			const d_alpha_vertex =
				apsp_alpha.get(vertex) +
				Vertex.euclideanDistance(vertex.coordinates, p.coordinates);
			const d_beta_vertex =
				apsp_beta.get(vertex) +
				Vertex.euclideanDistance(vertex.coordinates, q.coordinates);

			if (d_alpha_vertex < min_d_alpha_vertex) {
				min_d_alpha_vertex = d_alpha_vertex;
			}
			if (d_beta_vertex < min_d_beta_vertex) {
				min_d_beta_vertex = d_beta_vertex;
			}
		}

		const shortcut_length = Vertex.euclideanDistance(
			p.coordinates,
			q.coordinates
		);

		return min_d_alpha_vertex + shortcut_length + min_d_beta_vertex;
	}

	/**
	 *
	 * @param {Network} network
	 * @param {[Vertex, Vertex]} diametralPair
	 * @returns {}
	 */
	static enumerateHourglassRegions(network, diametralPair) {
		return;
	}

	/**
	 *
	 * @param {Network} network
	 * @param {[Vertex, Vertex]} diametralPair
	 * @param {} region,
	 * @param {Map<Vertex, Map<Vertex, float>>} allPairsPaths
	 * @returns {}
	 */
	static processHourglassRegion(network, diametralPair, region, allPairsPaths) {
		return;
	}

	/**
	 * Find the optimal shortcut (p,q) to add to the network minimizing the diameter.
	 * @param {Network} network
	 * @returns {[[Vertex, Vertex], number]} optimal shortcut (p,q) and resulting diameter
	 */
	static findOptimalShortcut(network) {
		const allPairsPaths = GeneralNetworkShortcut.allPairsShortestPaths(network);

		const diametralPairs = GeneralNetworkShortcut.diametralPairs(
			network,
			allPairsPaths
		)[0];

		const diameterInitial = GeneralNetworkShortcut.diametralPairs(
			network,
			allPairsPaths
		)[1];
		console.log(
			`[i] Initial diameter: ${diameterInitial}, diametral pairs: ${JSON.stringify(
				diametralPairs
			)}`
		);
	}
}

export { GeneralNetworkShortcut, GeneralNetworkShortcutUtils };
