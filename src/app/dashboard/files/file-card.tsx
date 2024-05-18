import React, { ReactNode, useState } from 'react'
import {  Card,  CardContent,  CardDescription,  CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { formatRelative } from 'date-fns'
import {  Download, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalfIcon, StarIcon, Trash2Icon, UndoIcon } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Protect } from '@clerk/nextjs';

function FileCardActions({file, isFavorited}: {file: Doc<'files'>, isFavorited: boolean} ){
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toogleFavorite = useMutation(api.files.toogleFavorite);

    const { toast } = useToast()
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
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => {
                  window.open(getFileUrl(file.fileId), "_blank");
                }}>
                  <Download className='w-4 h-4' /> Download 
                </DropdownMenuItem>
                </Protect>
            </DropdownMenuContent>
        </DropdownMenu>

    </>
    );
}

function getFileUrl(fileId: Id<'_storage'>): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}
  
const FileCard = ({file, favorites}: {file: Doc<'files'>, favorites: Doc<'favorites'>[]} ) => {

    const userProfile = useQuery(api.users.getUserProfile,{
         userId: file.userId,
    });
    
    const typeIcons= {
        image: <ImageIcon/>,
        pdf: <FileTextIcon/>,
        csv: <GanttChartIcon/> ,
    }  as Record<Doc<"files">['type'], ReactNode> || undefined; 

    const isFavorited = favorites?.some((favorite) => favorite.fileId === file._id)
    
  return (
        <Card className='gap-2'>
            <CardHeader className='relative'>
                <CardTitle className='flex gap-2'>
                <div className='flex justify-center items-center'>{typeIcons[file.type]}</div>
                    {file.name} 
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavorited={isFavorited} file={file}/>
                </div>
            </CardHeader>
            <CardContent className='h-[200px] flex justify-center items-center'>
               { file.type === 'image' &&(
                <Image alt={file.name} width={200} height={200} src={getFileUrl(file.fileId)}/>
               )}
                { file.type === 'csv' && <GanttChartIcon className='w-20 h-20'/>}
                { file.type === 'pdf' && <FileTextIcon className='w-20 h-20'/>}
            </CardContent>
            <CardFooter className='flex justify-between '>
                <div className="flex gap-2 text-xs text-gray-600 w-40 items-center">
                    <Avatar className='w-8 h-8'>
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                {userProfile?.name}
                polly mayson
                </div>
               <div className="flex text-xs text-gray-600">
                 uploaded {formatRelative(new Date(file._creationTime), new Date())}
               </div>

               
            </CardFooter>
        </Card>
  )
}

export default FileCard