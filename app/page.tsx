import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-6xl font-bold text-primary mb-4">Swad Anusar</h1>
        <p className="text-xl text-text-secondary mb-8 font-poppins">
          Experience authentic flavors at Govindpuri, Gwalior.
          Taste that feels like home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/menu" 
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-light transition-all"
          >
            View Digital Menu
          </Link>
          <Link 
            href="/auth/login" 
            className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
          >
            Staff Login
          </Link>
        </div>
      </div>
    </main>
  )
}
