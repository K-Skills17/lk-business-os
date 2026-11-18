export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { docs } from "@/lib/db/schema";
import { DocsClient } from "./docs-client";

export default async function DocsPage() {
  try {
    const allDocs = await db.select().from(docs).orderBy(docs.createdAt);
    return <DocsClient initialDocs={allDocs} />;
  } catch {
    return <DocsClient initialDocs={[]} />;
  }
}
