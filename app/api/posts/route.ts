import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({entity:"posts",items:[]});}
export async function POST(req:Request){return NextResponse.json({entity:"posts",created:await req.json()},{status:201});}
