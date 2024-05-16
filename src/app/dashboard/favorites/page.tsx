'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import FileCard from '../files/file-card'
import SearchBar from '../files/search-bar'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

const FavoritesPage = () => {
    const  organization = useOrganization()
    const user = useUser();
    const [query, setQuery] = useState("");
  
    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
      orgId = organization.organization?.id ?? user.user?.id;
    }
  
    const files = useQuery(api.files.getFiles, orgId?  {orgId, favorites: true, query} : 'skip'  );
  return (
    <div>
         <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Favorite Files</h1>
                <SearchBar query={query} setQuery={setQuery}/>

            </div>

            {files === undefined && (
                <div className="flex-col flex gap-8 w-full items-center mt-12 text-gray-500">
                <Loader2 className="h-32 w-32 animate-spin"/>
                <div className="">Loading your files...</div>
                </div>
            )}

                {files && !query && files?.length === 0 && (
                <div className="flex-col flex gap-8 w-full items-center mt-12">
                    <Image src={'/empty.svg'} alt="empty" width={300} height={300} className=""/>
                    <div className="text-2xl font-semibold">
                    You have no files go and upload files
                    </div>
                </div>
                
            )}
            <div className="grid grid-cols-4 xs:grid-cols-1 sm:grid-cols-2 gap-4">  
                {files?.map((item) => {
                return( 
                    <FileCard key={item._id} file={item}/>
                    )
                })}
            </div>
    </div>
  )
}

export default FavoritesPage