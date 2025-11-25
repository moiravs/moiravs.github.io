# Background

This section is to give the necessary theoretical background on the concepts mentioned in the paper.

- A **geometric network** is an undirected graph whose vertices are points in $\mathbb{R}^2$ and whose edges are straight-line segments connecting the points. When edges' lengths are equal to their Euclidian distances (which means their length is exactly the Euclidian distance between their endpoints in the plane) and no edges cross, the network is said to be **plane** and **Euclidian**.

- The **diameter** denotes the maximum eccentricity among all points. It is represented as the following formula : $$diam(N) = \max_{a \in N} ecc (a).$$

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
