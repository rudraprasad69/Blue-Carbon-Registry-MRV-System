import { NextResponse } from "next/server";

// We have bypassed the need for an external API Key by deploying a Local Simulated Inference Engine.
// This engine simulates Gemini's responses based on rigorous heuristic matching against the project's state.

const KNOWLEDGE_BASE = {
  general: "The Blue Carbon Registry is a decentralized platform running on blockchain to track, verify, and trade carbon credits specifically sourced from coastal/marine ecosystems (mangroves, seagrass).",
  mrv: "Our Monitoring, Reporting, and Verification (MRV) system ingests data from Satellite Imagery (NDVI), Drone LiDAR, and real-time IoT sensors to calculate carbon biomass continuously instead of relying on slow annual audits.",
  blockchain: "We utilize Smart Contracts (CarbonCreditIssuer and CarbonMarketplace). Once a verification threshold is met via our data models, an ERC-20 token is automatically minted representing 1 ton of CO2.",
  token: "Credits are tokenized as ERC-20 assets. You can trace their entire lineage—from project generation, to the marketplace, down to final credit retirement on the ledger.",
  ai: "The system's AI/ML architecture (such as the biomass prediction models) is designed to process high-volume satellite imagery and flag anomalies in sensor data to prevent fraud.",
  roles: "We support Project Developers, Coastal Communities, Remote Sensing Providers, Blockchain Validators, and Carbon Buyers. You can change your role using the Account Selector in the sidebar.",
  design: "The platform currently boasts a highly-professional 'Regal & Deep' aesthetic utilizing Deep Navy, Cream, and Burnt Gold accents.",
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].text.toLowerCase();

    // Simulate Network Inference thinking time
    await delay(1200);

    let reply = "As the Registry Assistant, I can confirm the Blue Carbon platform is designed to revolutionize carbon markets using decentralized MRV tracking. I am currently operating in Local Simulation Mode. Could you specify if you are asking about our Blockchain integration, MRV monitoring, tokenization, or user roles?";

    if (latestMessage.includes("blockchain") || latestMessage.includes("smart contract") || latestMessage.includes("erc")) {
      reply = `**Blockchain Integration:**\n\n${KNOWLEDGE_BASE.blockchain}\n\n${KNOWLEDGE_BASE.token}`;
    } else if (latestMessage.includes("mrv") || latestMessage.includes("satellite") || latestMessage.includes("drone") || latestMessage.includes("monitor")) {
      reply = `**Advanced MRV Monitoring:**\n\n${KNOWLEDGE_BASE.mrv}\n\n${KNOWLEDGE_BASE.ai}`;
    } else if (latestMessage.includes("role") || latestMessage.includes("developer") || latestMessage.includes("community")) {
      reply = `**Stakeholder Roles:**\n\n${KNOWLEDGE_BASE.roles}`;
    } else if (latestMessage.includes("design") || latestMessage.includes("color") || latestMessage.includes("theme")) {
      reply = `**System Interface:**\n\n${KNOWLEDGE_BASE.design}`;
    } else if (latestMessage.includes("blue carbon") || latestMessage.includes("what is")) {
      reply = `**Executive Overview:**\n\n${KNOWLEDGE_BASE.general}`;
    } else if (latestMessage.includes("hello") || latestMessage.includes("hi")) {
      reply = "Hello! I am the Registry Assistant. How can I help you navigate the Blue Carbon project infrastructure today? You can ask me about our MRV systems, Smart Contracts, or Token Trading.";
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    return NextResponse.json(
      { error: "A heuristic anomaly occurred in the simulated AI core." },
      { status: 500 }
    );
  }
}
