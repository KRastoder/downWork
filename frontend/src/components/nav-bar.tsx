import SignOutButton from "./signOutButton"

export default function Navbar() {
  const token = localStorage.getItem("token")
  const isLoggedIn = !!token

  return (
    <nav className="flex items-center justify-between px-10 py-5">
      <h1 className="rotate-[-5deg] text-3xl font-bold">
        <span className="text-green-500">DOWN</span>
        <span className="text-pink-500">_</span>
        <span className="text-yellow-500">WORK</span>
      </h1>

      <div className="flex gap-2">
        <a
          href="/"
          className="rounded-md px-4 py-2 text-2xl transition-all duration-200 hover:bg-white/30 hover:backdrop-blur-sm"
        >
          Home
        </a>

        {isLoggedIn ? (
          <SignOutButton />
        ) : (
          <a
            href="/sign-in"
            className="rounded-md px-4 py-2 text-2xl transition-all duration-200 hover:bg-white/30 hover:backdrop-blur-sm"
          >
            Sign in
          </a>
        )}
      </div>
    </nav>
  )
}
