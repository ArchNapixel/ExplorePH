import { connection } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  await connection(); // never prerender: always hit the database
  try {
    const [row] = await db.$queryRaw<{ now: Date }[]>`SELECT now()`;
    return Response.json({ db: "ok", now: row.now });
  } catch (error) {
    console.error(error);
    return Response.json({ db: "error" }, { status: 503 });
  }
}
