Path networks are essentially a simpler special case of general networks.
They consist of a sequence of vertices connected by edges and no branching, which means every internal vertex has degree 2, endpoints have degree 1.

Visually, it is basically represented as a polyline : a single, non-branching route.

The paper shows that for path networks, the computation of the diameter of a network after adding a shortcut, can be computed in $\Theta (n)$.

Moreover, for every path $\cal P_l$ with $n$ vertices, it is possible to find an optimal horizontal shortcut in $\cal O (n^2 \log n)$ time, using $\cal O (n^2)$ space.

Another interesting result is the following. For a network $\cal N$ whose locus $\cal N_l$ admits a simple shortcut, and a network $\cal \overline N$ resulting from adding all edges of the convex hull of $V(\cal N)$ to $\cal N$ : if all faces of $\cal \overline N$ are convex, then $\cal N_l$ has an optimal simple shortcut.
