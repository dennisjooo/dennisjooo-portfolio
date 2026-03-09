import {
  DocumentTextIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  LinkIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';

export const navigationCards = [
  {
    title: "Editorial Content",
    description: "Blog posts, project showcases, and long-form articles.",
    href: "/admin/blogs",
    icon: DocumentTextIcon,
    stat: "Manage Posts",
    color: "from-purple-500/20 to-blue-500/20",
  },
  {
    title: "Work Experience",
    description: "Career timeline, roles, and professional history.",
    href: "/admin/work-experience",
    icon: BriefcaseIcon,
    stat: "View All",
    color: "from-sky-500/20 to-indigo-500/20",
  },
  {
    title: "Certifications",
    description: "Licenses, certifications, and educational achievements.",
    href: "/admin/certifications",
    icon: AcademicCapIcon,
    stat: "View All",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Contacts",
    description: "Social links, email, and other contact channels.",
    href: "/admin/contacts",
    icon: LinkIcon,
    stat: "View All",
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    title: "About",
    description: "Bio, introduction text, and personal details.",
    href: "/admin/about",
    icon: IdentificationIcon,
    stat: "Edit",
    color: "from-amber-500/20 to-yellow-500/20",
  },
  {
    title: "Profile Config",
    description: "Global site settings, profile picture, and preferences.",
    href: "/admin/profile",
    icon: UserCircleIcon,
    stat: "Settings",
    color: "from-orange-500/20 to-red-500/20",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
