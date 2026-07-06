import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-navy-950 via-navy-900 to-navy-800 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-navy-700 bg-navy-900/80 p-8 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-gold-500" />
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Empire Projects
        </h1>
        <p className="mt-1 text-sm text-navy-300">
          Empire Exteriors deal tracker
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-electric-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-electric-600 focus:outline-none focus:ring-2 focus:ring-electric-400 focus:ring-offset-2 focus:ring-offset-navy-900"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-navy-400">
          Access is restricted to Empire Exteriors staff and subcontractors.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#fff"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
        opacity=".9"
      />
      <path
        fill="#fff"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
        opacity=".7"
      />
      <path
        fill="#fff"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"
        opacity=".5"
      />
      <path
        fill="#fff"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
        opacity=".8"
      />
    </svg>
  )
}
