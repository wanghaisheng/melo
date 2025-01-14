import Image from "next/image";

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
        <div className="flex items-center p-1 border-[1px] bg-white border-gray-200 hover:bg-gray-200 rounded-lg gap-2">
          <div className={`
            relative
            min-w-9 h-9
            bg-black rounded-lg
            flex justify-center items-center
            text-white

            overflow-hidden
            `}>
            {/* SOMETHING INSTEAD OF PROFILE PICTURE */}
            {
              auth.user!.photoURL ? (
                <Image 
                  src={auth.user!.photoURL}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              ) : (
                (auth.user!.displayName || auth.user!.email)?.slice(0,2).toUpperCase()
              )
            }
            
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-[11px] font-semibold truncate overflow-ellipsis max-w-36">{ auth.data?.username || auth.user!.displayName || auth.user!.email }</h3>
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