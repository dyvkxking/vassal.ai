'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Progress,
} from '@/components/ui'
import { MOCK_SKILLS, MOCK_USER_PROFILE } from '@/lib/mock-data'
import type { Skill, SkillStatus } from '@/types'

// Audit status stages
type AuditStage = 'submitted' | 'in_review' | 'approved' | 'rejected'

interface AuditEntry {
  stage: AuditStage
  timestamp: number
  note?: string
}

interface SkillWithAudit extends Skill {
  auditHistory: AuditEntry[]
  earningsThisMonth: number
}

// Filter skills by current user (use mock profile address)
function getMySkills(): SkillWithAudit[] {
  const myAddress = MOCK_USER_PROFILE.address

  return MOCK_SKILLS.filter(skill => skill.author === myAddress).map(skill => ({
    ...skill,
    auditHistory: generateAuditHistory(skill.status),
    earningsThisMonth: Math.random() * 500 + 50,
  }))
}

function generateAuditHistory(status: SkillStatus): AuditEntry[] {
  const now = Date.now()
  switch (status) {
    case 'approved':
      return [
        { stage: 'submitted', timestamp: now - 14 * 86400000 },
        { stage: 'in_review', timestamp: now - 12 * 86400000, note: 'Assigned to reviewer' },
        { stage: 'approved', timestamp: now - 10 * 86400000 },
      ]
    case 'under_review':
      return [
        { stage: 'submitted', timestamp: now - 3 * 86400000 },
        { stage: 'in_review', timestamp: now - 1 * 86400000, note: 'Under technical review' },
      ]
    case 'rejected':
      return [
        { stage: 'submitted', timestamp: now - 7 * 86400000 },
        { stage: 'in_review', timestamp: now - 5 * 86400000 },
        { stage: 'rejected', timestamp: now - 3 * 86400000, note: 'Schema validation failed' },
      ]
    case 'deprecated':
      return [
        { stage: 'submitted', timestamp: now - 60 * 86400000 },
        { stage: 'in_review', timestamp: now - 58 * 86400000 },
        { stage: 'approved', timestamp: now - 55 * 86400000 },
      ]
    default:
      return [{ stage: 'submitted', timestamp: now - 2 * 86400000 }]
  }
}

function StatusBadge({ status }: { status: SkillStatus }) {
  const variants: Record<SkillStatus, { label: string; className: string }> = {
    approved: { label: 'Approved', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    under_review: { label: 'Under Review', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    rejected: { label: 'Rejected', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
    deprecated: { label: 'Deprecated', className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    draft: { label: 'Draft', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  }

  const variant = variants[status] || variants.draft

  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function AuditStatusTracker({ auditHistory }: { auditHistory: AuditEntry[] }) {
  const stages: AuditStage[] = ['submitted', 'in_review', 'approved']

  const getStageIndex = (stage: AuditStage) => stages.indexOf(stage)
  const currentStageIndex = auditHistory.length > 0
    ? Math.max(...auditHistory.map(h => getStageIndex(h.stage)))
    : -1

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {stages.map((stage, idx) => {
          const entry = auditHistory.find(h => h.stage === stage)
          const isComplete = idx <= currentStageIndex
          const isCurrent = idx === currentStageIndex && entry

          return (
            <div key={stage} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isComplete
                    ? idx === currentStageIndex
                      ? 'bg-yellow-500 text-white'
                      : 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {idx < currentStageIndex ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 capitalize">
                  {stage.replace('_', ' ')}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div className={`flex-1 h-0.5 ${idx < currentStageIndex ? 'bg-emerald-500' : 'bg-muted'}`} />
              )}
            </div>
          )
        })}
      </div>
      {auditHistory.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Last update: {new Date(auditHistory[auditHistory.length - 1].timestamp).toLocaleString()}
        </p>
      )}
    </div>
  )
}

function StatsCards({ skills }: { skills: SkillWithAudit[] }) {
  const totalSkills = skills.length
  const totalEarnings = skills.reduce((sum, s) => sum + s.earningsThisMonth, 0)
  const totalInvocations = skills.reduce((sum, s) => sum + s.usageCount, 0)
  const avgRating = skills.length > 0
    ? skills.reduce((sum, s) => sum + s.avgRating, 0) / skills.length
    : 0

  const stats = [
    { label: 'Total Skills', value: totalSkills, icon: '🛠️' },
    { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, icon: '💰' },
    { label: 'Total Invocations', value: totalInvocations.toLocaleString(), icon: '📊' },
    { label: 'Avg Rating', value: avgRating.toFixed(1), icon: '⭐' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <span>{stat.icon}</span>
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SkillCard({ skill, onDeprecate }: { skill: SkillWithAudit; onDeprecate: (id: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2">
              {skill.name}
              <Badge variant="outline">v{skill.version}</Badge>
            </CardTitle>
            <CardDescription className="line-clamp-2">{skill.description}</CardDescription>
          </div>
          <StatusBadge status={skill.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Usage Count</div>
            <div className="text-lg font-semibold">{skill.usageCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Earnings (Month)</div>
            <div className="text-lg font-semibold font-mono">${skill.earningsThisMonth.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rating</div>
            <div className="flex items-center gap-1">
              <StarRating rating={skill.avgRating} />
              <span className="text-sm font-medium">{skill.avgRating}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Price/Call</div>
            <div className="text-sm font-mono">{skill.pricePerInvocation.toFixed(6)} MESH</div>
          </div>
        </div>

        <Separator />

        {/* Audit Status */}
        <div>
          <div className="text-sm font-medium mb-3">Audit Status</div>
          <AuditStatusTracker auditHistory={skill.auditHistory} />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Link href={`/skill/${skill.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" className="flex-1">
            Update Skill
          </Button>
          {skill.status !== 'deprecated' && (
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
              onClick={() => onDeprecate(skill.id)}
            >
              Deprecate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AuditOverview({ skills }: { skills: SkillWithAudit[] }) {
  const pendingReview = skills.filter(s => s.status === 'under_review').length
  const approvedCount = skills.filter(s => s.status === 'approved').length
  const rejectedCount = skills.filter(s => s.status === 'rejected').length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Overview</CardTitle>
        <CardDescription>Track the review status of your submitted skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Approved</span>
            <div className="flex items-center gap-2">
              <Progress value={(approvedCount / Math.max(skills.length, 1)) * 100} className="w-24 h-2" />
              <Badge className="bg-emerald-500/10 text-emerald-500">{approvedCount}</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Under Review</span>
            <div className="flex items-center gap-2">
              <Progress value={(pendingReview / Math.max(skills.length, 1)) * 100} className="w-24 h-2" />
              <Badge className="bg-yellow-500/10 text-yellow-500">{pendingReview}</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Rejected</span>
            <div className="flex items-center gap-2">
              <Progress value={(rejectedCount / Math.max(skills.length, 1)) * 100} className="w-24 h-2" />
              <Badge className="bg-red-500/10 text-red-500">{rejectedCount}</Badge>
            </div>
          </div>
        </div>

        {pendingReview > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-500">
              You have {pendingReview} skill{pendingReview > 1 ? 's' : ''} pending review.
              Our team typically reviews submissions within 48 hours.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MySkillsPage() {
  const [skills, setSkills] = useState<SkillWithAudit[]>(getMySkills())

  const handleDeprecate = (skillId: string) => {
    // In a real app, this would call an API
    setSkills(prev =>
      prev.map(s =>
        s.id === skillId
          ? {
              ...s,
              status: 'deprecated' as SkillStatus,
              auditHistory: [
                ...s.auditHistory,
                { stage: 'approved', timestamp: s.auditHistory[s.auditHistory.length - 1]?.timestamp || Date.now() },
              ],
            }
          : s
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Published Skills</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track the performance of your skill contributions
            </p>
          </div>
          <Button>
            <Link href="/skills/new">Publish New Skill</Link>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mb-8">
          <StatsCards skills={skills} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Skills ({skills.length})</TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({skills.filter(s => s.status === 'approved').length})
            </TabsTrigger>
            <TabsTrigger value="under_review">
              Under Review ({skills.filter(s => s.status === 'under_review').length})
            </TabsTrigger>
            <TabsTrigger value="deprecated">
              Deprecated ({skills.filter(s => s.status === 'deprecated').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {skills.length > 0 ? (
                  skills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} onDeprecate={handleDeprecate} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">
                        You have not published any skills yet.
                      </p>
                      <Button>
                        <Link href="/skills/new">Publish Your First Skill</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div>
                <AuditOverview skills={skills} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {skills.filter(s => s.status === 'approved').map(skill => (
              <SkillCard key={skill.id} skill={skill} onDeprecate={handleDeprecate} />
            ))}
          </TabsContent>

          <TabsContent value="under_review" className="space-y-4">
            {skills.filter(s => s.status === 'under_review').map(skill => (
              <SkillCard key={skill.id} skill={skill} onDeprecate={handleDeprecate} />
            ))}
          </TabsContent>

          <TabsContent value="deprecated" className="space-y-4">
            {skills.filter(s => s.status === 'deprecated').map(skill => (
              <SkillCard key={skill.id} skill={skill} onDeprecate={handleDeprecate} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}