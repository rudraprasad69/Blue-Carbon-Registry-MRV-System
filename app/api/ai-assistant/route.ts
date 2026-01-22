import { NextRequest, NextResponse } from 'next/server'
import { getAIProjectAssistant } from '@/lib/ai-project-assistant'

/**
 * POST /api/ai-assistant/query
 * Submit a query to the AI assistant
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, sessionId, projectContext } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const assistant = getAIProjectAssistant()
    const response = await assistant.answerQuery(query, projectContext)

    if (sessionId) {
      assistant.saveConversation(
        sessionId,
        query,
        response.response
      )
    }

    return NextResponse.json({
      success: true,
      response: {
        query: response.query,
        answer: response.response,
        confidence: response.confidence,
        sources: response.sources.slice(0, 3),
        recommendations: response.recommendations,
        followUpQuestions: response.followUpQuestions,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Assistant query error:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai-assistant/projects
 * Get all projects in the knowledge base
 */
export async function getProjects(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creditType = searchParams.get('creditType')
    const verified = searchParams.get('verified') === 'true'

    const assistant = getAIProjectAssistant()
    let projects = assistant.getAllProjects()

    if (creditType) {
      projects = projects.filter(p => p.creditType === creditType)
    }

    if (verified) {
      projects = projects.filter(p => p.verified)
    }

    return NextResponse.json({
      projects: projects.map(p => ({
        projectId: p.projectId,
        name: p.name,
        location: p.location,
        creditType: p.creditType,
        biomass: p.biomass,
        carbonSequestered: p.carbonSequestered.toLocaleString(),
        marketPrice: p.marketPrice.toFixed(2),
        verified: p.verified,
        trend: p.trend
      })),
      count: projects.length
    })
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai-assistant/conversation
 * Get conversation history
 */
export async function getConversation(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    const assistant = getAIProjectAssistant()
    const conversation = assistant.getConversationHistory(sessionId)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      sessionId: conversation.sessionId,
      messages: conversation.messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      })),
      messageCount: conversation.messages.length
    })
  } catch (error) {
    console.error('Conversation fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ai-assistant/market-analysis
 * Get detailed market analysis
 */
export async function marketAnalysis(request: NextRequest) {
  try {
    const body = await request.json()
    const { creditType = 'renewable' } = body

    const assistant = getAIProjectAssistant()
    const projects = assistant.searchProjects({ creditType: creditType as any })

    const avgPrice =
      projects.length > 0
        ? (projects.reduce((sum, p) => sum + p.marketPrice, 0) / projects.length).toFixed(2)
        : 0

    const totalCarbon = projects.reduce((sum, p) => sum + p.carbonSequestered, 0)

    const verifiedCount = projects.filter(p => p.verified).length

    return NextResponse.json({
      analysis: {
        creditType,
        projectCount: projects.length,
        averagePrice: avgPrice,
        totalCarbonSequestered: totalCarbon.toLocaleString(),
        verifiedProjects: verifiedCount,
        unverifiedProjects: projects.length - verifiedCount,
        marketShare: ((projects.length / 4) * 100).toFixed(1) + '%',
        trend: projects.some(p => p.trend === 'up') ? 'Bullish' : 'Bearish',
        recommendations: [
          `${creditType} market has ${projects.length} active projects`,
          `Average market price: $${avgPrice}/credit`,
          `Verified projects: ${verifiedCount}/${projects.length}`
        ]
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Market analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze market' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ai-assistant/project-recommendation
 * Get project recommendations based on criteria
 */
export async function projectRecommendation(request: NextRequest) {
  try {
    const body = await request.json()
    const { maxPrice = 20, minCarbonImpact = 0, preferVerified = true } = body

    const assistant = getAIProjectAssistant()
    let projects = assistant.getAllProjects()

    projects = projects
      .filter(p => p.marketPrice <= maxPrice)
      .filter(p => p.carbonSequestered >= minCarbonImpact)
      .filter(p => !preferVerified || p.verified)
      .sort((a, b) => {
        // Score by carbon impact and price
        const scoreA = (a.carbonSequestered / 1000) / a.marketPrice
        const scoreB = (b.carbonSequestered / 1000) / b.marketPrice
        return scoreB - scoreA
      })

    return NextResponse.json({
      recommendations: projects.slice(0, 5).map(p => ({
        projectId: p.projectId,
        name: p.name,
        location: p.location,
        creditType: p.creditType,
        marketPrice: p.marketPrice.toFixed(2),
        carbonSequestered: p.carbonSequestered.toLocaleString(),
        verified: p.verified,
        reason: p.verified ? 'Verified high-impact project' : 'Quality unverified project',
        scoreRatio: ((p.carbonSequestered / 1000) / p.marketPrice).toFixed(2)
      })),
      criteria: {
        maxPrice,
        minCarbonImpact,
        preferVerified
      }
    })
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai-assistant/insights
 * Get AI-generated insights about the market and projects
 */
export async function getInsights(request: NextRequest) {
  try {
    const assistant = getAIProjectAssistant()
    const projects = assistant.getAllProjects()

    const renewableProjects = projects.filter(p => p.creditType === 'renewable')
    const forestryProjects = projects.filter(p => p.creditType === 'forestry')
    const agricultureProjects = projects.filter(p => p.creditType === 'agriculture')

    const totalCarbon = projects.reduce((sum, p) => sum + p.carbonSequestered, 0)
    const avgPrice = projects.reduce((sum, p) => sum + p.marketPrice, 0) / projects.length

    return NextResponse.json({
      insights: {
        marketOverview: {
          totalProjects: projects.length,
          totalCarbonSequestered: totalCarbon.toLocaleString(),
          averagePrice: avgPrice.toFixed(2),
          verifiedProjects: projects.filter(p => p.verified).length
        },
        creditTypeAnalysis: {
          renewable: {
            count: renewableProjects.length,
            averagePrice: (renewableProjects.reduce((sum, p) => sum + p.marketPrice, 0) / renewableProjects.length).toFixed(2),
            momentum: renewableProjects.some(p => p.trend === 'up') ? 'Strong' : 'Moderate'
          },
          forestry: {
            count: forestryProjects.length,
            averagePrice: (forestryProjects.reduce((sum, p) => sum + p.marketPrice, 0) / forestryProjects.length).toFixed(2),
            momentum: forestryProjects.some(p => p.trend === 'up') ? 'Strong' : 'Moderate'
          },
          agriculture: {
            count: agricultureProjects.length,
            averagePrice: (agricultureProjects.reduce((sum, p) => sum + p.marketPrice, 0) / agricultureProjects.length).toFixed(2),
            momentum: agricultureProjects.some(p => p.trend === 'up') ? 'Strong' : 'Moderate'
          }
        },
        recommendations: [
          'Diversify portfolio across multiple credit types',
          'Renewable energy credits showing strong momentum',
          'Verified projects commanding 15-20% premium',
          'Consider long-term accumulation strategy',
          'Monitor upcoming policy changes'
        ],
        riskFactors: [
          'Market volatility ±5-10% monthly',
          'Regulatory changes could impact demand',
          'Weather events affecting projects',
          'Competition from traditional offsets'
        ]
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ai-assistant/suggest-trading-strategy
 * Get AI-suggested trading strategy
 */
export async function suggestTradingStrategy(request: NextRequest) {
  try {
    const body = await request.json()
    const { investmentAmount = 10000, riskTolerance = 'moderate', timeHorizon = '12 months' } = body

    return NextResponse.json({
      strategy: {
        investmentAmount: investmentAmount.toLocaleString(),
        riskTolerance,
        timeHorizon,
        allocations: {
          renewable: {
            percentage: riskTolerance === 'aggressive' ? 40 : 35,
            reason: 'Strong fundamentals and price momentum'
          },
          forestry: {
            percentage: riskTolerance === 'aggressive' ? 30 : 35,
            reason: 'High biodiversity co-benefits and premium pricing'
          },
          agriculture: {
            percentage: riskTolerance === 'aggressive' ? 20 : 20,
            reason: 'Stable prices and growing demand'
          },
          cash: {
            percentage: riskTolerance === 'aggressive' ? 10 : 10,
            reason: 'Flexibility for market opportunities'
          }
        },
        entryStrategy: 'Dollar-cost average 20% per week',
        exitStrategy: 'Harvest when 15-20% profit target reached',
        riskManagement: [
          'Limit single project exposure to <15% of portfolio',
          'Maintain 10% cash for volatility',
          'Rebalance quarterly'
        ],
        expectedReturn: '12-18% annually',
        worstCaseScenario: '-5% to -10%'
      },
      disclaimer: 'This is for informational purposes. Consult financial advisors before trading.',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Strategy error:', error)
    return NextResponse.json(
      { error: 'Failed to generate trading strategy' },
      { status: 500 }
    )
  }
}
