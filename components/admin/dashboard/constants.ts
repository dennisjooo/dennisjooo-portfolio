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
  },
  {
    title: "Work Experience",
    description: "Career timeline, roles, and professional history.",
    href: "/admin/work-experience",
    icon: BriefcaseIcon,
    stat: "View All",
  },
  {
    title: "Certifications",
    description: "Licenses, certifications, and educational achievements.",
    href: "/admin/certifications",
    icon: AcademicCapIcon,
    stat: "View All",
  },
  {
    title: "Contacts",
    description: "Social links, email, and other contact channels.",
    href: "/admin/contacts",
    icon: LinkIcon,
    stat: "View All",
  },
  {
    title: "About",
    description: "Bio, introduction text, and personal details.",
    href: "/admin/about",
    icon: IdentificationIcon,
    stat: "Edit",
  },
  {
    title: "Profile Config",
    description: "Global site settings, profile picture, and preferences.",
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
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
