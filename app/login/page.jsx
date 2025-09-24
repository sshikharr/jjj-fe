"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MyContext } from "@/context/MyContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// For real notifications, you can integrate Firebase Messaging on the client.
// import { getMessaging, getToken } from "firebase/messaging";
// import firebaseApp from "@/firebase/firebaseApp"; // Your Firebase client initialization

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useContext(MyContext);
  const { toast } = useToast();

  // Redirect to dashboard if token or user exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      router.push("/");
    }
  }, [router, setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Option 1: Use a dummy FCM token for testing notifications:
    const fcmToken = "dummy_fcm_token_for_testing";

    // Option 2: Use Firebase Messaging to get the actual token.
    // Uncomment and configure if you have Firebase client set up.
    /*
    const messaging = getMessaging(firebaseApp);
    const fcmToken = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
    */

    try {
      const response = await fetch(
        "https://juristo-back.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, fcmToken }),
        }
      );
      console.log(response);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
        variant: "default",
      });
      router.push("/");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dc9msi1wn/image/upload/v1737221626/LOGO_1_nj85xe.png"
                  className="w-full h-full object-cover"
                  alt="logo"
                />
              </div>

              <span className="text-xl font-semibold">Juristo</span>
            </Link>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-gray-600">
              Enter your credentials to access your account.
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-100  text-gray-700 hover:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#4B6BFB] hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600">
            <Link href="/fpw" className="text-[#4B6BFB] hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
      {/* Right Section: Illustration */}
      <div className="hidden lg:block lg:flex-1 bg-gray-50">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-gray-900/0" />
          <img
            src="https://static.vecteezy.com/system/resources/previews/027/105/968/large_2x/legal-law-and-justice-concept-open-law-book-with-a-wooden-judges-gavel-in-a-courtroom-or-law-enforcement-office-free-photo.jpg"
            alt="Login illustration"
            fill
            className="object-cover h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Juristo has transformed how we handle legal documentation. The
                efficiency gains are remarkable."
              </p>
              <footer className="text-sm">
                <cite>Sarah Chen, Legal Tech Director</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
