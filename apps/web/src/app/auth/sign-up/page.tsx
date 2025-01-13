'use client'

import Image from "next/image"
import { Button } from "@melo/ui/ui/button"
import { Input } from "@melo/ui/ui/input"
import { Label } from "@melo/ui/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@melo/ui/ui/card"
import { Mail, Lock, ArrowUpLeftFromSquare, UserCircle, User, Frown } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signUpSchema, type SignUpSchema } from "@/web/lib/zod-schema"
import { BackgroundShapes } from "@melo/ui/background-shapes"
import { REDIRECT_LOGIN_PAGE_URL } from "@/web/env"
import Link from "next/link"

import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireauth, firestore } from "@/web/firebase/init"
import { useToast } from "@melo/ui/hooks/use-toast"
import AuthHelpers from "@/web/helpers/auth"

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: SignUpSchema) => {
    const user = await createUserWithEmailAndPassword(fireauth, data.email, data.password);
    AuthHelpers.createUserDataInFirestore(firestore, user.user, data.name);
  }
  
  const handleGoogleSignUp = async () => {
    const [user, error] = await AuthHelpers.signUpUserWithGoogle(fireauth, firestore);
    if ( error ) {
      toast({
        title: "Couldn't Sign up",
        description: "Something went wrong during the auth process",
        danger: true,
        action: <Frown />
      });
    }

    if (!user) return;

    toast({
      title: "Signed in",
      description: `Signed in as ${user.email}`,
      action: <UserCircle />,
    });
  }

  return (
    <main className="min-h-screen flex">
      {/* Left side - Logo and text */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 via-blue-100 to-white p-6 relative">
        <BackgroundShapes />
        <div className="w-full flex flex-col items-center justify-center space-y-8">
          <Image
            src="/static/melo.svg"
            alt="Melo Logo"
            width={1200}
            height={1200}
            className=""
            priority
          />
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-gray-900">
              Join Melo&apos;s Virtual Spaces
            </h2>
            <p className="text-lg text-gray-600">
              Sign up to start creating and collaborating in immersive virtual environments designed for modern teams and communities.
            </p>
          </div>
          <Link href={REDIRECT_LOGIN_PAGE_URL}>
            <Button variant="ghost" className="bg-blue-500 text-white">
              Already have an account? Sign in <ArrowUpLeftFromSquare />
            </Button>
          </Link>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white relative">
        <BackgroundShapes />
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-6xl font-bold text-rose-500 mb-3">Join <span className="text-green-500">Melo</span> spaces!</CardTitle>
            <CardDescription>
              <span>Sign up to start your journey with Melo</span>
              <p className="text-xs border-2 p-2 rounded-lg mt-2">
                <span className="text-blue-500 mr-2 text-sm font-bold">NOTE</span>
                The application is <span className="text-black font-bold">NOT</span> meant for commercial use
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    className="px-10"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">&#215; {errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="email" 
                    placeholder="name@example.com"
                    className="px-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">&#215; {errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="password" 
                    type="password"
                    className="px-10"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">&#215; {errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    className="px-10"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">&#215; {errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600">Sign Up</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleSignUp}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Sign up with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

