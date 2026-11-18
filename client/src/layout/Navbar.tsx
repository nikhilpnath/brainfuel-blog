import { Link } from "react-router";
import { useRef, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function Links({
  className,
  screen,
  onLinkClick,
}: {
  className: string;
  screen: "mobile" | "desktop";
  onLinkClick?: () => void;
}) {
  return (
    <div className={`${className} linksCollection`}>
      <Link to="/" onClick={onLinkClick}>
        Home
      </Link>
      {screen === "mobile" && (
        <Link to="/create" onClick={onLinkClick}>
          Create Post
        </Link>
      )}
      <Link to="/posts?sort=trending" onClick={onLinkClick}>
        Trending
      </Link>
      <Link to="/posts?sort=popular" onClick={onLinkClick}>
        Most Popular
      </Link>
      <Link to="/about" onClick={onLinkClick}>
        About
      </Link>
      <SignedOut>
        <Link to="/login" onClick={onLinkClick}>
          <button className="bg-blue-800 text-white rounded-3xl px-4 py-2 cursor-pointer">
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDialogElement | null>(null);

  const openDrawer = () => {
    setIsOpen(true);
    drawerRef.current?.showModal();
  };

  const closeDrawer = () => {
    drawerRef.current?.close();
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="w-full h-16 md:h-20 flex items-center justify-between"
    >
      {/* LOGO */}
      <Link to="/" className="flex gap-3 items-center text-2xl font-bold group">
        <img
          src="/logo.png"
          alt="BrainFuel logo"
          className="w-9 h-9 object-contain rounded-xl transition-transform group-hover:scale-105"
          width="36"
          height="36"
        />
        <span className="tracking-tight text-gray-900 font-extrabold text-2xl">
          Brain<span className="text-blue-800">Fuel</span>
        </span>
      </Link>

      {/* Mobile Menu Trigger */}
      <div className="md:hidden">
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-drawer"
          onClick={openDrawer}
          className="text-2xl p-2 cursor-pointer focus:outline-none"
        >
          ☰
        </button>

        {/* Native Dialog Navigation Drawer */}
        <dialog
          ref={drawerRef}
          id="mobile-drawer"
          aria-label="Navigation drawer"
          className="fixed inset-0 m-0 w-full h-[100dvh] max-w-none max-h-none bg-[#6e6eff] text-white p-6 backdrop:bg-black/50 backdrop:backdrop-blur-xs flex-col justify-center items-center open:flex"
          onClose={() => setIsOpen(false)}
          onClick={(e) => {
            if (e.target === drawerRef.current) closeDrawer();
          }}
        >
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className="absolute top-5 right-6 text-3xl font-light text-white cursor-pointer"
          >
            ✕
          </button>
          <Links
            screen="mobile"
            className="flex flex-col justify-center items-center gap-8 text-xl font-medium"
            onLinkClick={closeDrawer}
          />
        </dialog>
      </div>

      {/* Desktop Menu */}
      <Links
        className="hidden md:flex items-center gap-8 xl:gap-12 font-medium"
        screen="desktop"
      />
    </nav>
  );
};

export default Navbar;
