import { ConvexError, v } from 'convex/values'
import {mutation, query} from './_generated/server'
import { getUser } from './users';
import { MutationCtx, QueryCtx } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  });

async function hasAcessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user =  await getUser(ctx, tokenIdentifier);
    console.log(user);

    const hasAcess = user.orgId.includes(orgId) || user.tokenIdentifier.includes(orgId);
    if (!hasAcess) {
        throw new ConvexError('You do not have accesss to this organization');
    }

    return hasAcess;
}

export const createFile = mutation({
    args:{
        name: v.string(),
        fileId: v.id('_storage'),
        orgId: v.string(),
    },
    async handler(ctx, args){
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) {
        //     throw new ConvexError('You must be logged in to create file')
        // }

        // const hasAccess = await hasAcessToOrg(
        //     ctx, identity.tokenIdentifier, args.orgId
        // );

        // if (!hasAccess) {
        //     throw new ConvexError('You do not have access to this organization')
        // }

        await ctx.db.insert('files', {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId
        })
    }
});


export const getFiles = query({
    args:{
        orgId: v.string()
    },
    async handler(ctx, args){
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) {
        //     return [];
        // }    
        
        // const hasAccess = await hasAcessToOrg(
        //     ctx, identity.tokenIdentifier, args.orgId
        // );

        // if (!hasAccess) {
        //    return [];
        // }

        return ctx.db.query('files').withIndex('by_orgId', q =>
             q.eq('orgId', args.orgId)
            ).collect();
    }
})