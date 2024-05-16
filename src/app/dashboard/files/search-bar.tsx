import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, SearchIcon } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    query: z.string().min(0).max(200),
});

const SearchBar = ({query, setQuery}: {query: string, setQuery: Dispatch<SetStateAction<string>>}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          query: "",
        },
      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query)
        console.log(values);
        // const postUrl = await generateUploadUrl();
        // const fileType= values.file[0].type;
    
        // const result = await fetch(postUrl, {
        //   method: "POST",
        //   headers: { "Content-Type": fileType },
        //   body: values.file[0],
        // });
    }

  return (
    <div className=''>
           <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-center">
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="search.." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <Button size='icon' type="submit" className="flex gap-1">
                      { form.formState.isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                      )
                      }
                     <SearchIcon/>
                    </Button>
                  </form>
                </Form> 
    </div>
  )
}

export default SearchBar