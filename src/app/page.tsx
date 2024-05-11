'use client'

import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/clerk-react";
import { SignedIn, SignInButton, SignOutButton, useSession } from "@clerk/nextjs";

export default function Home() {
  const session = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
        <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
         <SignInButton mode="modal">
         <Button>Sign in</Button>
         </SignInButton>
      </SignedOut>
     
      <Button>This is the start</Button>
    </main>
  );
}
