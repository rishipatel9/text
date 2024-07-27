// pages/api/users.ts
import {  NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { getSession } from 'next-auth/react';


export async function GET(req: NextRequest,res:NextResponse) {
    const session = await getServerSession(NEXT_AUTH);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  try {
    const users = await prisma.user.findMany();
    const filteredUsers = users.filter(user => user.name !== session.user.name);
    // console.log(filteredUsers);
    return NextResponse.json(
        filteredUsers
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" });
  }
};

