import React, { ReactNode } from 'react'
import {  Card,  CardContent,   CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Doc } from '../../../../convex/_generated/dataModel'
import { formatRelative } from 'date-fns'
import {   FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react'
import { api } from '../../../../convex/_generated/api';
import Image from 'next/image';
import FileCardActions, { getFileUrl } from '../_components/file-actions'
import { useQuery } from 'convex/react'

  
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
                <CardTitle className='flex gap-2 text-base font-normal'>
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