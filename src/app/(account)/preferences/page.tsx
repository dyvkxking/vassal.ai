"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe, Calendar, DollarSign, Hash, Save } from 'lucide-react'

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish (Espanol)" },
  { value: "fr", label: "French (Francais)" },
  { value: "de", label: "German (Deutsch)" },
  { value: "ja", label: "Japanese (日本語)" },
  { value: "ko", label: "Korean (한국어)" },
  { value: "zh", label: "Chinese (中文)" },
]

const NUMBER_FORMATS = [
  { value: "en-US", label: "1,234.56 (US/UK)" },
  { value: "de-DE", label: "1.234,56 (German/French)" },
  { value: "fr-FR", label: "1 234,56 (French with spaces)" },
]

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (06/15/2024)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (15/06/2024)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-06-15)" },
  { value: "MMMM D, YYYY", label: "MMMM D, YYYY (June 15, 2024)" },
  { value: "D MMMM YYYY", label: "D MMMM YYYY (15 June 2024)" },
]

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (E)", symbol: "E" },
  { value: "GBP", label: "GBP (P)", symbol: "P" },
  { value: "JPY", label: "JPY (Y)", symbol: "Y" },
  { value: "CNY", label: "CNY (C)", symbol: "C" },
  { value: "KRW", label: "KRW (W)", symbol: "W" },
]

export default function PreferencesPage() {
  const [timezone, setTimezone] = useState("America/New_York")
  const [language, setLanguage] = useState("en")
  const [numberFormat, setNumberFormat] = useState("en-US")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [currency, setCurrency] = useState("USD")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaved(false)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-medium">Preferences</h1>
        <p className="mt-1 text-muted-foreground">
          Customize how dates, numbers, and currencies are displayed
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your preferred language and regional formatting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v || 'en')}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={(v) => setTimezone(v ?? timezone)}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Number & Date Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Number & Date Format
              </CardTitle>
              <CardDescription>
                Choose how numbers and dates are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number-format">Number Format</Label>
                <Select value={numberFormat} onValueChange={(v) => setNumberFormat(v ?? numberFormat)}>
                  <SelectTrigger id="number-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NUMBER_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: 1234.56 would display as{" "}
                  {(1234.56).toLocaleString(numberFormat)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={(v) => setDateFormat(v ?? dateFormat)}>
                  <SelectTrigger id="date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: June 15, 2024
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Currency Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency Display
              </CardTitle>
              <CardDescription>
                Select your preferred currency for displaying values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Display Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v ?? currency)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This affects how currency values are displayed throughout the app
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
            {saved && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                Preferences saved successfully!
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}