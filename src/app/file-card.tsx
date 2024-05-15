import React, { useState } from 'react'
import {  Card,  CardContent,  CardDescription,  CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog"
  
import { Doc } from '../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {  MoreVertical, Trash2Icon } from 'lucide-react'
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';

function FileCardActions({file}: {file: Doc<'files'>} ){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const deleteFile = useMutation(api.files.deleteFile);
    const { toast } = useToast()
    return(
        <>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                        await deleteFile({fileId: file._id}).then(() => {
                            toast({
                                variant: "destructive",
                                title: "File Deleted successfully",
                                description: "Your file is now permanently removed from the system",
                              })
                        })
                    }} >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


        <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical/></DropdownMenuTrigger>
            <DropdownMenuContent onClick={() => setIsConfirmOpen(true)}>
                <DropdownMenuItem className='flex gap-1 text-red-600 items-center cursor-pointer'> 
                    <Trash2Icon className='w-4 h-4'/> Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>

    </>
    );
}
  
const FileCard = ({file}: {file: Doc<'files'>} ) => {
  return (
        <Card className='gap-2'>
            <CardHeader className='relative'>
                <CardTitle>
                    {file.name} 
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file}/>
                </div>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Download </Button>
            </CardFooter>
        </Card>
  )
}

export default FileCard