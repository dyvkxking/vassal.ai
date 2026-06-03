import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { AGENT_CATEGORIES } from '@/constants'

interface FilterState {
  search: string
  categories: string[]
  tpmRange: [number, number]
  latencyMax: number
  priceRange: [number, number]
  minQualityScore: number
  learningEnabled: boolean
  availabilityOnly: boolean
}

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Search</Label>
        <Input
          placeholder="Search agents..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>

      {/* Categories */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">Category</Label>
        <div className="space-y-2">
          {AGENT_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={filters.categories.includes(cat)}
                onCheckedChange={(checked) => {
                  const cats = checked
                    ? [...filters.categories, cat]
                    : filters.categories.filter((c) => c !== cat)
                  update({ categories: cats })
                }}
              />
              <label htmlFor={`cat-${cat}`} className="text-sm capitalize cursor-pointer flex-1">
                {cat.replace('-', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* TPM Range */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          TPM Required ({filters.tpmRange[0].toLocaleString()} — {filters.tpmRange[1].toLocaleString()})
        </Label>
        <Slider
          value={filters.tpmRange}
          onValueChange={(val) => update({ tpmRange: val as [number, number] })}
          min={1000}
          max={500000}
          step={1000}
          className="mt-2"
        />
      </div>

      {/* Latency Max */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          Max Latency: {filters.latencyMax}ms
        </Label>
        <Slider
          value={[filters.latencyMax]}
          onValueChange={(val) => update({ latencyMax: val[0] })}
          min={100}
          max={10000}
          step={100}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          Price ($/min): {filters.priceRange[0].toFixed(4)} — {filters.priceRange[1].toFixed(4)}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(val) => update({ priceRange: val as [number, number] })}
          min={0}
          max={1}
          step={0.0001}
          className="mt-2"
        />
      </div>

      {/* Min Quality Score */}
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
          Min Quality Score: {filters.minQualityScore}
        </Label>
        <Slider
          value={[filters.minQualityScore]}
          onValueChange={(val) => update({ minQualityScore: val[0] })}
          min={0}
          max={100}
          step={1}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="learning" className="text-sm">Self-Learning Only</Label>
          <Switch
            id="learning"
            checked={filters.learningEnabled}
            onCheckedChange={(checked) => update({ learningEnabled: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="available" className="text-sm">Available Now</Label>
          <Switch
            id="available"
            checked={filters.availabilityOnly}
            onCheckedChange={(checked) => update({ availabilityOnly: checked })}
          />
        </div>
      </div>

      {/* Clear */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={() => onChange({ search: '', categories: [], tpmRange: [1000, 500000], latencyMax: 10000, priceRange: [0, 1], minQualityScore: 0, learningEnabled: false, availabilityOnly: false })}
      >
        Clear Filters
      </Button>
    </div>
  )
}

export function FilterSheet({ filters, onChange }: FilterPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterPanel filters={filters} onChange={onChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}