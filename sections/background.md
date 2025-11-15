# Background

This section is to give the necessary theoretical background on the concepts mentioned in the paper.

- A **geometric network** is an undirected graph whose vertices are points in $\mathbb{R}^2$ and whose edges are straight-line segments connecting the points. When edges' lengths are equal to their Euclidian distances (which means their length is exactly the Euclidian distance between their endpoints in the plane) and no edges cross, the network is said to be **plane** and **Euclidian**.

- The **highway model** refers to a way of seeing shortcuts only through their endpoints. It means that, when forming paths in the network, those paths can only use shortcuts through their endpoints.

- The **planar model**, on the other hand, allows crossings, and every crossing becomes a vertex in the network. Paths may thus enter/leave the shortcut anywhere.


<div align="center" class="gap-8">

  <img class="rounded-lg border-2 border-double" src="../../sections/figures/diameter.png"  />

  <caption class="m-px italic font-sans antialiased text-sm text-current mt-2 block text-center">Figure 1: The diameter of the network here is 3.</caption>

</div>



- The **diameter** is represented as the following formula : $$diam(N) = \max_{a \in N} ecc (a).$$ which denotes the maximum eccentricity among all points.

<p align="center">

<div class="grid grid-cols-2 gap-4">
  <img class="rounded-lg border-2 border-double" src="../../sections/figures/nonplanarmodel.png"  />
  <img class="rounded-lg border-2 border-double" src="../../sections/figures/planarmodel.png"  />

  <caption class="italic font-sans antialiased text-sm text-current mt-2 block text-center">Figure 1: The diameter of the network here is 3.</caption>
</div>
</p>

- An **optimal shortcut** is a segment $S$ minimizing $diam(N \cup S)$ ($N \cup S$ can be seen as a new road network after building the shortcut $S$). Distances between points, after building the shortcut, can then be measured along the edges of $N \cup S$, meaning paths can include portions of $S$ if that makes them shorter.
