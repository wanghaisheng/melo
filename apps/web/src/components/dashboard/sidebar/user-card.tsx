import { signOut } from "firebase/auth";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@melo/ui/ui/dropdown-menu";

import type { AuthSession } from "@/web/store/auth";
import { fireauth } from "@/web/firebase/init";

import { useToast } from "@melo/ui/hooks/use-toast";

export default function UserCard({
  auth,
}: {
  auth: AuthSession
}) {

  const { toast } = useToast();

  const handleSignout = async () => {
    await signOut(fireauth);
    toast({
      title: "Signed out",
      description: "You have sucessfully signed out",
    });
  }
  
  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger>
        <div className="flex items-center p-1 border-[1px] border-gray-200 hover:bg-gray-200 rounded-lg gap-2">
          <div className="w-9 h-9 bg-black rounded-lg flex justify-center items-center text-white">
            {/* SOMETHING INSTEAD OF PROFILE PICTURE */}
            {auth.user!.email?.slice(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-xs font-semibold">{ auth.user!.email }</h3>
            <p className="text-[10px] text-gray-800">User</p>
          </div>
          <div className="flex-1"></div>
          <ChevronsUpDown size={16} />
        </div>

        {/* USER MENU */}
        <DropdownMenuContent side="right" className="rounded-lg">
          <DropdownMenuItem onPointerDown={handleSignout} className="text-rose-500 flex items-center text-xs justify-between">
            Sign out
            <LogOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}