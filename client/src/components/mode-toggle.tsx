import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-fit flex mx-auto p-2">
          <Sun className="h-[1.2rem] w-[1.2rem]  scale-100  dark:hidden" />
          <Moon className="h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light"), window.location.reload();
          }}
        >
          light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark"), window.location.reload();
          }}
        >
          dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system"), window.location.reload();
          }}
        >
          system
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
