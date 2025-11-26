We begin with a brief overview of the general problem then we will focus specifically on path networks. 

<h3 class="font-display text-xl font-bold text-left">Continuous</h3>

Specifically, we present an algorithm that, in polynomial time, determines whether a general network $N$ admits an optimal shortcut and, if so, computes one.

The core of the proof involves two main steps:

- 1. Region Decomposition: We begin by dividing the network into a polynomial number of "equivalent regions." This allows us to break down the problem into smaller, more manageable parts.

- 2. Shortcut Search within Regions: Within each region, we search for a simple shortcut. The calculation of the network's diameter, which is used to measure the performance improvement of the shortcut, is done differently depending on the characteristics of the "diametral points" (the points that define the longest paths) within that region.


We made a pseudo code of the algorithm:

<pre class="pseudocode">
function FIND_OPTIMAL_SHORTCUT(N):
    n = number of vertices in N

    # Step 1: Find equivalent lines (in other words, if the half 
    # planes that they define contain the same vertices of the network N_l)
    equivalent_lines = FIND_SET_OF_EQUIVALENT_LINES(N)

    # Step 2: Compute the set of regions Pe,e'(m)
    regions = {}
    for each line m that crosses e, e' in N:
        P = equivalent_lines[e,e'] # P = set of lines equivalent to m
        region = COMPUTE_REGION(e, e', m)
        regions[e, e', m] = region
    
    # Step 3: Compute the optimal shortcut for each region
    optimal_shortcut = None
    for each region Pe,e'(m) in regions:
        optimal_shortcut_in_region = COMPUTE_OPTIMAL_SHORTCUT(N, Pe,e'(m))
        if optimal_shortcut is None or optimal_shortcut_in_region.length < optimal_shortcut.length:
            optimal_shortcut = optimal_shortcut_in_region
    
    return optimal_shortcut

</pre>

The $O(n^{10})$ runtime of the algorithm is due to the problem's continuous nature. To find the optimal solution, the algorithm must exhaustively search the space of possible shortcuts, leading to a high computational cost.

<h3 class="font-display text-xl font-bold text-left">Discrete</h3>

In the discrete case, it is possible to compute the diameter of the network graph in $O(n²)$ time. To do this, it is sufficient to store the distances from each vertex to all other edges in the graph and to store the point on each edge where this distance is the maximum.


