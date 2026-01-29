import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spotlightContent, budgetItems } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/spotlights
 * Fetch all spotlight content with budget item details
 */
export async function GET() {
  try {
    const spotlights = await db
      .select({
        id: spotlightContent.id,
        budgetItemId: spotlightContent.budgetItemId,
        title: spotlightContent.title,
        description: spotlightContent.description,
        createdAt: spotlightContent.createdAt,
        budgetItem: {
          id: budgetItems.id,
          name: budgetItems.name,
          slug: budgetItems.slug,
          amount: budgetItems.amount,
        },
      })
      .from(spotlightContent)
      .leftJoin(budgetItems, eq(spotlightContent.budgetItemId, budgetItems.id))
      .orderBy(spotlightContent.createdAt);

    return NextResponse.json(spotlights);
  } catch (error) {
    console.error("Error fetching spotlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch spotlights" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/spotlights
 * Create new spotlight content
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetItemId, title, description } = body;

    if (!budgetItemId || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [newSpotlight] = await db
      .insert(spotlightContent)
      .values({
        budgetItemId,
        title,
        description,
      })
      .returning();

    return NextResponse.json(newSpotlight, { status: 201 });
  } catch (error) {
    console.error("Error creating spotlight:", error);
    return NextResponse.json(
      { error: "Failed to create spotlight" },
      { status: 500 }
    );
  }
}
