export class Vertex {
	constructor(x, y, label = null) {
		this._x = Number(x);
		this._y = Number(y);
		this._id =
			typeof crypto !== "undefined" && crypto.randomUUID
				? crypto.randomUUID()
				: "v-" + Math.random().toString(36).slice(2, 9);
		this._label = label ?? this._id;
	}

	get coordinates() {
		return [this._x, this._y];
	}

	equals(other) {
		return other instanceof Vertex && this._id === other._id;
	}

	toString() {
		return `Vertex(${this._label}) @ (${this._x}, ${this._y})`;
	}

	static euclideanDistance(c1, c2) {
		const dx = c1[0] - c2[0];
		const dy = c1[1] - c2[1];
		return Math.hypot(dx, dy);
	}
}

export class Edge {
	constructor(u, v) {
		this._u = u;
		this._v = v;
		this._length = Vertex.euclideanDistance(u.coordinates, v.coordinates);
	}

	get vertices() {
		return [this._u, this._v];
	}

	get length() {
		return this._length;
	}

	equals(other) {
		if (!(other instanceof Edge)) return false;
		return (
			(this._u.equals(other._u) && this._v.equals(other._v)) ||
			(this._u.equals(other._v) && this._v.equals(other._u))
		);
	}

	toString() {
		const [u, v] = this.vertices;
		return `Edge(${u.coordinates} -- ${
			v.coordinates
		}, length=${this._length.toFixed(2)})`;
	}
}

export class Network {
	constructor() {
		this._vertices = [];
		this._edges = [];
	}

	addVertex(vertex) {
		this._vertices.push(vertex);
	}

	addEdge(v1, v2) {
		const edge = new Edge(v1, v2);
		this._edges.push(edge);
		return edge;
	}

	get vertices() {
		return this._vertices.slice();
	}

	get edges() {
		return this._edges.slice();
	}
}
