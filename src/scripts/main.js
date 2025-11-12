marked.setOptions({
	gfm: true,
	breaks: false,
	headerIds: true,
	mangle: false,
});

const sections = [
	{ id: "abstract-content", url: "../../sections/abstract.md" },
	{ id: "theory-content", url: "../../sections/theory.md" },
	{ id: "background-content", url: "../../sections/background.md" },
];

function stripLeadingHeading(md) {
	// remove a single leading markdown heading line (example: "# Title" or "## Title")
	return md.replace(/^\s{0,3}#{1,6}\s.*(\r?\n)+/, "").trimStart();
}

function styleRenderedLists(container) {
	// ensure lists have visible bullets/numbering and sensible indentation
	container
		.querySelectorAll("ul")
		.forEach((el) =>
			el.classList.add("list-disc", "pl-6", "ml-2", "space-y-1")
		);
	container
		.querySelectorAll("ol")
		.forEach((el) =>
			el.classList.add("list-decimal", "pl-6", "ml-2", "space-y-1")
		);
}

async function loadSection({ id, url }) {
	const container = document.getElementById(id);
	if (!container) return console.warn("Missing container", id);
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		let md = await res.text();
		md = stripLeadingHeading(md);
		container.innerHTML = marked.parse(md);

		// render math (KaTeX auto-render) first
		if (window.renderMathInElement) {
			renderMathInElement(container, {
				delimiters: [
					{ left: "$$", right: "$$", display: true },
					{ left: "$", right: "$", display: false },
				],
				throwOnError: false,
			});
		}

		// style lists so bullets show even if some CSS resets them
		styleRenderedLists(container);
	} catch (err) {
		console.error("Failed to load", url, err);
		container.innerHTML = `<p class="text-sm text-red-600">Failed to load content.</p>`;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	sections.forEach(loadSection);
});
