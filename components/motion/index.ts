export { MotionProvider } from "./MotionProvider";
export {
  m,
  AnimatePresence,
  useReducedMotion,
  LayoutGroup,
} from "framer-motion";

export const springConfigs = {
  snappy: { type: "spring", stiffness: 300, damping: 30 } as const,
  smooth: { type: "spring", stiffness: 120, damping: 20 } as const,
  gentle: { type: "spring", stiffness: 80, damping: 20 } as const,
} as const;

export const viewportSettings = {
  once: { once: true, margin: "-50px" } as const,
  onceDeep: { once: true, margin: "-100px" } as const,
} as const;
