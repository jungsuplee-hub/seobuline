import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({entity:"events",items:[]});}
export async function POST(req:Request){return NextResponse.json({entity:"events",created:await req.json()},{status:201});}
