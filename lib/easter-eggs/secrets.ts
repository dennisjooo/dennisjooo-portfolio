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
      type: "toast",
      message: "ERR_CODE: 0xEASTER — entity not found in this dimension.",
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
      text: "Thanks for the coffee thought! github.com/dennisjooo",
      toastMessage: "Copied. You're fueling the codebase.",
    },
  },
  {
    id: "hire",
    triggers: ["hire", "available", "work"],
    label: "Available for Work",
    searchValue: "hire available work contact",
    icon: Briefcase,
    action: {
      type: "copy",
      text: "Dennis Jonathan — full-stack developer available for work. dennisjonathan78@gmail.com",
      toastMessage: "Copied pitch + email.",
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
