import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@melo/ui/ui/input-otp";
import { Separator } from "@melo/ui/ui/separator";
import { Button } from "@melo/ui/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@melo/ui/ui/card";

export default function JoinWithCodeCard() {
  return (
    <Card>
      <CardTitle className="px-5 pt-2">
        <h3 className="text-lg font-bold">Join with code</h3>
      </CardTitle>
      <CardContent>
        <p className="text-xs text-gray-500">You can also join a room directly with an 8-digit code. The code is generated automatically when a room is created.</p>
        <Separator className="my-4" />
        <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS}>
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="bg-blue-500">
          Join with code
        </Button>
      </CardFooter>
    </Card>
  )
}