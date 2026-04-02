import { NextResponse } from "next/server";

const SEARCH_DATABASE = [
  { id: "1", title: "Project: Global Mangrove Alliance", category: "Projects", description: "Sourced in Indonesia, restoring 1,000 hectares.", url: "/dashboard" },
  { id: "2", title: "Project: Atlantic Seagrass Beds", category: "Projects", description: "Blue Carbon sequestration tracking in Florida.", url: "/dashboard" },
  { id: "3", title: "Project: Tropical Kelp Forest", category: "Projects", description: "Deep water carbon capture initiative.", url: "/dashboard" },
  
  { id: "4", title: "Marketplace Trading Board", category: "Pages", description: "Trade ERC-20 tokenized carbon credits.", url: "/market" },
  { id: "5", title: "MRV Analytics Dashboard", category: "Pages", description: "View real-time satellite imagery and drone LiDAR data.", url: "/analytics" },
  { id: "6", title: "Verification Pool", category: "Pages", description: "Expert consensus module for validating project carbon.", url: "/admin" },
  { id: "7", title: "Compliance Hub", category: "Pages", description: "Regulatory reporting and compliance standards.", url: "/admin" },
  
  { id: "8", title: "BCT (Base Carbon Tonne) Token", category: "Assets", description: "Standardized token representing 1 tonne of carbon.", url: "/market" },
  { id: "9", title: "Smart Contract: Emission Vault", category: "Assets", description: "Locked carbon credit offsets.", url: "/market" },
  
  { id: "10", title: "Connect Wallet", category: "Actions", description: "Link Wagmi / Ethers wallet to trade.", url: "/market" },
  { id: "11", title: "Generate Regulatory Report", category: "Actions", description: "Export CSV of total tons offset across projects.", url: "/admin" },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase();

    // Simulate backend indexing and latency (e.g. 200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!query || query.trim() === "") {
      return NextResponse.json({ results: [] });
    }

    // Filter DB where title or description or category includes the query
    const rawResults = SEARCH_DATABASE.filter((item) => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    // Grouping into categorized object for structured UI rendering
    const categorizedResults = rawResults.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof SEARCH_DATABASE>);
    
    // Sort keys so order is deterministic
    const finalGrouped = Object.keys(categorizedResults).map((catName) => {
      return {
        category: catName,
        items: categorizedResults[catName]
      };
    });

    return NextResponse.json({ results: finalGrouped });
  } catch (error) {
    return NextResponse.json({ error: "Backend Search Fault" }, { status: 500 });
  }
}
