import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog"
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import {  Download, MoreVertical, StarHalfIcon, StarIcon, Trash2Icon, UndoIcon } from 'lucide-react'
import { useMutation} from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { Protect } from '@clerk/nextjs';

export function getFileUrl(fileId: Id<'_storage'>): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

function FileCardActions({file, isFavorited}: {file: Doc<'files'>, isFavorited: boolean} ){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toogleFavorite = useMutation(api.files.toogleFavorite);
    const { toast } = useToast();



    return(
        <>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your file
                    and remove the data from our servers.
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
              <DropdownMenuContent >
                <DropdownMenuItem className='gap-1'
                 onClick={() => {
                  window.open(getFileUrl(file.fileId), "_blank");
                }}>
                  <Download className='w-4 h-4' /> Download 
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={() => toogleFavorite({fileId: file._id })} 
                    className='flex gap-1 text-blue-600 items-center cursor-pointer'> 
                    {isFavorited ? (
                    <div className="flex items-center gap-1">
                        <StarIcon className='w-4 h-4'/> Unfavorite
                    </div>
                    ) :
                    ( <div className="flex items-center gap-1">
                         <StarHalfIcon className='w-4 h-4'/> Favorite
                     </div>)
                    }
                </DropdownMenuItem>
                
                <Protect 
                    role='org:admin' 
                    fallback={<></>}
                >
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                if (file.shouldDelete) {
                    restoreFile({ fileId: file._id});
                } else{
                     setIsConfirmOpen(true)
                    }}}
                     className='flex gap-1 text-green-600 items-center cursor-pointer'> 
                     { file.shouldDelete ? 
                        <div className="flex items-center gap-1">
                            <UndoIcon className='w-4 h-4'/> Restore
                        </div> :
                        <div className="flex items-center gap-1">
                        <Trash2Icon className='w-4 h-4'/> Delete
                        </div>
                     }
                   
                </DropdownMenuItem>
               
                </Protect>
            </DropdownMenuContent>
        </DropdownMenu>

    </>
    );
}

export default FileCardActions