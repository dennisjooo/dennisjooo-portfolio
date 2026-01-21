"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DocumentTextIcon, UserCircleIcon, AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const cards = [
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-foreground">
          Welcome back, <span className="not-italic font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">Dennis.</span>
        </h1>
        <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest max-w-xl">
          System Status: Operational // Ready for content injection
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map((card) => (
          <motion.div key={card.href} variants={itemVariants}>
            <Link 
              href={card.href} 
              className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card/30 hover:bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/50"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative p-8 h-full flex flex-col">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-background/50 border border-border/50 group-hover:scale-110 transition-transform duration-500 w-fit">
                  <card.icon className="w-6 h-6 text-foreground" />
                </div>
                
                <h2 className="text-2xl font-bold font-urbanist mb-3 group-hover:text-accent transition-colors">
                  {card.title}
                </h2>
                
                <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                  {card.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors">
                    {card.stat}
                  </span>
                  <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats or Recent Activity could go here */}
      <div className="p-8 rounded-2xl border border-border bg-card/20 backdrop-blur-sm">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">System Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
                <div className="text-3xl font-bold font-urbanist">Active</div>
                <div className="text-sm text-muted-foreground">Database Status</div>
            </div>
            <div className="space-y-1">
                <div className="text-3xl font-bold font-urbanist">Vercel</div>
                <div className="text-sm text-muted-foreground">Blob Storage</div>
            </div>
             <div className="space-y-1">
                <div className="text-3xl font-bold font-urbanist">Clerk</div>
                <div className="text-sm text-muted-foreground">Auth System</div>
            </div>
             <div className="space-y-1">
                <div className="text-3xl font-bold font-urbanist">v1.0.0</div>
                <div className="text-sm text-muted-foreground">Current Build</div>
            </div>
        </div>
      </div>
    </div>
  );
}
