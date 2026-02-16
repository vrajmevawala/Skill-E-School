import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BookOpen, Users, Briefcase, GraduationCap, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {/* <div className="bg-primary p-1.5 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div> */}
          <span className="text-xl font-bold tracking-tight">Skill E-School</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Programs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                          to="/courses"
                        >
                          <BookOpen className="h-6 w-6 text-white" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            All Courses
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Explore our comprehensive library of skill-based learning programs.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/webinars" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Live Webinars</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Join expert-led sessions and interactive workshops.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/consultancy" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Consultancy Hub</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Book 1-on-1 mentorship sessions with industry leaders.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/franchise" className={navigationMenuTriggerStyle()}>
                  Franchise
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/updates" className={navigationMenuTriggerStyle()}>
                  Updates
                  <div className="ml-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4 animate-in slide-in-from-top-2">
          <Link to="/courses" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Courses</Link>
          <Link to="/webinars" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Webinars</Link>
          <Link to="/consultancy" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Consultancy</Link>
          <Link to="/franchise" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>Franchise</Link>
          <Link to="/updates" className="block text-lg font-medium text-primary" onClick={() => setIsOpen(false)}>Updates 🔥</Link>
          <Link to="/about" className="block text-lg font-medium" onClick={() => setIsOpen(false)}>About</Link>
          <hr />
          <div className="flex flex-col space-y-2">
            <Button variant="outline" asChild>
              <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
