import Image from "next/image";
import bg from "../../../public/background/about-background.png";

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative pb-12">
      <Image
        priority
        sizes="100vw"
        src={bg}
        alt="background-image"
        fill
        className="-z-50 w-full h-full object-cover object-center opacity-40"
      />

      <div className="relative z-10 max-w-2xl w-full mx-auto px-6 text-center space-y-8">
        {/* Decorative top line */}
        <div
          className="h-px w-32 mx-auto"
          style={{
            background: "linear-gradient(90deg, transparent, #FEFE5B, transparent)",
          }}
        />

        {/* Icon */}
        <div className="text-6xl select-none">✦</div>

        <div className="space-y-4">
          <h1 className="text-4xl xs:text-5xl font-black tracking-widest text-accent uppercase">
            Blog
          </h1>
          <p className="text-muted text-lg font-light tracking-wide">
            — Próximamente —
          </p>
        </div>

        <p className="text-foreground/70 text-base leading-relaxed max-w-md mx-auto">
          Los pensamientos, ideas y secretos de Ivette Milo llegarán pronto.
          <br />
          <span className="text-accent/60 text-sm italic">
            Solo por invitación.
          </span>
        </p>

        {/* Decorative bottom line */}
        <div
          className="h-px w-32 mx-auto"
          style={{
            background: "linear-gradient(90deg, transparent, #FEFE5B, transparent)",
          }}
        />

        <p className="text-muted text-xs tracking-widest uppercase">
          Kupuri Media · Agent Alex™ · Synthia 3.0™
        </p>
      </div>
    </main>
  );
}
