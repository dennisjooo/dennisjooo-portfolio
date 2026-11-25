let registered = false;

export async function loadGsapWithScrollTrigger() {
  const [gsap, { ScrollTrigger }] = await Promise.all([
    import("gsap").then((mod) => mod.default),
    import("gsap/ScrollTrigger"),
  ]);

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return { gsap, ScrollTrigger };
}
