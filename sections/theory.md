# Theory & Explanation

Here we explain the mathematical and conceptual background for the paper's subject.

- The _locus_ of the network, denoted $N_l$, is the set of all points on the network, in other words, vertices and all points along edges : $$N_l = V(N) \cup \bigcup_{e \in E(N)} \{p_e\},$$where $p_e$ represents any point along edge $e$.

- A **geometric network** is an undirected graph whose vertices are points in $\mathbb{R}^2$ and whose edges are straight-line segments connecting the points. When edges' lengths are equal to their Euclidian distances (which means their length is exactly the Euclidian distance between their endpoints in the plane) and no edges cross, the network is said to be **plane** and **Euclidian**. In this paper, we assume that all network are *Euclidian networks*, which mean that the lengths of the edges is the Euclidian distance between their endpoints.

- The **diameter** of network $N$ denotes the maximum eccentricity among all points. It is represented as the following formula : $$diam(N) = \max_{a \in N} ecc (a).$$

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full  max-w-xs border-double" src="../../sections/figures/diameter.png"  />
  <i class="text-md"text-md"m-px italic font-sans antialiased text-sm text-current mt-2 block text-center">Figure 1: The diameter of the network here is 3.</i>
</div>

- The **highway model** refers to a way of seeing shortcuts only through their endpoints. It means that, when forming paths in the network, those paths can only use shortcuts through their endpoints. The point of adding shortcuts is to improve the diameter of a graph.

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full  max-w-xs border-double" src="../../sections/figures/highwaymodel.png"  />
  <i class="text-md"italic">Figure 2: The highway model, with a shortcut in blue, that improves the diameter.</i>
</div>

- The **planar model**, on the other hand, allows crossings, and every crossing becomes a vertex in the network. Paths may thus enter/leave the shortcut anywhere.

<div align="center" class="my-8 center ">
<div class="w-full grid grid-cols-2 gap-4 justify-items-center">
    <img class="rounded-lg border-2  w-full  max-w-xs border-double" src="../../sections/figures/nonplanarmodel.png"/>
    <img class="rounded-lg border-2  w-full  max-w-xs border-double" src="../../sections/figures/planarmodel.png"/>

</div>
    <i class="text-md">Figure 3: A non planar model(on the left) vs A planar model (on the right)</i>

</div>

- An **optimal shortcut** is a segment $S$ minimizing $diam(N \cup S)$ ($N \cup S$ can be seen as a new road network after building the shortcut $S$). Distances between points, after building the shortcut, can then be measured along the edges of $N \cup S$, meaning paths can include portions of $S$ if that makes them shorter.

- A path P between two points $a,b$ is a sequence such that every vertex except $a$ and $b$ have a degree 2 and $a$ and $b$ have a degree 1. **Path networks** are a subset of general networks that represent paths, such as the following image:

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full  max-w-xs border-double" src="../../sections/figures/pathnetworks.png"  />
  <i class="text-md">Figure 4: Example of path network</i>
</div>



- A _shortcut_ is a line segment connecting two points on the network that is **not already part of the network**.

  - Consider a line $y = ax+b$ intersecting 2 edges $e$ and $e'$ at points $p$ and $q$, with endpoints $w \in e$ and $z \in e'$. The **path** using this shortcut is given by $$path = d(w,p) + d(p,q) + d(q,z),$$where $d(\cdot, \cdot)$ denotes the shortest-path distance along the network.

  - To evaluate the impact of this shortcut on the network's diameter, we focus on a fixed diametral pair $(\alpha, \beta) \subseteq V(N) \cup E(N)$. Given the line parameters $a$ and $b$, and the corresponding intersection points $w$ and $z$, we define the **shortcut function** :$$f_{w,z}^{\alpha, \beta} (a,b) = ecc(w, \alpha) + path + ecc(z,\beta),$$which quantifies the effect of the shortcut on the distance between $\alpha$ and $\beta$, and thus on the overall network diameter.




