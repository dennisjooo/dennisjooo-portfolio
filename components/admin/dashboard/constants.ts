import { DocumentTextIcon, UserCircleIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export const navigationCards = [
  {
    title: "Editorial Content",
    description: "Manage blog posts, project showcases, and long-form articles.",
    href: "/admin/blogs",
    icon: DocumentTextIcon,
    stat: "Manage Posts",
    color: "from-purple-500/20 to-blue-500/20"
  },
  {
    title: "Certifications",
    description: "Update licenses, certifications, and educational achievements.",
    href: "/admin/certifications",
    icon: AcademicCapIcon,
    stat: "View All",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Profile Config",
    description: "Edit global site settings, profile picture, and bio.",
    href: "/admin/profile",
    icon: UserCircleIcon,
    stat: "Settings",
    color: "from-orange-500/20 to-red-500/20"
  }
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
