import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { GradientUnderline } from '@/components/shared';

export const ViewAllButton = () => {
    return (
        <div className="w-full flex justify-center mt-20 md:mt-10">
            <Link
                href="/blogs"
                prefetch
                className="group relative inline-flex items-center gap-3 py-2"
            >
                <GradientUnderline trigger="hover" className="font-sans font-bold text-lg md:text-xl uppercase tracking-widest text-foreground transition-colors duration-300 group-hover:text-accent">
                    All Projects
                </GradientUnderline>
                
                <ArrowRightIcon className="w-5 h-5 text-foreground transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent" />
            </Link>
        </div>
    );
};
