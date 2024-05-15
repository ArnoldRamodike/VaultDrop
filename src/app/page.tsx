'use client'

import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/clerk-react";
import { SignedIn, SignInButton, SignOutButton,  useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {  Form,  FormControl,  FormDescription,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, 'Required'),
})

export default function Home() {

  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const  organization = useOrganization()
  const user = useUser();
  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileref = form.register('file');

  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values);
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });
    const { storageId } = await result.json();
   
    await createfile({
    name: values.title,
    fileId: storageId,
    orgId: 'org_2gT1isavMs69qCsy7YRv2hbh1VQ'
    })

    form.reset();
    setIsDialogOpen(false);

    try {
      toast({
        variant: "success",
        title: "File uploaded successfully",
        description: "Now everyone can view your file",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Your file could not be uploaded, try again later",
      })
    }

  
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const files = useQuery(api.files.getFiles, orgId?  {orgId} : 'skip'  );
  const createfile = useMutation(api.files.createFile)
  
  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your files</h1>

        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          form.reset();
          }}>
          <DialogTrigger>
            <Button onClick={() => { 
              
                }}>
                  upload file
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Upload your file here</DialogTitle>
              <DialogDescription>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>title</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileref} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


      </div>

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
      return <div key={item._id}>{item.name}</div>
     })}
     
    </main>
  );
}
