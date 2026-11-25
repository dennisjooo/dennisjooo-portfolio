"use client";

import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/components/admin/shared";

const SignInLoadingCard = () => (
  <div className="flex min-h-[28rem] w-full items-center justify-center rounded-sm border border-border bg-background">
    <LoadingSpinner className="h-12" />
  </div>
);

const SignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  { loading: SignInLoadingCard },
);

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative z-10 mx-auto w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl md:text-4xl">
            Mission Control
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            Admin access required
          </p>
        </div>

        <div className="flex justify-center">
          <ClerkLoading>
            <SignInLoadingCard />
          </ClerkLoading>
          <ClerkLoaded>
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: "hsl(var(--primary))",
                  colorBackground: "hsl(var(--card))",
                  colorInputBackground: "hsl(var(--input))",
                  colorInputText: "hsl(var(--foreground))",
                  colorText: "hsl(var(--foreground))",
                  colorTextSecondary: "hsl(var(--muted-foreground))",
                  borderRadius: "2px",
                },
                elements: {
                  rootBox: "w-full",
                  card: "bg-background border border-border rounded-sm shadow-none",
                  header: "hidden",
                  socialButtonsBlockButton:
                    "bg-secondary hover:bg-secondary/80 border-border text-foreground font-sans transition-colors duration-200",
                  socialButtonsBlockButtonText: "font-sans",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground font-sans text-xs",
                  formFieldLabel: "text-foreground font-sans",
                  formFieldInput:
                    "bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent rounded-lg font-sans",
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium transition-colors duration-200 rounded-lg",
                  footerActionLink:
                    "text-accent hover:text-accent/80 font-sans transition-colors",
                  identityPreviewText: "text-foreground font-sans",
                  identityPreviewEditButton: "text-accent hover:text-accent/80",
                  formFieldInputShowPasswordButton:
                    "text-muted-foreground hover:text-foreground",
                  alert:
                    "bg-destructive/10 border-destructive/20 text-destructive",
                  alertText: "text-destructive font-sans",
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
          </ClerkLoaded>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
