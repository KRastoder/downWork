export default function SignOutButton() {
  const handleSignOut = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <button
      onClick={handleSignOut}
      className="hover:backdrop-blur-sm- cursor-pointer rounded-md px-4 py-2 text-2xl transition-all duration-200 hover:bg-white/30"
    >
      Sign out
    </button>
  )
}
