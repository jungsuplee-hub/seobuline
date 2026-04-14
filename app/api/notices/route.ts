import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({entity:"notices",items:[]});}
export async function POST(req:Request){return NextResponse.json({entity:"notices",created:await req.json()},{status:201});}
