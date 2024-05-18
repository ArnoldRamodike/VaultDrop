'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {  useOrganization, useUser } from "@clerk/nextjs";
import {  useQuery } from "convex/react";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import SearchBar from "./search-bar";
import UploadButton from "@/app/dashboard/files/upload-button";
import FileCard from "@/app/dashboard/files/file-card";
import { DataTable } from "../_components/file-table";
import { columns } from "../_components/columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Doc } from "../../../../convex/_generated/dataModel";


export default function FilesPage() {

  const  organization = useOrganization()
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all')

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(api.files.getAllFavorites, orgId? {orgId} : 'skip');
  const files = useQuery(api.files.getFiles, orgId?  {orgId, query, type: type ==="all" ? undefined : type, } : 'skip'  );

  
  return (
    <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Your files</h1>
                <SearchBar query={query} setQuery={setQuery}/>
                <UploadButton/>
            </div>

           <Tabs defaultValue="grid" >
              <div className="flex justify-between items-center">
            <TabsList className="mb-4">
              <TabsTrigger className="flex gap-2 items-center" value="grid"> <GridIcon /> Grid </TabsTrigger>
              <TabsTrigger className="flex gap-2 items-center" value="table"> <RowsIcon/> Table </TabsTrigger>
            </TabsList>
              <div className="">
                <Select value={type} onValueChange={(newType) => {
                  setType(newType as any);
                }}>
                  <SelectTrigger className="w-[180px]" >
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>          
            </div>
            <TabsContent  value="grid">
            
            <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">  
                {files?.map((item) => {
                return( 
                    <FileCard key={item._id} file={item}/>
                    )
                })}
            </div>  
            </TabsContent>
            <TabsContent value="table">
            <DataTable columns={columns} data={files} />
            </TabsContent>
          </Tabs>


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

             

</>
  );
}
