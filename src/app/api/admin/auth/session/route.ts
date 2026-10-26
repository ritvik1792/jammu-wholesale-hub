import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await getAdminSession();
  return NextResponse.json({ authenticated });
}
