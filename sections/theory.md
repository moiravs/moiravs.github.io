# Theory & Explanation

Here we explain the mathematical and conceptual background for the paper's subject.

- The _locus_ of the network, denoted $N_l$, is the set of all points **contained** in the network, including vertices and all points along edges : $$N_l = V(N) \cup \bigcup_{e \in E(N)} \{p_e\},$$where $p_e$ represents any point along edge $e$.

- A _shortcut_ is a line segment connecting two points on the network that is **not already part of the network**.

  - Consider a line $y = ax+b$ intersecting 2 edges $e$ and $e'$ at points $p$ and $q$, with endpoints $w \in e$ and $z \in e'$. The **path** using this shortcut is given by $$path = d(w,p) + d(p,q) + d(q,z),$$where $d(\cdot, \cdot)$ denotes the shortest-path distance along the network.

  - To evaluate the impact of this shortcut on the network's diameter, we focus on a fixed diametral pair $(\alpha, \beta) \subseteq V(N) \cup E(N)$. Given the line parameters $a$ and $b$, and the corresponding intersection points $w$ and $z$, we define the **shortcut function** :$$f_{w,z}^{\alpha, \beta} (a,b) = ecc(w, \alpha) + path + ecc(z,\beta),$$which quantifies the effect of the shortcut on the distance between $\alpha$ and $\beta$, and thus on the overall network diameter.

There are two types of networks: general networks and path networks. Path networks is a subset of general networks that represent paths, such as the following image:

<div align="center" class="my-8 center ">
  <img class="rounded-lg border-2 w-full  max-w-xs border-double" src="../../sections/figures/pathnetworks.png"  />
  <caption class="m-px italic font-sans antialiased text-xs text-current mt-2 block text-center">Figure 4: Example of path network</caption>
</div>


