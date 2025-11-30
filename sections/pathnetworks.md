


Path networks are the simplest non-trivial geometric networks: a sequence
of vertices connected by edges with no branching. Every internal vertex
has degree two and the endpoints have degree one. Geometrically the path
is a single polyline (polygonal chain) and all distances are measured
along that embedding.

<h2 class="font-display text-2xl font-bold text-left">Diameter after inserting a shortcut</h2>


<h3 class="font-display text-xl font-bold text-left">Problem and goal</h3>

We consider a polygonal path $P=(v_0,\dots,v_n)$ embedded in the plane
and a horizontal shortcut $s=pq$ with $p$ left of $q$. Our task
is to compute the diameter of the augmented network $P \cup s$,
$\mathrm{diam}(P \cup s)$, in $\mathcal{O}(n)$ time once the
intersection points between $s$ and $P$ are known.

<h3 class="font-display text-xl font-bold text-left">Structure of the path and intersection points</h3>

Let the drawing of the path be $P'$. The horizontal segment $s$
meets $P'$ in a finite, left-to-right ordered list of points
$
x_0,x_1,\dots,x_m
$
(sorted by $x$-coordinate). These intersections partition the path
into chains
$
C_0,C_1,\dots,C_m,
$
where each chain $C_i$ is the subpath of $P$ between $x_i$ and
$x_{i+1}$ (the extremal chains may be open on one side).

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full max-w-xs border-double" src="../../sections/figures/chain.png"  />
  <i class="text-md">Figure 5: chains induced by the shortcut</i>
</div>

<h3 class="font-display text-xl font-bold text-left">Precomputations</h3>

For each chain $C_i$ we compute and store the following values:

- **Left endpoint** $p_i^l$ and **right endpoint** $p_i^r$.  
- **Chain length**  
  $
  |C_i| = \text{length of the path segment from } p_i^l \text{ to } p_i^r.
  $
  (For $C_0$ and $C_m$ this equals the prefix/suffix lengths.)

- **Right reach**  
  $
  R_i = |p_i^r q|
  $
  (distance along the shortcut from the chain's right endpoint to $q$).

- **Left reach**  
  $
  L_i = |p_i^l p|.
  $

- **Internal contributor**  
  $
  D_i = \max\{\text{distance from } p_i^l \text{ to any point of } C_i\cup s_i\},
  $
  i.e. the farthest distance reachable inside the chain (and its local
  shortcut segment). This can be computed using cumulative lengths and
  the semiperimeter trick for the cycle $C_i \cup s_i$.

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full max-w-md border-double" src="../../sections/figures/parameters.png"  />
  <i class="text-md">Figure 6: Parameters represented</i>
</div>

All these arrays $(|C_i|,L_i,R_i,D_i)$ are computed in two linear
scans (prefix and suffix) of the path. Total preprocessing cost:
$\mathcal{O}(n)$.

<h3 class="font-display text-xl font-bold text-left">Distance through the shortcut (intuition)</h3>

For a chain $C_i$ with intersection endpoints $x_i,x_{i+1}$, the
distance between $x_i$ and $x_{i+1}$ along the horizontal shortcut is
simply $|x_i x_{i+1}|$. A typical candidate contribution for a chain is

$
\alpha_i = \max\{D_i + R_i , |x_i x_{i+1}| + R_i \},
$

where the two terms correspond to (1) staying on the path as far as
possible, then using the shortcut reach $R_i$, and (2) jumping across
the shortcut first then walking along the path. Every real candidate for
the final diameter is a linear combination of $|C_i|,L_i,R_i,D_i$.

<h3 class="font-display text-xl font-bold text-left">Three structural cases</h3>

When combining contributions from two chains $C_i$ and $C_j$ the
relative placements along $s$ fall into three canonical cases:

- **Disjoint chains** (their projections on $s$ do not overlap).  
  Candidate value:
  $D_i + R_i - R_j - |s_j| + D_j$.

- **Nested chains** (one chain's projection is strictly contained in the other).  
  Candidate value:
  $|C_i| - L_i - R_i + \beta_j, \quad
  \beta_j = |C_j| + L_j + R_j$.

- **Overlapping chains** (projections overlap but none contains the other).  
  Candidate value:
  $|C_i| - L_i + R_i + \gamma_j, \quad
  \gamma_j = |C_j| + L_j - R_j$.

These algebraic formulas are derived from decomposing the possible shortest
routes that use at most one crossing of the shortcut. They are local and
are combined globally by a sweep.

<div align="center" class="my-8 center ">
  <div class="w-full grid grid-cols-3 gap-1 justify-items-center">
      <p>Disjoint</p>
      <p>Overlapping</p>
      <p>Nested</p>
      <img class="rounded-lg border-2 w-full max-w-xs border-double h-48" src="../../sections/figures/disjoint.png"/>
      <img class="rounded-lg border-2 w-full max-w-xs border-double h-48" src="../../sections/figures/overlapping.png"/>
      <img class="rounded-lg border-2 w-full max-w-xs border-double h-48" src="../../sections/figures/nested.png"/>
  </div>
  <i class="text-md">Figure: geometric cases between chain projections</i>
</div>

<h3 class="font-display text-xl font-bold text-left">Linear sweep algorithm</h3>

The diameter of $P \cup s$ can be obtained with a single left-to-right
sweep along the ordered chains. During the sweep we maintain a small set
of extremal values (partial maxima) that allow us to evaluate each case
in constant time per chain:

- a running maximum of $\beta_j = |C_j|+L_j+R_j$,
- a running maximum of $\gamma_j = |C_j|+L_j-R_j$,
- a few additional local maxima used for disjoint-case evaluation
  (depending on the implementation you can keep $D_j$ +/- shifted
  terms).

At step $i$ the algorithm uses the stored maxima to compute the best
candidate brought by $C_i$ interacting with any earlier chain.
Because every chain is processed once and each update/evaluation costs
$\mathcal{O}(1)$, the sweep runs in $\mathcal{O}(n)$.

The overall structure is:

1. compute intersections $x_0,\dots,x_m$ and build chains $C_0\dots C_m$.
2. compute $|C_i|,L_i,R_i,D_i$ for all $i$ (two linear passes).
3. left-to-right sweep computing candidate values for the three cases,
   updating global maxima accordingly.
4. return the maximum candidate found.

<h3 class="font-display text-xl font-bold text-left">Pseudocode</h3>

<pre class="pseudocode">
function DIAMETER_WITH_HORIZONTAL_SHORTCUT(P, p, q):
    // STEP 0: preparatory data
    X = INTERSECTIONS(P, segment(p,q))            // x0..xm sorted by x
    Chains = BUILD_CHAINS(P, X)                  // C[0..m-1] between x_i and x_i+1

    // STEP 1: precompute metrics
    for i = 0 .. m-1:
        Clen[i] = PATH_LENGTH(C[i])
        pL[i], pR[i] = ENDPOINTS(C[i])
        L[i] = EUCLIDEAN_DISTANCE(pL[i], p)
        R[i] = EUCLIDEAN_DISTANCE(pR[i], q)
        D[i] = INTERNAL_MAX_DISTANCE(C[i], pL[i], segment_part_of_s) 
                // compute with cumulative distances / semiperimeter trick
    end for

    // STEP 2: sweep for diameter
    best = 0

    beta_max = -INF        // max of (|Cj| + Lj + Rj)
    gamma_max = -INF       // max of (|Cj| + Lj - Rj)
    aux_max_for_disjoint = -INF   // keep necessary D_j-based maxima

    for i = 0 .. m-1:
        // Evaluate nested case using beta_max
        if beta_max != -INF:
            val_nested = Clen[i] - L[i] - R[i] + beta_max
            best = max(best, val_nested)
        end if

        // Evaluate overlapping case using gamma_max
        if gamma_max != -INF:
            val_overlap = Clen[i] - L[i] + R[i] + gamma_max
            best = max(best, val_overlap)
        end if

        // Evaluate disjoint case using aux_max_for_disjoint
        // (aux_max_for_disjoint stores terms like D_j - R_j - |s_j| + D_j_variant)
        val_disjoint = D[i] + R[i] + aux_max_for_disjoint
        best = max(best, val_disjoint)

        // Update running maxima with chain i for future indices
        beta = Clen[i] + L[i] + R[i]
        gamma = Clen[i] + L[i] - R[i]
        beta_max = max(beta_max, beta)
        gamma_max = max(gamma_max, gamma)

        // Update aux structure for disjoint case:
        // aux_term = - R[i] - |s_i| + D[i]  (or whichever exact combination used)
        aux_term = - R[i] - LENGTH_OF_SHORTCUT_PROJ(C[i]) + D[i]
        aux_max_for_disjoint = max(aux_max_for_disjoint, aux_term)
    end for

    return best
</pre>

<h3 class="font-display text-xl font-bold text-left">Correctness sketch</h3>

Every pair of vertices in $(P \cup s)$ has a shortest path that uses at
most one crossing of $s$. By partitioning the path according to the
crossings and analyzing how a vertex in chain $C_i$ can reach vertices
in other chains with at most one crossing, we reduce the global diameter
computation to evaluating finite linear expressions per chain. The
left-to-right sweep enumerates those possibilities implicitly and
maintains the needed extremal terms—hence correctness.

<h3 class="font-display text-xl font-bold text-left">Complexity</h3>

- Intersection detection and building chains: $\mathcal{O}(n)$.
- Precomputing ($|C_i|,L_i,R_i,D_i$): $\mathcal{O}(n)$.  
- Left-to-right sweep (one pass, constant-time updates): $\mathcal{O}(n)$.

Therefore $\mathrm{diam}(P \cup s)$ is computed in $\mathcal{O}(n)$.

<h2 class="font-display text-2xl font-bold text-left">Finding optimal shortcut</h2>

The paper explores two types of optimal shortcuts: the optimal horizontal shortcuts and the optimal simple shortcuts.

The optimal horizontal shortcut algorithm finds a shortcut using the y-coordinate of the vertices. It can be found in $O(n² log n)$ time using O(n²) space where $n$ is the number of vertices. After a simple rotation, this algorithm allows to find an optimal shortcut in any direction.

The optimal simple shortcut algorithm restrict the shortcuts whose interior (which means that the endpoints are excluded) does not intersect $N_l$. The algorithm decide if a path $P_l$ has an optimal shortcut and computes one in $O(n²)$.



