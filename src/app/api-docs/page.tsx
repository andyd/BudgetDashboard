import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code, Zap, AlertCircle, CheckCircle2, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Complete API reference for the Federal Budget Dashboard. Learn how to integrate budget data and comparisons into your applications.",
  openGraph: {
    title: "API Documentation - Federal Budget Dashboard",
    description:
      "Complete API reference for integrating federal budget data and comparisons.",
  },
};

interface EndpointDoc {
  method: "GET" | "POST";
  path: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responseFields: {
    field: string;
    type: string;
    description: string;
  }[];
  example: {
    request: string;
    response: string;
  };
  errors: {
    status: number;
    message: string;
  }[];
}

const endpoints: EndpointDoc[] = [
  {
    method: "GET",
    path: "/api/compare",
    description:
      "Calculate a comparison between a budget item and a comparison unit. Returns the budget item details, unit details, and the calculated comparison result.",
    parameters: [
      {
        name: "budgetId",
        type: "string",
        required: true,
        description: "The unique identifier of the budget item to compare",
      },
      {
        name: "unitId",
        type: "string",
        required: true,
        description: "The unique identifier of the comparison unit",
      },
    ],
    responseFields: [
      {
        field: "budgetItem",
        type: "object",
        description:
          "The budget item details (id, name, amount, tier, fiscalYear, description, source)",
      },
      {
        field: "unit",
        type: "object",
        description:
          "The comparison unit details (id, name, category, costPerUnit, description, icon)",
      },
      {
        field: "comparison",
        type: "object",
        description:
          "The calculated comparison (count, formatted, formattedCount, unitName, displayString)",
      },
    ],
    example: {
      request: "/api/compare?budgetId=defense&unitId=teacher-salary",
      response: `{
  "budgetItem": {
    "id": "defense",
    "name": "Department of Defense",
    "amount": 886000000000,
    "tier": "agency",
    "fiscalYear": "2024",
    "description": "Military and national defense spending",
    "source": "USAspending.gov"
  },
  "unit": {
    "id": "teacher-salary",
    "name": "Teacher Salaries",
    "category": "education",
    "costPerUnit": 65000,
    "description": "Average annual salary for a public school teacher",
    "icon": "graduation-cap"
  },
  "comparison": {
    "count": 13630769,
    "formatted": "13.6M",
    "formattedCount": "13.6 million",
    "unitName": "teacher salaries",
    "displayString": "equivalent to 13.6 million teacher salaries"
  }
}`,
    },
    errors: [
      {
        status: 400,
        message: "Missing required parameters (budgetId and unitId)",
      },
      { status: 404, message: "Budget item or comparison unit not found" },
    ],
  },
  {
    method: "GET",
    path: "/api/budget/search",
    description:
      "Search budget items by name or ID with relevance scoring. Returns up to 20 results sorted by relevance.",
    parameters: [
      {
        name: "q",
        type: "string",
        required: true,
        description: "Search query string. Searches both name and ID fields.",
      },
    ],
    responseFields: [
      {
        field: "results",
        type: "array",
        description:
          "Array of matching budget items with id, name, amount, tier, and relevance score",
      },
      {
        field: "query",
        type: "string",
        description: "The search query that was used",
      },
      {
        field: "total",
        type: "number",
        description: "Total number of results returned",
      },
    ],
    example: {
      request: "/api/budget/search?q=defense",
      response: `{
  "results": [
    {
      "id": "defense",
      "name": "Department of Defense",
      "amount": 886000000000,
      "tier": "agency",
      "score": 90
    },
    {
      "id": "defense-health",
      "name": "Defense Health Program",
      "amount": 42000000000,
      "tier": "program",
      "score": 60
    }
  ],
  "query": "defense",
  "total": 2
}`,
    },
    errors: [
      {
        status: 200,
        message: "Empty query returns empty results array (not an error)",
      },
    ],
  },
  {
    method: "GET",
    path: "/api/units/search",
    description:
      "Search comparison units by name and description. Optionally filter by category. Returns up to 20 results.",
    parameters: [
      {
        name: "q",
        type: "string",
        required: true,
        description:
          "Search query string. Searches name and description fields.",
      },
      {
        name: "category",
        type: "string",
        required: false,
        description:
          'Filter by category. Supports comma-separated values for multiple categories (e.g., "healthcare,education").',
      },
    ],
    responseFields: [
      {
        field: "query",
        type: "string",
        description: "The search query that was used (lowercased and trimmed)",
      },
      {
        field: "categories",
        type: "array | null",
        description: "Categories used for filtering, or null if not specified",
      },
      {
        field: "total",
        type: "number",
        description: "Total number of matching results (before limit)",
      },
      {
        field: "count",
        type: "number",
        description: "Number of results returned (max 20)",
      },
      {
        field: "units",
        type: "array",
        description: "Array of matching units with full details",
      },
    ],
    example: {
      request: "/api/units/search?q=salary&category=education",
      response: `{
  "query": "salary",
  "categories": ["education"],
  "total": 3,
  "count": 3,
  "units": [
    {
      "id": "teacher-salary",
      "name": "Teacher Salaries",
      "nameSingular": "Teacher Salary",
      "description": "Average annual salary for a public school teacher in the US",
      "category": "education",
      "icon": "graduation-cap",
      "cost": 65000,
      "period": "year",
      "source": "Bureau of Labor Statistics"
    }
  ]
}`,
    },
    errors: [{ status: 400, message: "Missing required query parameter: q" }],
  },
];

function CodeBlock({
  code,
  language = "json",
}: {
  code: string;
  language?: string;
}) {
  return (
    <pre className="bg-muted overflow-x-auto rounded-lg p-4">
      <code className="text-sm">{code}</code>
    </pre>
  );
}

function EndpointCard({ endpoint }: { endpoint: EndpointDoc }) {
  return (
    <Card className="mb-8" id={endpoint.path.replace(/\//g, "-").slice(1)}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={endpoint.method === "GET" ? "default" : "secondary"}
            className="font-mono"
          >
            {endpoint.method}
          </Badge>
          <code className="bg-muted rounded px-2 py-1 text-lg font-semibold">
            {endpoint.path}
          </code>
        </div>
        <CardDescription className="mt-2 text-base">
          {endpoint.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="example">Example</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          <TabsContent value="parameters">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoint.parameters.map((param) => (
                  <TableRow key={param.name}>
                    <TableCell className="font-mono font-medium">
                      {param.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{param.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {param.required ? (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Optional
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {param.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="response">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoint.responseFields.map((field) => (
                  <TableRow key={field.field}>
                    <TableCell className="font-mono font-medium">
                      {field.field}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{field.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {field.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="example" className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Request</h4>
              <CodeBlock code={endpoint.example.request} language="bash" />
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">Response</h4>
              <CodeBlock code={endpoint.example.response} />
            </div>
          </TabsContent>

          <TabsContent value="errors">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status Code</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoint.errors.map((error, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Badge
                        variant={
                          error.status >= 400 ? "destructive" : "secondary"
                        }
                      >
                        {error.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {error.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function ApiDocsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="from-background via-background to-muted/20 relative overflow-hidden bg-gradient-to-br py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <Badge variant="secondary" className="mb-4">
              <Code className="mr-1 h-3 w-3" />
              Developer Resources
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              API Documentation
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Integrate federal budget data and comparisons into your
              applications with our RESTful API.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-bold">Quick Start</h2>
            <p className="text-muted-foreground max-w-2xl">
              Get started with a simple fetch request. No authentication
              required.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Fetch Example
              </CardTitle>
              <CardDescription>
                Compare a budget item with a comparison unit using JavaScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`// Compare Department of Defense budget to teacher salaries
const response = await fetch(
  '/api/compare?budgetId=defense&unitId=teacher-salary'
);
const data = await response.json();

console.log(data.comparison.displayString);
// "equivalent to 13.6 million teacher salaries"`}
                language="javascript"
              />
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                </div>
                <CardTitle>No Authentication</CardTitle>
                <CardDescription>
                  All endpoints are publicly accessible. No API keys required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Server className="text-primary h-6 w-6" />
                </div>
                <CardTitle>RESTful JSON</CardTitle>
                <CardDescription>
                  Standard REST API with JSON responses. Easy to integrate.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Zap className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Cached Responses</CardTitle>
                <CardDescription>
                  Responses are cached for performance. Fresh data updated
                  daily.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Base URL Section */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Base URL</CardTitle>
              <CardDescription>
                All API endpoints are relative to the base URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code="https://your-domain.com" language="bash" />
              <p className="text-muted-foreground mt-4 text-sm">
                Replace with your actual domain when making requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Endpoints Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-bold">Endpoints</h2>
            <p className="text-muted-foreground max-w-2xl">
              Complete reference for all available API endpoints.
            </p>
          </div>

          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Available Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {endpoints.map((endpoint) => (
                  <li key={endpoint.path}>
                    <a
                      href={`#${endpoint.path.replace(/\//g, "-").slice(1)}`}
                      className="text-primary hover:underline"
                    >
                      <Badge variant="outline" className="mr-2 font-mono">
                        {endpoint.method}
                      </Badge>
                      <code>{endpoint.path}</code>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Endpoint Details */}
          {endpoints.map((endpoint) => (
            <EndpointCard key={endpoint.path} endpoint={endpoint} />
          ))}
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-bold">Code Examples</h2>
            <p className="text-muted-foreground max-w-2xl">
              Common integration patterns for different use cases.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Search and Compare Workflow</CardTitle>
                <CardDescription>
                  Find a budget item and comparison unit, then calculate the
                  comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`// Step 1: Search for budget items
const budgetResults = await fetch('/api/budget/search?q=education');
const { results: budgetItems } = await budgetResults.json();

// Step 2: Search for comparison units
const unitResults = await fetch('/api/units/search?q=school');
const { units } = await unitResults.json();

// Step 3: Create the comparison
const comparison = await fetch(
  \`/api/compare?budgetId=\${budgetItems[0].id}&unitId=\${units[0].id}\`
);
const data = await comparison.json();

console.log(\`\${data.budgetItem.name} is \${data.comparison.displayString}\`);
// "Department of Education is equivalent to 1.2 million new schools"`}
                  language="javascript"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>React Hook Example</CardTitle>
                <CardDescription>
                  Using the API in a React component with SWR for data fetching
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function BudgetComparison({ budgetId, unitId }: Props) {
  const { data, error, isLoading } = useSWR(
    \`/api/compare?budgetId=\${budgetId}&unitId=\${unitId}\`,
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load comparison</div>;

  return (
    <div>
      <h2>{data.budgetItem.name}</h2>
      <p>Amount: \${data.budgetItem.amount.toLocaleString()}</p>
      <p>{data.comparison.displayString}</p>
    </div>
  );
}`}
                  language="typescript"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtering Units by Category</CardTitle>
                <CardDescription>
                  Search for units within specific categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`// Search healthcare units only
const healthcareUnits = await fetch(
  '/api/units/search?q=cost&category=healthcare'
);

// Search multiple categories
const educationAndHealthcare = await fetch(
  '/api/units/search?q=annual&category=healthcare,education'
);

// Parse the results
const { units, total, count } = await educationAndHealthcare.json();
console.log(\`Found \${total} units, showing \${count}\`);`}
                  language="javascript"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  Properly handling API errors in your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`async function safeCompare(budgetId: string, unitId: string) {
  try {
    const response = await fetch(
      \`/api/compare?budgetId=\${budgetId}&unitId=\${unitId}\`
    );

    if (!response.ok) {
      const error = await response.json();

      if (response.status === 400) {
        console.error('Missing parameters:', error.message);
      } else if (response.status === 404) {
        console.error('Item not found:', error.message);
      }

      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Network error:', err);
    return null;
  }
}`}
                  language="typescript"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rate Limiting Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <AlertCircle className="text-primary h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Rate Limiting</CardTitle>
                  <CardDescription>
                    Fair usage guidelines for API access
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Currently, no strict rate limits are enforced. However, we ask
                that you follow these guidelines for fair usage:
              </p>
              <ul className="text-muted-foreground ml-6 list-disc space-y-2">
                <li>
                  <strong>Reasonable Request Volume:</strong> Avoid making more
                  than 100 requests per minute from a single IP address.
                </li>
                <li>
                  <strong>Caching:</strong> Cache responses on your end when
                  possible. Budget data is updated daily, so aggressive
                  re-fetching is unnecessary.
                </li>
                <li>
                  <strong>Batch Operations:</strong> If you need multiple
                  comparisons, consider making requests sequentially rather than
                  all at once.
                </li>
                <li>
                  <strong>User-Agent Header:</strong> Include a descriptive
                  User-Agent header so we can identify your application.
                </li>
              </ul>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium">
                  Note on Future Rate Limiting
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Rate limiting may be introduced in the future if needed. Any
                  changes will be communicated in advance. For high-volume use
                  cases, please contact us.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Response Headers Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-bold">Response Headers</h2>
            <p className="text-muted-foreground max-w-2xl">
              Important headers returned with API responses.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Header</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono font-medium">
                      Content-Type
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted rounded px-2 py-0.5 text-sm">
                        application/json
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      All responses are JSON formatted
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono font-medium">
                      Cache-Control
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted rounded px-2 py-0.5 text-sm">
                        public, s-maxage=3600, stale-while-revalidate=86400
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Responses are cached for 1 hour, with
                      stale-while-revalidate for 24 hours
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-muted-foreground text-center">
            <p>
              Questions about the API? Open an issue on{" "}
              <a
                href="https://github.com/yourusername/budget-dashboard"
                className="text-primary hover:underline"
              >
                GitHub
              </a>{" "}
              or contact us at{" "}
              <a
                href="mailto:api@budgetdashboard.example"
                className="text-primary hover:underline"
              >
                api@budgetdashboard.example
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
