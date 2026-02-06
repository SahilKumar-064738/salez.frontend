import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    setDark(getIsDark());
  }, []);

  const toggle = () => {
    const next = !getIsDark();
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={toggle}
      className="rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      data-testid="theme-toggle"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
