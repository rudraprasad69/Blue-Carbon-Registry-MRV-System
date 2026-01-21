"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vote } from "lucide-react"

export function GovernanceVoting() {
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})

  const proposals = [
    {
      id: "prop-1",
      title: "Increase APY to 22% for Salt Marsh Credits",
      description: "Proposal to boost rewards for lower-yielding ecosystem",
      votes_for: 8420,
      votes_against: 1250,
      voting_power: 750,
      status: "active",
    },
    {
      id: "prop-2",
      title: "Enable Cross-Chain Staking",
      description: "Allow staking via Polygon and Arbitrum networks",
      votes_for: 12500,
      votes_against: 3200,
      voting_power: 750,
      status: "active",
    },
    {
      id: "prop-3",
      title: "Treasury Allocation for Development",
      description: "Allocate $500K for protocol development",
      votes_for: 15680,
      votes_against: 2100,
      voting_power: 0,
      status: "closed",
    },
  ]

  const totalVotingPower = 750

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-accent" />
          Governance Voting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-muted-foreground">Your Voting Power</p>
          <p className="text-2xl font-bold text-accent">{totalVotingPower} votes</p>
        </div>

        <div className="space-y-3">
          {proposals.map((proposal) => {
            const total = proposal.votes_for + proposal.votes_against
            const forPercentage = (proposal.votes_for / total) * 100

            return (
              <div key={proposal.id} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{proposal.description}</p>
                  </div>
                  <Badge
                    className={
                      proposal.status === "active"
                        ? "bg-blue-500/20 text-blue-700 border-0"
                        : "bg-gray-500/20 text-gray-700 border-0"
                    }
                  >
                    {proposal.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>For: {proposal.votes_for.toLocaleString()}</span>
                    <span>Against: {proposal.votes_against.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${forPercentage}%` }}
                    />
                  </div>
                </div>

                {proposal.status === "active" && proposal.voting_power > 0 && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={userVotes[proposal.id] === "for" ? "default" : "outline"}
                      className="flex-1 bg-transparent"
                      onClick={() => setUserVotes({ ...userVotes, [proposal.id]: "for" })}
                    >
                      Vote For
                    </Button>
                    <Button
                      size="sm"
                      variant={userVotes[proposal.id] === "against" ? "default" : "outline"}
                      className="flex-1 bg-transparent"
                      onClick={() => setUserVotes({ ...userVotes, [proposal.id]: "against" })}
                    >
                      Vote Against
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
