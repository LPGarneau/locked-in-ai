import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const { searchParams } = new URL(req.url);
  const day = searchParams.get('day');
  const date = searchParams.get('date');
  if (!day || !date) return NextResponse.json({ error:'day and date required' }, { status:400 });
  const userId = (session.user as {id:string}).id;
  const records = await prisma.dayProgress.findMany({ where: { userId, day, date } });
  const state: Record<number, boolean> = {};
  records.forEach(r => { state[r.taskIndex] = r.done; });
  return NextResponse.json({ state });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  const { day, date, taskIndex, done } = await req.json();
  const userId = (session.user as {id:string}).id;
  await prisma.dayProgress.upsert({
    where: { userId_day_date_taskIndex: { userId, day, date, taskIndex } },
    update: { done },
    create: { userId, day, date, taskIndex, done },
  });
  return NextResponse.json({ ok:true });
}
