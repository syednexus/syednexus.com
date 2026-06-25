import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

function parseBlogId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// PUBLIC READ
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: "desc" }
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("BLOG READ ERROR", error);
    return NextResponse.json([], { status: 200 });
  }
}

// OWNER CREATE / UPDATE
export async function POST(req: Request) {
  try {
    if (!(await requireAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const payload = {
      title: clean(body.title),
      category: clean(body.category) || "Learning Notes",
      content: clean(body.content),
      tags: clean(body.tags)
    };

    if (
      !payload.title ||
      !payload.content ||
      payload.title.length > 150 ||
      payload.content.length > 10000
    ) {
      return NextResponse.json({ error: "Invalid blog data" }, { status: 400 });
    }

    const updateId = parseBlogId(body.id);

    const blog =
      updateId != null
        ? await prisma.blog.update({
            where: { id: updateId },
            data: payload
          })
        : await prisma.blog.create({
            data: payload
          });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("BLOG SAVE ERROR", error);
    return NextResponse.json({ error: "Blog save failed" }, { status: 500 });
  }
}

// OWNER DELETE
export async function DELETE(req: Request) {
  try {
    if (!(await requireAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = parseBlogId(body.id);

    if (id == null) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    }

    await prisma.blog.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BLOG DELETE ERROR", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
