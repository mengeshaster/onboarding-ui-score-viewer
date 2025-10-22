import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Not Found</h2>
        <p className="mt-2 text-muted-foreground">Could not find requested resource</p>
        <Link
          href="/onboarding"
          className="mt-4 inline-block rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Return to Onboarding
        </Link>
      </div>
    </div>
  )
}
