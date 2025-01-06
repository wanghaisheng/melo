import { Button } from "@/web/components/ui/button";
import { cn } from "@/web/lib/utils";

interface ToggleIconButtonProps {
  disabled: boolean;
  on: React.ReactNode;
  off: React.ReactNode;
  onClick: () => void;
}

export default function ToggleIconButton({
  disabled,
  on,
  off,
  onClick,
}: ToggleIconButtonProps) {
  return <Button 
    variant="ghost" 
    onClick={onClick}
    className={cn("rounded-full px-3", !disabled ? "bg-blue-500 text-white": "text-rose-500")} 
    >
    {
      !disabled ? on : off
    }
  </Button>
}