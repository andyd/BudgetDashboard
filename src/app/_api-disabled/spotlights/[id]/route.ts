import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spotlightContent } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/spotlights/[id]
 * Fetch a single spotlight by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [spotlight] = await db
      .select()
      .from(spotlightContent)
      .where(eq(spotlightContent.id, params.id))
      .limit(1);

    if (!spotlight) {
      return NextResponse.json(
        { error: "Spotlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(spotlight);
  } catch (error) {
    console.error("Error fetching spotlight:", error);
    return NextResponse.json(
      { error: "Failed to fetch spotlight" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/spotlights/[id]
 * Update a spotlight by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { budgetItemId, title, description } = body;

    if (!budgetItemId || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [updatedSpotlight] = await db
      .update(spotlightContent)
      .set({
        budgetItemId,
        title,
        description,
      })
      .where(eq(spotlightContent.id, params.id))
      .returning();

    if (!updatedSpotlight) {
      return NextResponse.json(
        { error: "Spotlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSpotlight);
  } catch (error) {
    console.error("Error updating spotlight:", error);
    return NextResponse.json(
      { error: "Failed to update spotlight" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/spotlights/[id]
 * Delete a spotlight by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [deletedSpotlight] = await db
      .delete(spotlightContent)
      .where(eq(spotlightContent.id, params.id))
      .returning();

    if (!deletedSpotlight) {
      return NextResponse.json(
        { error: "Spotlight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting spotlight:", error);
    return NextResponse.json(
      { error: "Failed to delete spotlight" },
      { status: 500 }
    );
  }
}
