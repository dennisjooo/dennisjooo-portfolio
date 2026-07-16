import {
  DocumentTextIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  LinkIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export const navigationCards = [
  {
    title: "Editorial Content",
    description: "Posts, projects, and long-form writing.",
    href: "/admin/blogs",
    icon: DocumentTextIcon,
    stat: "Manage Posts",
  },
  {
    title: "Work Experience",
    description: "Career timeline and professional roles.",
    href: "/admin/work-experience",
    icon: BriefcaseIcon,
    stat: "View All",
  },
  {
    title: "Certifications",
    description: "Licenses, credentials, and achievements.",
    href: "/admin/certifications",
    icon: AcademicCapIcon,
    stat: "View All",
  },
  {
    title: "Contacts",
    description: "Social links and contact channels.",
    href: "/admin/contacts",
    icon: LinkIcon,
    stat: "View All",
  },
  {
    title: "About",
    description: "Bio, introduction, and personal details.",
    href: "/admin/about",
    icon: IdentificationIcon,
    stat: "Edit",
  },
  {
    title: "Profile Config",
    description: "Site settings and preferences.",
    href: "/admin/profile",
    icon: UserCircleIcon,
    stat: "Settings",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
