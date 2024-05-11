'use client'

import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/clerk-react";
import { SignedIn, SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const session = useSession();
  const createfile = useMutation(api.files.createFile)
  const files = useQuery(api.files.getFiles);

  console.log(files);
  
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
     {files?.map((item) => {
      return <div key={item.id}>{item.name}</div>
     })}
      <Button onClick={() => {createfile({name: 'Hello World'})}}>This is the start</Button>
    </main>
  );
}
