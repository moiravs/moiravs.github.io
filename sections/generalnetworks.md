

The paper states that one can always determine in $\cal O(n^k)$ time if the network $N_l$ has an optimal shortcut and compute one.

The pseudo code of the algorithm:

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

This algorithm takes $O(n^{10})$ time. It takes a lot of time because the problem is continuous, we need to try every possible shortcut.
