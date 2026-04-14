import { NextResponse } from "next/server";import { newsSchema } from "@/lib/validations";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const p=newsSchema.partial().safeParse(await req.json());if(!p.success) return NextResponse.json({error:p.error.flatten()},{status:400});return NextResponse.json({id,data:p.data});}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return NextResponse.json({deletedId:id});}
