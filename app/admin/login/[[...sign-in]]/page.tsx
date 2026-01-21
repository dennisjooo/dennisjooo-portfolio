"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-noise relative flex items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10" />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair italic text-3xl md:text-4xl mb-2">
            Mission Control
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Admin Access Required
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorBackground: "hsl(var(--card))",
                colorInputBackground: "hsl(var(--input))",
                colorInputText: "hsl(var(--foreground))",
                colorText: "hsl(var(--foreground))",
                colorTextSecondary: "hsl(var(--muted-foreground))",
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl",
                header: "hidden",
                socialButtonsBlockButton:
                  "bg-secondary hover:bg-secondary/80 border-border text-foreground font-urbanist transition-all duration-300",
                socialButtonsBlockButtonText: "font-urbanist",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground font-mono text-xs uppercase",
                formFieldLabel: "text-foreground font-urbanist",
                formFieldInput:
                  "bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent rounded-lg font-urbanist",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground font-urbanist font-medium transition-all duration-300 rounded-lg",
                footerActionLink:
                  "text-accent hover:text-accent/80 font-urbanist transition-colors",
                identityPreviewText: "text-foreground font-urbanist",
                identityPreviewEditButton: "text-accent hover:text-accent/80",
                formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
                alert: "bg-red-500/10 border-red-500/20 text-red-500",
                alertText: "text-red-500 font-urbanist",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
              },
            }}
            routing="path"
            path="/admin/login"
            signUpUrl="/admin/login"
            forceRedirectUrl="/admin"
          />
        </div>

        {/* Back to site link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
