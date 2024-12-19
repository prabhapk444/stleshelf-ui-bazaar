import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "UI Components",
    href: "#",
    description: "Beautiful and responsive UI components for modern applications",
    banner: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800",
    subcategories: [
      { title: "Buttons & Inputs", href: "#" },
      { title: "Cards & Containers", href: "#" },
      { title: "Navigation", href: "#" },
      { title: "Forms", href: "#" },
    ],
  },
  {
    title: "Dashboard Templates",
    href: "#",
    description: "Professional dashboard templates for various industries",
    banner: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800",
    subcategories: [
      { title: "Analytics Dashboard", href: "#" },
      { title: "E-commerce Dashboard", href: "#" },
      { title: "CRM Dashboard", href: "#" },
      { title: "Project Management", href: "#" },
    ],
  },
  {
    title: "Page Templates",
    href: "#",
    description: "Ready-to-use page templates for quick development",
    banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    subcategories: [
      { title: "Landing Pages", href: "#" },
      { title: "Authentication", href: "#" },
      { title: "Error Pages", href: "#" },
      { title: "User Profile", href: "#" },
    ],
  },
];

export function CategoryMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.title}>
            <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[800px] gap-3 p-4 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={category.banner}
                    alt={category.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 p-6 flex flex-col justify-end">
                    <div className="text-white">
                      <h3 className="text-lg font-medium">{category.title}</h3>
                      <p className="text-sm text-white/80">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  {category.subcategories.map((subcategory) => (
                    <NavigationMenuLink asChild key={subcategory.title}>
                      <a
                        href={subcategory.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">
                          {subcategory.title}
                        </div>
                      </a>
                    </NavigationMenuLink>
                  ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}