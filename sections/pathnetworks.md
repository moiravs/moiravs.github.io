
Path networks are essentially a simpler special case of general networks.
They consist of a sequence of vertices connected by edges and no branching, which means every internal vertex has degree 2, endpoints have degree 1.

Visually, it is basically represented as a polyline : a single, non-branching route.


We now summarize the algorithm that computes the diameter of a path $P$
after the insertion of a horizontal shortcut $s = pq$. The network here
is a single simple path, represented by a polygonal chain
$P = (v_0, v_1, \ldots, v_n)$ embedded in the plane.\
The objective is to compute $$\mathrm{diam}(P \cup s),$$ the diameter of
the augmented network, in $\mathcal{O}(n)$ time once intersection points
are known.

<h3 class="text-xl font-bold text-left">Structure of the Path and Intersection Points</h3>


Let the shortcut $s$ be a horizontal segment delimited by $p$ (on the left) and $q$ (on the right). Let $P'$ be the drawing of
the path in the plane. The segment $s$ intersects $P'$ at a finite,
ordered sequence of points $$x_0, x_1, \ldots, x_m,$$ sorted from left
to right by $x$-coordinate. This sorting is sometimes referred to as a
*Jordan sort*, but since $s$ is horizontal, it reduces to a standard
numeric sort.\
These intersections partition the path $P$ into **chains**
$$C_0, C_1, \ldots, C_m,$$ where each chain $C_i$ is the portion of the
path between $x_i$ and $x_{i+1}$ (possibly degenerate for the extremal
ones).

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full  max-w-xs border-double" src="../../sections/figures/chain.png"  />
  <caption class="m-px italic font-sans antialiased text-sm text-current mt-2 block text-center"></caption>
</div>



<h3 class="text-xl font-bold text-left">Precomputations</h3>



For each chain $C_i$, we have:

- The **left endpoint of the chain** $p_{i}^l$.
- The **right endpoint of the chain** $p_{i}^r$.
- The **chain length**
    $$|C_i| = \text{length of the path segment of } P \text{ from } p_{i}^l \text{ to } p_{i}^r$$

    For $C_0$ and $C_m$, the chain is "open" at one side, so $|C_0|$ and
    $|C_m|$ are simply the lengths of the prefix and suffix of the path.

-   The **reach value**
    $$R_i = \max\{\text{distance along } s \text{ from } p_{i}^r \text{(the right endpoint of the chain) to } q \text{, the right endpoint of s} }.$$ 
    In mathematical terms, we write this $R_i = |p_{i}^r q|$

-   $$L_i = \max\{\text{distance along } s \text{ from } p_{i}^l \text{(the left endpoint of the chain) to } q \text{, the left endpoint of s} }.$$ 
    In mathematical terms, we write this $L_i = |p_{i}^l p|$

-   $D_i$ corresponds to the maximum distance between $p_{i}^l$ to its furthest point called $p_{i}^{-l}$ on $C_i$ ∪ $s_i$. We can compute this easily using the semiperimeter of $C_i$ ∪ $s_i$.

Both arrays $(D_i)$ and $(R_i)$ are computed in overall linear time by
performing a prefix and suffix sweep on the path.

<h3 class="text-xl font-bold text-left">Distance Through the Shortcut</h3>


For any chain $C_i$ (with endpoints $x_i$ and $x_{i+1}$), the distance
between these two points *using the shortcut* is simply
$$|x_i x_{i+1}| ,$$ their Euclidean distance along the horizontal
shortcut.\
The diameter contributions involving the shortcut come from distances of
a vertex reaching a point on another chain using one crossing of $s$:
$$\alpha_i = \max\{D_i + R_i,\; |x_i x_{i+1}| + R_i\}.$$

Intuitively:

-   $D_i + R_i$ corresponds to staying on the original path.

-   $|x_i x_{i+1}| + R_i$ corresponds to "jumping" across the shortcut
    and then walking along the path.

<h3 class="text-xl font-bold text-left">Linear Sweep to Compute the Diameter</h3>


The key result is that the diameter of $P \cup s$ is obtained by a
single left-to-right sweep computing.

There are three different cases:
- Disjoint case
- Nested case 
- Overlapping case


<div align="center" class="my-8 center ">
<div class="w-full grid grid-cols-3 gap-1 justify-items-center">
    <p>Disjoint</p>
    <p>Overlapping</p>
    <p>Nested</p>
    <img class="rounded-lg border-2  w-full  max-w-xs border-double h-48" src="../../sections/figures/disjoint.png"/>
    <img class="rounded-lg border-2  w-full  max-w-xs border-double h-48" src="../../sections/figures/overlapping.png"/>
    <img class="rounded-lg border-2  w-full  max-w-xs border-double h-48" src="../../sections/figures/nested.png"/>

</div>




<h3 class="text-xl font-bold text-left">Final Complexity</h3>


-   Intersection detection and sorting along a horizontal shortcut:
    $\mathcal{O}(n)$.

-   Chain lengths $D_i$ and reach values $R_i$: $\mathcal{O}(n)$.

-   Sweep to compute all $\alpha_i$: $\mathcal{O}(n)$.

Therefore,
$$\mathrm{diam}(P \cup s) \text{ is computed in } \mathcal{O}(n).$$

