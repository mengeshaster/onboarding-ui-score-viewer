import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Investment Readiness Assessment</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Discover your investment readiness score and get personalized recommendations.
        </p>
        <div className="mt-10">
          <Link
            href="/onboarding"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}
