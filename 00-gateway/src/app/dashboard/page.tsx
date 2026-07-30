"use client";
import { useState } from "react";
import { useAvatarContext } from "@/context/AvatarContext";

const DASHBOARD_CODE = process.env.NEXT_PUBLIC_INVITE_CODE ?? "kupuri2006";

const tracks = [
  { label: "Bosque (predeterminado)", path: "/audio/birds39-forest-20772.mp3" },
  { label: "Pista 2 (próximamente)", path: "/audio/birds39-forest-20772.mp3" },
  { label: "Pista 3 (próximamente)", path: "/audio/birds39-forest-20772.mp3" },
];

function Dashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const { currentTrack, setCurrentTrack } = useAvatarContext();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === DASHBOARD_CODE) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="custom-bg rounded-lg p-8 max-w-sm w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-accent text-2xl font-bold tracking-widest">
              DASHBOARD
            </h1>
            <p className="text-muted text-sm">Ingresa tu código de acceso</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Código secreto"
              className="w-full bg-background/30 border border-accent/30 rounded px-4 py-2.5 text-foreground text-sm placeholder-muted focus:outline-none focus:border-accent/70"
            />
            {error && (
              <p className="text-red-400 text-xs text-center">
                Código incorrecto.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 border border-accent/40 rounded text-accent text-sm font-medium hover:shadow-glass-sm transition-all"
            >
              Entrar
            </button>
          </form>
          <p className="text-muted text-[10px] text-center">
            © 2026 Kupuri Media · Ivette Milo
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-start p-8 space-y-8 max-w-2xl mx-auto">
      <div className="w-full flex items-center justify-between border-b border-accent/20 pb-4">
        <h1 className="text-accent text-2xl font-bold tracking-widest">
          DASHBOARD
        </h1>
        <button
          onClick={() => setUnlocked(false)}
          className="text-muted text-xs hover:text-accent transition-colors"
        >
          Salir
        </button>
      </div>

      {/* Music section */}
      <section className="custom-bg rounded-lg p-6 w-full space-y-4">
        <h2 className="text-foreground font-semibold tracking-wide">
          Música del Avatar
        </h2>
        <p className="text-muted text-xs">
          Selecciona la pista de audio para el avatar.
        </p>
        <div className="space-y-2">
          {tracks.map((t) => (
            <button
              key={t.path + t.label}
              onClick={() => setCurrentTrack(t.path)}
              className={`w-full text-left px-4 py-2.5 rounded border text-sm transition-all ${
                currentTrack === t.path
                  ? "border-accent/70 text-accent shadow-glass-sm"
                  : "border-accent/20 text-muted hover:border-accent/40"
              }`}
            >
              {t.label}
              {currentTrack === t.path && (
                <span className="ml-2 text-[10px] tracking-wider">◆ ACTIVO</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Avatar section */}
      <section className="custom-bg rounded-lg p-6 w-full space-y-4">
        <h2 className="text-foreground font-semibold tracking-wide">
          Control del Avatar
        </h2>
        <p className="text-muted text-xs">
          Próximamente: control en tiempo real del avatar Agent Alex.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {["Bailar", "Saludar", "Reaccionar", "Modo sigiloso"].map((a) => (
            <button
              key={a}
              disabled
              className="px-4 py-2.5 rounded border border-accent/15 text-muted text-sm cursor-not-allowed opacity-50"
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* Blog section */}
      <section className="custom-bg rounded-lg p-6 w-full space-y-4">
        <h2 className="text-foreground font-semibold tracking-wide">
          Blog
        </h2>
        <p className="text-muted text-xs">
          Gestión de publicaciones del blog. Próximamente integración con CMS.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded border border-accent/15 text-muted text-sm cursor-not-allowed opacity-50"
        >
          Nueva publicación (próximamente)
        </button>
      </section>

      <p className="text-muted text-[10px] text-center w-full">
        © 2026 Kupuri Media · Agent Alex™ · Synthia 3.0™
      </p>
    </main>
  );
}

export default Dashboard;
