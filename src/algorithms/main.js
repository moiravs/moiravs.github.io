import { Network, Vertex } from "./network_ds.js";
import { GeneralNetworkShortcut } from "./general_network_shortcut.js";

function main() {
	const n = new Network();

	const v1 = new Vertex(0.0, 0.0, "A");
	const v2 = new Vertex(2.0, 0.0, "B");
	const v3 = new Vertex(2.0, 2.0, "C");
	const v4 = new Vertex(1.5, 0.5, "D");

	n.addVertex(v1);
	n.addVertex(v2);
	n.addVertex(v3);
	n.addVertex(v4);

	n.addEdge(v1, v2);
	n.addEdge(v2, v3);
	n.addEdge(v3, v4);
	n.addEdge(v4, v1);

	const result = GeneralNetworkShortcut.findOptimalShortcut(n);
	console.log(result);
}

if (typeof window === "undefined") {
	main();
} else {
	window.addEventListener("load", main);
}
