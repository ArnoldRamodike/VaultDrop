'use client'

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {  Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<FileList>((val) => val instanceof FileList, 'Required')
    .refine((files) => files.length > 0, 'Required'),
})

export default function UploadButton() {

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
    const fileType= values.file[0].type;

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": fileType },
      body: values.file[0],
    });
    const { storageId } = await result.json();

    const types= {
        "image/png": "image",
        "image/jpeg": "image",
        "application/pdf": "pdf",
        "text/csv": "csv",
    } as Record<string, Doc<"files">['type']>;
   
    await createfile({
    name: values.title,
    fileId: storageId,
    orgId: orgId,
    type: types[values.file[0].type],
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
  const createfile = useMutation(api.files.createFile)
  
  return (
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          form.reset();
          }}>
          <DialogTrigger>
            {/* <Button onClick={() => { }}> */}
                  upload file
            {/* </Button> */}
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
                            <Input placeholder="file name" {...field} />
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
                    <Button disabled={form.formState.isSubmitted} type="submit" className="flex gap-1">
                      { form.formState.isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                      )
                      }
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
  );
}
// export default UploadButton