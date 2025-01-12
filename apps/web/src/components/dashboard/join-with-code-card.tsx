import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@melo/ui/ui/input-otp";
import { Separator } from "@melo/ui/ui/separator";
import { Button } from "@melo/ui/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@melo/ui/ui/card";
import { Alert, AlertDescription } from "@melo/ui/ui/alert";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import MeloRoomHelpers from "@/web/helpers/room";
import { firestore } from "@/web/firebase/init";
import { useRouter } from "next/navigation";

export default function JoinWithCodeCard() {
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Zod schema for validation
  const codeSchema = z.object({
    code: z.string().length(8).regex(/^\d+$/, 'Code must contain only numbers')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setIsLoading(true);
      
      codeSchema.parse({ code: value });
      
      const room = await MeloRoomHelpers.tryGetRoomFromNumber(firestore, value);
      if ( !room ) return void setError("Could not find any room with that code")

      router.push(`/room/${room.id}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('Please enter a valid 8-digit code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle className="px-5 pt-2">
        <h3 className="text-lg font-bold">Join with code</h3>
      </CardTitle>
      <CardContent>
        <p className="text-xs text-gray-500">
          You can also join a room directly with an 8-digit code. The code is generated automatically when a room is created.
        </p>
        <Separator className="my-4" />
        <form onSubmit={handleSubmit}>
          <InputOTP 
            maxLength={8} 
            value={value} 
            onChange={(newValue) => {
              setValue(newValue);
              setError('');
            }}
            disabled={isLoading}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="font-bold text-blue-500 text-lg" />
              <InputOTPSlot index={1} className="font-bold text-blue-500 text-lg" />
              <InputOTPSlot index={2} className="font-bold text-blue-500 text-lg" />
              <InputOTPSlot index={3} className="font-bold text-blue-500 text-lg" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} className="font-bold text-blue-500 text-lg" />
              <InputOTPSlot index={5} className="font-bold text-blue-500 text-lg" />
              <InputOTPSlot index={6} className="font-bold text-blue-500 text-lg" />
              <InputOTPSlot index={7} className="font-bold text-blue-500 text-lg" />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          className="bg-blue-500"
          disabled={value.length !== 8 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join with code'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}