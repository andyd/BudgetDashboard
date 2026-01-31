import type { BudgetSpendingItem } from "./departments";

export const EDUCATION_PROGRAMS: BudgetSpendingItem[] = [
  {
    id: "prog-pell-grants",
    name: "Pell Grants",
    amount: 22_000_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Federal grants for undergraduate students with demonstrated financial need, typically not requiring repayment.",
  },
  {
    id: "prog-title-i",
    name: "Title I Grants",
    amount: 18_000_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Federal funding to schools with high percentages of children from low-income families to help ensure all children meet challenging state academic standards.",
  },
  {
    id: "prog-idea",
    name: "Special Education (IDEA)",
    amount: 15_000_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Individuals with Disabilities Education Act funding to support special education services for children with disabilities from birth through age 21.",
  },
  {
    id: "prog-school-lunch",
    name: "School Lunch Program",
    amount: 15_000_000_000,
    tier: "program",
    parentId: "dept-usda",
    fiscalYear: 2025,
    source: "USDA Food and Nutrition Service",
    description:
      "National School Lunch Program providing nutritionally balanced, low-cost or free lunches to eligible children in public and nonprofit private schools.",
  },
  {
    id: "prog-head-start",
    name: "Head Start",
    amount: 12_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "HHS Administration for Children and Families",
    description:
      "Comprehensive early childhood education, health, nutrition, and parent involvement services for low-income children and families.",
  },
  {
    id: "prog-student-loans-admin",
    name: "Federal Student Loans Admin",
    amount: 2_000_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Administrative costs for managing the federal student loan program, including loan servicing, collections, and borrower support services.",
  },
  {
    id: "prog-teacher-training",
    name: "Teacher Training",
    amount: 2_000_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Federal programs supporting teacher preparation, professional development, and quality improvement initiatives for educators.",
  },
  {
    id: "prog-trio",
    name: "TRIO Programs",
    amount: 1_200_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Federal outreach and student services programs designed to identify and provide services for individuals from disadvantaged backgrounds to progress through the academic pipeline.",
  },
  {
    id: "prog-charter-schools",
    name: "Charter Schools",
    amount: 500_000_000,
    tier: "program",
    parentId: "dept-education",
    fiscalYear: 2025,
    source: "Department of Education",
    description:
      "Federal grants supporting the planning, development, and initial implementation of charter schools across the nation.",
  },
];
