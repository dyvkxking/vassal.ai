'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getAgentById } from '@/lib/mock-data'
import { toast } from 'sonner'

type SortOption = 'newest' | 'highest' | 'lowest' | 'most_helpful'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function RatingSummaryCard({ agent }: { agent: NonNullable<ReturnType<typeof getAgentById>> }) {
  const reviews = [
    { id: 'rev-001', client: '0xClient...a1b2', rating: 5, text: 'Exceptional performance.', date: new Date(Date.now() - 2 * 86400000).toISOString(), helpful: 12 },
    { id: 'rev-002', client: '0xClient...c3d4', rating: 4, text: 'Solid analysis with good depth.', date: new Date(Date.now() - 5 * 86400000).toISOString(), helpful: 8 },
    { id: 'rev-003', client: '0xClient...e5f6', rating: 5, text: 'Impressive capabilities.', date: new Date(Date.now() - 8 * 86400000).toISOString(), helpful: 15 },
    { id: 'rev-004', client: '0xClient...g7h8', rating: 4, text: 'ArrowRightod overall. Minor delays during peak.', date: new Date(Date.now() - 12 * 86400000).toISOString(), helpful: 3 },
    { id: 'rev-005', client: '0xClient...i9j0', rating: 5, text: 'Best agent in this category.', date: new Date(Date.now() - 15 * 86400000).toISOString(), helpful: 21 },
  ]

  const distribution = [0, 0, 0, 0, 0]
  reviews.forEach((r) => distribution[r.rating - 1]++)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">{agent.avgRating}</div>
            <StarRating rating={Math.round(agent.avgRating)} />
            <div className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</div>
          </div>
          <Separator orientation="vertical" className="h-16" />
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star - 1]
              const percent = (count / reviews.length) * 100
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs w-3">{star}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AgentReviewsPage() {
  const params = useParams()
  const agentId = params.id as string
  const agent = getAgentById(agentId)

  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Agent Not Found</CardTitle>
            <CardDescription>
              The agent you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Link href="/browse-agents">Browse Agents</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const reviews = [
    { id: 'rev-001', client: '0xClient...a1b2', rating: 5, text: 'Exceptional performance. The agent delivered accurate yield analysis within milliseconds. Highly recommended for DeFi protocols.', date: new Date(Date.now() - 2 * 86400000).toISOString(), helpful: 12 },
    { id: 'rev-002', client: '0xClient...c3d4', rating: 4, text: 'Solid analysis with good depth. Response times consistently met the SLA thresholds. Will rent again.', date: new Date(Date.now() - 5 * 86400000).toISOString(), helpful: 8 },
    { id: 'rev-003', client: '0xClient...e5f6', rating: 5, text: 'The wallet intelligence capabilities are impressive. Found several arbitrage opportunities thanks to the real-time alerts.', date: new Date(Date.now() - 8 * 86400000).toISOString(), helpful: 15 },
    { id: 'rev-004', client: '0xClient...g7h8', rating: 4, text: 'ArrowRightod overall. Minor delays during peak traffic periods but within acceptable bounds. Quality of insights is top-notch.', date: new Date(Date.now() - 12 * 86400000).toISOString(), helpful: 3 },
    { id: 'rev-005', client: '0xClient...i9j0', rating: 5, text: 'Best agent in this category. The MEV detection accuracy is remarkable. Saved our protocol from multiple exploit attempts.', date: new Date(Date.now() - 15 * 86400000).toISOString(), helpful: 21 },
  ]

  // Filter and sort reviews
  let filteredReviews = [...reviews]
  if (ratingFilter !== 'all') {
    filteredReviews = filteredReviews.filter((r) => r.rating === ratingFilter)
  }

  switch (sortBy) {
    case 'newest':
      filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'highest':
      filteredReviews.sort((a, b) => b.rating - a.rating)
      break
    case 'lowest':
      filteredReviews.sort((a, b) => a.rating - b.rating)
      break
    case 'most_helpful':
      filteredReviews.sort((a, b) => b.helpful - a.helpful)
      break
  }

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    toast.success(helpful ? 'Marked as helpful' : 'Marked as not helpful')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href={`/agent/${agent.id}`} className="hover:text-foreground">
              {agent.name}
            </Link>
            <span>/</span>
            <span>Reviews</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Reviews</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <RatingSummaryCard agent={agent} />

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <Select
                    value={ratingFilter === 'all' ? 'all' : ratingFilter.toString()}
                    onValueChange={(v) => setRatingFilter(v === 'all' ? 'all' : parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      <SelectItem value="5">5 stars</SelectItem>
                      <SelectItem value="4">4 stars</SelectItem>
                      <SelectItem value="3">3 stars</SelectItem>
                      <SelectItem value="2">2 stars</SelectItem>
                      <SelectItem value="1">1 star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="highest">Highest rating</SelectItem>
                      <SelectItem value="lowest">Lowest rating</SelectItem>
                      <SelectItem value="most_helpful">Most helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredReviews.length} reviews
              </span>
            </div>

            {filteredReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs">
                            {review.client.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-muted-foreground">
                                {review.client}
                              </span>
                              <StarRating rating={review.rating} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{review.text}</p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleHelpful(review.id, true)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              👍 Helpful ({review.helpful})
                            </button>
                            <button
                              onClick={() => handleHelpful(review.id, false)}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              👎 Not helpful
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more reviews.
                </p>
              </div>
            )}

            {/* Write Review Card */}
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">✍️</div>
                <h3 className="font-semibold mb-1">Write a Review</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your experience with this agent
                </p>
                <Button variant="outline">Write Review</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}