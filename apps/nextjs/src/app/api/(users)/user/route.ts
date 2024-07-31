import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('search') || 'default value';
  
    return NextResponse.json({ message: `Search query: ${searchQuery}` });
  }
  
  // Handler for POST requests
  export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('search') || 'default value';
    const body = await req.json();
    // console.log(body);
    return NextResponse.json({ message: `Search query: ${searchQuery}`, data: body });
  }