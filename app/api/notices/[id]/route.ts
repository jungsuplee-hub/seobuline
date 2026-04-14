import { NextResponse } from "next/server";
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return NextResponse.json({entity:"notices",id,updated:await req.json()});}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;return NextResponse.json({entity:"notices",deletedId:id});}
