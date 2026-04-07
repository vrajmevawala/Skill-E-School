import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Users, Briefcase, GraduationCap, Menu, X, LogOut, User, LayoutDashboard, ChevronDown, Book as BookIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userInitials = user?.profile
    ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    cn(
      "text-base font-semibold px-4 py-2.5 rounded-lg transition-colors",
      isActive(path)
        ? "text-primary bg-primary/10"
        : "text-slate-600 hover:text-primary hover:bg-slate-50"
    );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 md:h-24 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-nav.png" alt="Skill E-School" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "text-base font-semibold px-4 py-2.5 rounded-lg transition-colors bg-transparent",
                  ["/courses", "/webinars", "/consultancy"].some(p => isActive(p))
                    ? "text-primary"
                    : "text-slate-600 hover:text-primary"
                )}>Programs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-blue-900 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                          to="/courses"
                        >
                          <BookOpen className="h-6 w-6 text-white" />
                          <div className="mb-2 mt-4 text-lg font-semibold text-white">
                            All Courses
                          </div>
                          <p className="text-sm leading-tight text-white/80">
                            Explore our comprehensive library of skill-based learning programs.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/webinars" className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50">
                          <div className="text-sm font-medium leading-none">Live Webinars</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 mt-1">
                            Join expert-led sessions and interactive workshops.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/consultancy" className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50">
                          <div className="text-sm font-medium leading-none">Consultancy Hub</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500 mt-1">
                            Book 1-on-1 mentorship sessions with industry leaders.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/books" className={navLinkClass("/books")}>Books</Link>
          <Link to="/franchise" className={navLinkClass("/franchise") }>Franchise</Link>

          {user?.role === "ADMIN" && (
            <Link to="/admin" className={cn(navLinkClass("/admin"), "text-indigo-600 font-semibold")}>
              Admin Dashboard
            </Link>
          )}

          <Link to="/about" className={navLinkClass("/about")}>About</Link>

          <Link to="/updates" className={cn(navLinkClass("/updates"), "flex items-center gap-1.5")}>
            Updates
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs">
                    {userInitials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.profile?.firstName || user.email}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-gray-200">
                <div className="px-2 py-3 mb-1">
                  <p className="text-sm font-semibold text-gray-900 leading-none mb-1">
                    {user.profile?.firstName} {user.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 leading-none">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-gray-100" />

                {user.role === "STUDENT" && (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer py-2.5 rounded-lg font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                      <User className="h-4 w-4" /> Profile Details
                    </Link>
                  </DropdownMenuItem>
                )}

                {user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer py-2.5 rounded-lg font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> Management Panel
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg px-5 py-2.5 text-base font-semibold cursor-pointer">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-2.5 text-base font-bold shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="hover:bg-gray-100 rounded-lg cursor-pointer">
            {isOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-1 animate-in slide-in-from-top-2">
          <Link to="/courses" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/courses") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>Courses</Link>
          <Link to="/webinars" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/webinars") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>Webinars</Link>
          <Link to="/consultancy" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/consultancy") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>Consultancy</Link>
          <Link to="/books" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/books") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>Books</Link>
          <Link to="/franchise" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/franchise") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>Franchise</Link>
          <Link to="/updates" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2", isActive("/updates") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>
            Updates <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </Link>
          <Link to="/about" className={cn("block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive("/about") ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50")} onClick={() => setIsOpen(false)}>About</Link>

          <div className="border-t border-gray-100 my-2 pt-2" />

          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-1">
                  <p className="font-semibold text-gray-900 leading-none mb-1">{user.profile?.firstName} {user.profile?.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                {user.role === "STUDENT" && (
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-11 rounded-lg justify-start font-medium border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> My Profile
                    </Button>
                  </Link>
                )}

                {user.role === "ADMIN" && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-11 rounded-lg justify-start font-medium border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Management Panel
                    </Button>
                  </Link>
                )}

                <Button className="h-11 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white cursor-pointer" onClick={() => { handleLogout(); setIsOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                  <Link to="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
