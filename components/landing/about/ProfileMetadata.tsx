import { cn } from '@/lib/utils';

interface ProfileMetadataProps {
    className?: string;
    nameClassName?: string;
}

export function ProfileMetadata({ className, nameClassName = "text-3xl" }: ProfileMetadataProps) {
    return (
        <div
            className={cn("text-center space-y-2 animate-fade-in-up", className)}
            style={{ animationDelay: '0.6s' }}
        >
            <p className={cn("font-caslon italic text-foreground", nameClassName)}>Dennis Jonathan</p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Okay Developer & Human Being
            </p>
        </div>
    );
}
