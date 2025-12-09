"use client"

export default function LogoCloud() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase">Trusted by Students from</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-50 grayscale">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-32 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground">University {i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
