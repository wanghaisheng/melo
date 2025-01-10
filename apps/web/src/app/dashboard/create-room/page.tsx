"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@melo/ui/ui/card";
import { Button } from "@melo/ui/ui/button";
import { Input } from "@melo/ui/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@melo/ui/ui/form";
import { Switch } from "@melo/ui/ui/switch";
import { createRoomSchema, type CreateRoomSchema } from "@/web/lib/zod-schema";
import { Separator } from "@melo/ui/ui/separator";
import { generateRoomNumber } from "@/web/utils";
import { DoorClosed, DoorOpen, Lock } from "lucide-react";
import MeloRoomHelpers from "@/web/helpers/room";
import { firestore } from "@/web/firebase/init";
import { useAuthStore } from "@/web/store/auth";
import { useToast } from "@melo/ui/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const { auth } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      hasPassword: false,
      password: "",
    },
  });

  const hasPassword = form.watch("hasPassword");
  const generatedRoomNumber = useMemo(() => {
    return generateRoomNumber();
  }, []);

  async function onSubmit(values: CreateRoomSchema) {
    try {
      setIsLoading(true);

      const room = await MeloRoomHelpers.createRoom(
        firestore,
        values.name,
        generatedRoomNumber,
        auth!.data!.id,
        values.hasPassword ? values.password! : null,
      );

      if ( !room ) {
        toast({
          title: "Room Creation Failure",
          description: "The room could not be created due to internal failure",
          action: <DoorClosed />,
          danger: true,
        });
        setIsLoading(false);

        return;
      }
      
      // If the room was created successfully
      toast({
        title: "Success!",
        description: `The room ${values.name} was created successfully. Redirecting you in 3 seconds...`,
        action: <DoorOpen />
      });

      setTimeout(() => {
        router.push(`/room/${room.id}`);
      }, 3000);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-none my-10">
      <CardHeader>
        <CardTitle className="text-3xl text-blue-500">Create a New Room</CardTitle>
        <CardDescription className="">
          Set up a new room for your conversation
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasPassword"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base inline-flex items-center gap-1">Password Protection <Lock className="text-rose-500" size={14} /> </FormLabel>
                    <FormDescription className="text-xs">
                      Enable password protection for private rooms
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {hasPassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter room password"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Must be at least 6 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />
            {/* SHOW GENERATED NUMBER IN A FANCY WAY */}
            <h2 className="text-xl font-semibold">Generated Room Number</h2>
            <div className="flex justify-evenly px-12">
              {
                Array.from(generatedRoomNumber.toString()).map((letter, index) => (
                  <div key={index} className="px-1 w-8 text-center py-1 text-2xl text-white bg-zinc-700 rounded-md">
                    {letter}
                  </div>
                ))
              }
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}