import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import { Image } from "@/components";

function Links({
  className,
  screen,
}: {
  className: string;
  screen: "mobile" | "desktop";
}) {
  return (
    <div className={className}>
      <Link to="/">Home</Link>
      {screen === "mobile" && <Link to="/create">Create Post</Link>}
      <Link to="/posts?sort=trending">Trending</Link>
      <Link to="/posts?sort=popular">Most Popular</Link>
      <Link to="/">About</Link>
      <SignedOut>
        <Link to="/login">
          <button className="bg-blue-800 text-white rounded-3xl px-4 py-2">
            SignIn 👋
          </button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation(); // Get current route

  //disabling scroll on y direction when the navbar is open
  useEffect(
    function disableScrollOnY() {
      if (!open) {
        return;
      }
      document.body.style.overflowY = "hidden";

      return () => {
        document.body.style.overflowY = "scroll";
      };
    },
    [open]
  );

  // Close menu automatically when route changes
  useEffect(
    function closeMenu() {
      setOpen(false);
    },
    [location.pathname]
  );

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex gap-4 items-center text-2xl font-bold">
        <Image src="logo.png" alt="logo" className="w-8" w="32" h="32" />
        <span className="first-letter:text-4xl tracking-wide ">BrainFuel</span>
      </Link>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div
          className="cursor-pointer text-2xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "X" : "☰"}
        </div>
        {/* MOBILE LINKS */}
        <Links
          className={`w-full h-screen flex flex-col justify-center items-center absolute top-16 bg-[#6e6eff] transition-all ease-out gap-8 text-lg font-medium text-white z-10 ${
            open ? "-right-0" : "-right-[100%]"
          }`}
          screen="mobile"
        />
      </div>

      {/* Desktop Menu */}
        <Links
        className="hidden md:flex items-center gap-8 xl:gap-12 font-medium"
        screen="desktop"
        />
    </div>
  );
};

export default Navbar;
