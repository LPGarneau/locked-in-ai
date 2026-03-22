import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const userId = (session.user as {id:string}).id;
  const programs = await prisma.trainingProgram.findMany({ where:{ userId }, orderBy:{ createdAt:'desc' } });
  return NextResponse.json({ programs });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const userId = (session.user as {id:string}).id;
  const { title, description, days } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error:'Title required' }, { status:400 });
  const program = await prisma.trainingProgram.create({ data:{ userId, title:title.trim(), description:description?.trim()||null, days } });
  return NextResponse.json({ program }, { status:201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const userId = (session.user as {id:string}).id;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error:'id required' }, { status:400 });
  await prisma.trainingProgram.deleteMany({ where:{ id, userId } });
  return NextResponse.json({ ok:true });
}
