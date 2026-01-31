/**
 * Browser Console Test for Wizard Data Flow
 *
 * Run this in the browser console to validate wizard data flow.
 * Copy and paste the entire script into the console.
 *
 * Usage:
 * 1. Open the app in development mode (pnpm dev)
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire file
 * 4. Check the console output for results
 */

console.log("=".repeat(60));
console.log("WIZARD DATA FLOW VALIDATION TEST");
console.log("=".repeat(60));

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
};

function pass(test) {
  results.passed++;
  console.log("✓", test);
}

function fail(test, reason) {
  results.failed++;
  results.issues.push({ test, reason });
  console.error("✗", test);
  console.error("  Reason:", reason);
}

function warn(message) {
  results.warnings++;
  console.warn("⚠", message);
}

// Import note
console.log(
  "\nNote: This test assumes you're on a page that imports the wizard modules.",
);
console.log("If you see 'undefined' errors, run this on a wizard page.\n");

// Wait for modules to load
setTimeout(() => {
  try {
    console.log("\n1. CHECKING CATEGORY DEFINITIONS\n");

    // Check if we can access the categories
    if (typeof PRIORITY_CATEGORIES !== "undefined") {
      pass("PRIORITY_CATEGORIES is defined");

      const expectedPriorities = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
        "environment",
        "housing",
        "science",
        "social-security",
      ];

      expectedPriorities.forEach((cat) => {
        if (PRIORITY_CATEGORIES[cat]) {
          pass(`Priority category '${cat}' is defined`);
        } else {
          fail(`Priority category '${cat}' is missing`);
        }
      });
    } else {
      fail("PRIORITY_CATEGORIES not found", "Module not imported");
    }

    if (typeof WASTEFUL_CATEGORIES !== "undefined") {
      pass("WASTEFUL_CATEGORIES is defined");

      const expectedWasteful = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
        "other",
      ];

      expectedWasteful.forEach((cat) => {
        if (WASTEFUL_CATEGORIES[cat]) {
          pass(`Wasteful category '${cat}' is defined`);
        } else {
          fail(`Wasteful category '${cat}' is missing`);
        }
      });
    } else {
      fail("WASTEFUL_CATEGORIES not found", "Module not imported");
    }

    console.log("\n2. CHECKING BUDGET ITEM MAPPINGS\n");

    if (typeof getBudgetItemsForCategory === "function") {
      const testCategories = [
        "defense",
        "foreign-aid",
        "admin",
        "farm-subsidies",
        "interest",
      ];

      testCategories.forEach((cat) => {
        const items = getBudgetItemsForCategory(cat);
        if (items && items.length > 0) {
          pass(`Category '${cat}' has ${items.length} budget items`);
          console.log(`  Items: ${items.map((i) => i.name).join(", ")}`);
        } else if (cat === "other") {
          pass(`Category '${cat}' is empty (expected)`);
        } else {
          warn(`Category '${cat}' has no budget items`);
        }
      });
    } else {
      fail("getBudgetItemsForCategory not found", "Function not available");
    }

    console.log("\n3. CHECKING COMPARISON UNIT MAPPINGS\n");

    if (typeof getComparisonUnitsForCategory === "function") {
      const testPriorities = [
        "education",
        "healthcare",
        "veterans",
        "infrastructure",
        "environment",
        "housing",
        "science",
        "social-security",
      ];

      testPriorities.forEach((cat) => {
        const units = getComparisonUnitsForCategory(cat);
        if (units && units.length > 0) {
          pass(`Category '${cat}' has ${units.length} comparison units`);
          console.log(`  Units: ${units.map((u) => u.name).join(", ")}`);
        } else {
          fail(`Category '${cat}' has no comparison units`);
        }
      });
    } else {
      fail("getComparisonUnitsForCategory not found", "Function not available");
    }

    console.log("\n4. TESTING COMPARISON GENERATION\n");

    if (typeof generateWizardComparisons === "function") {
      const testPriorities = ["education", "healthcare"];
      const testWasteful = ["defense", "foreign-aid"];
      const testTopPriority = "education";

      const comparisons = generateWizardComparisons(
        testPriorities,
        testWasteful,
        testTopPriority,
      );

      if (comparisons && comparisons.length > 0) {
        pass(`Generated ${comparisons.length} comparisons`);

        // Check first comparison
        const first = comparisons[0];
        if (first) {
          console.log("\n  Sample comparison:");
          console.log(`  Budget Item: ${first.budgetItem.name}`);
          console.log(`  Unit: ${first.unit.name}`);
          console.log(
            `  Count: ${Math.floor(first.unitCount).toLocaleString()}`,
          );
          console.log(`  Top Priority: ${first.isTopPriority}`);

          if (
            first.isTopPriority &&
            first.priorityCategory === testTopPriority
          ) {
            pass("First comparison matches top priority");
          } else {
            warn("First comparison is not the top priority");
          }
        }

        // Validate all comparisons
        let validComparisons = 0;
        comparisons.forEach((comp) => {
          if (
            comp.budgetItem &&
            comp.unit &&
            comp.unitCount > 0 &&
            comp.budgetItem.amount > 0
          ) {
            validComparisons++;
          }
        });

        if (validComparisons === comparisons.length) {
          pass(`All ${comparisons.length} comparisons are valid`);
        } else {
          fail(
            `${comparisons.length - validComparisons} invalid comparisons found`,
          );
        }
      } else {
        fail("No comparisons generated", "Check data mappings");
      }
    } else {
      fail("generateWizardComparisons not found", "Function not available");
    }

    console.log("\n5. CHECKING DATA INTEGRITY\n");

    if (typeof ALL_BUDGET_ITEMS !== "undefined") {
      const ids = ALL_BUDGET_ITEMS.map((item) => item.id);
      const uniqueIds = new Set(ids);

      if (uniqueIds.size === ids.length) {
        pass(`All ${ids.length} budget item IDs are unique`);
      } else {
        fail(
          "Duplicate budget item IDs found",
          `${ids.length - uniqueIds.size} duplicates`,
        );

        // Find duplicates
        const duplicates = [];
        const seen = new Set();
        ids.forEach((id) => {
          if (seen.has(id)) {
            duplicates.push(id);
          }
          seen.add(id);
        });

        console.error("  Duplicate IDs:", [...new Set(duplicates)]);
      }
    } else {
      warn("ALL_BUDGET_ITEMS not available for validation");
    }

    if (typeof ALL_COMPARISON_UNITS !== "undefined") {
      const ids = ALL_COMPARISON_UNITS.map((unit) => unit.id);
      const uniqueIds = new Set(ids);

      if (uniqueIds.size === ids.length) {
        pass(`All ${ids.length} comparison unit IDs are unique`);
      } else {
        fail(
          "Duplicate comparison unit IDs found",
          `${ids.length - uniqueIds.size} duplicates`,
        );
      }

      // Check for valid costs
      let invalidCosts = 0;
      ALL_COMPARISON_UNITS.forEach((unit) => {
        const cost = unit.costPerUnit ?? unit.cost;
        if (!cost || cost <= 0) {
          invalidCosts++;
        }
      });

      if (invalidCosts === 0) {
        pass("All comparison units have valid costs");
      } else {
        fail(`${invalidCosts} comparison units have invalid costs`);
      }
    } else {
      warn("ALL_COMPARISON_UNITS not available for validation");
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("TEST SUMMARY");
    console.log("=".repeat(60));
    console.log(`✓ Passed: ${results.passed}`);
    console.log(`✗ Failed: ${results.failed}`);
    console.log(`⚠ Warnings: ${results.warnings}`);

    if (results.issues.length > 0) {
      console.log("\n" + "Issues Found:");
      results.issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.test}: ${issue.reason}`);
      });
    }

    if (results.failed === 0) {
      console.log("\n🎉 All tests passed!");
    } else {
      console.log("\n❌ Some tests failed. Check the issues above.");
    }

    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Test failed with error:");
    console.error(error);
    console.log(
      "\nMake sure you're running this on a page that imports the wizard modules.",
    );
  }
}, 1000);

console.log("\nLoading modules...\n");
