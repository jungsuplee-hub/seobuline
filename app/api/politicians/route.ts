import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({entity:"politicians",items:[]});}
export async function POST(req:Request){return NextResponse.json({entity:"politicians",created:await req.json()},{status:201});}
