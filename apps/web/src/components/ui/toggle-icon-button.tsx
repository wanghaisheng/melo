import { Button } from "@/web/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/web/components/ui/tooltip";
import { cn } from "@/web/lib/utils";

interface ToggleIconButtonProps {
  disabled: boolean;
  on: React.ReactNode;
  off: React.ReactNode;
  onClick: () => void;
  tip: string;
  className?: string;
}

export default function ToggleIconButton({
  disabled,
  on,
  off,
  onClick,
  tip,
  className,
}: ToggleIconButtonProps) {
  return <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          onClick={onClick}
          className={cn("rounded-full px-3", !disabled ? "bg-blue-500 text-white": "text-rose-500", className)} 
          >
          {
            !disabled ? on : off
          }
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        { tip }
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
}