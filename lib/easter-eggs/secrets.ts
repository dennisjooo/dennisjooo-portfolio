import {
  Briefcase,
  Coffee,
  Gift,
  GitBranch,
  Ghost,
  Hash,
  Terminal,
} from "lucide-react";
import type { SecretDefinition } from "./types";

const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? "dev";

export const PALETTE_SECRETS: SecretDefinition[] = [
  {
    id: "rickroll",
    triggers: ["rick", "bitcoin", "free"],
    label: "Claim Free Bitcoin",
    searchValue: "free bitcoin rickroll claim",
    icon: Gift,
    action: {
      type: "openUrl",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    id: "sudo",
    triggers: ["sudo", "root"],
    label: "Request Root Access",
    searchValue: "sudo root access admin",
    icon: Terminal,
    action: {
      type: "toast",
      message: "Permission denied. Mom says no.",
    },
  },
  {
    id: "force-push",
    triggers: ["git push", "force"],
    label: "Force Push to Main",
    searchValue: "git push force main",
    icon: GitBranch,
    action: {
      type: "toast",
      message: "Nice try. This is a read-only portfolio.",
    },
  },
  {
    id: "void",
    triggers: ["404", "void", "lost"],
    label: "Enter the Void",
    searchValue: "404 void lost enter",
    icon: Ghost,
    action: {
      type: "navigate",
      path: "/void",
    },
  },
  {
    id: "coffee",
    triggers: ["coffee", "caffeine"],
    label: "Buy Me a Coffee",
    searchValue: "coffee caffeine buy",
    icon: Coffee,
    action: {
      type: "copy",
      text: "0xf2a8b4b693579e0839dc30fd0a471bf7d169e125",
      toastMessage: "Copied ETH wallet. You're fueling the codebase.",
    },
  },
  {
    id: "hire",
    triggers: ["hire", "available", "work"],
    label: "Available for Work",
    searchValue: "hire available work contact",
    icon: Briefcase,
    action: {
      type: "openUrl",
      url: "https://www.linkedin.com/in/dennisjooo/",
      toastMessage: "DM me lol",
    },
  },
  {
    id: "build",
    triggers: ["version", "build", "commit"],
    label: "Show Build Info",
    searchValue: "version build commit info",
    icon: Hash,
    action: {
      type: "toast",
      message: `Build: v${BUILD_VERSION}`,
    },
  },
];
