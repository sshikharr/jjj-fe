"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { Loader2, Github, ChevronDown, Search, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Flag from "react-world-flags";

const countries = [
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "JP", name: "Japan", dialCode: "+81" },
  { code: "KR", name: "South Korea", dialCode: "+82" },
  { code: "CN", name: "China", dialCode: "+86" },
  { code: "BR", name: "Brazil", dialCode: "+55" },
  { code: "MX", name: "Mexico", dialCode: "+52" },
  { code: "RU", name: "Russia", dialCode: "+7" },
  { code: "IT", name: "Italy", dialCode: "+39" },
  { code: "ES", name: "Spain", dialCode: "+34" },
  { code: "NL", name: "Netherlands", dialCode: "+31" },
  { code: "SE", name: "Sweden", dialCode: "+46" },
  { code: "CH", name: "Switzerland", dialCode: "+41" },
  { code: "SG", name: "Singapore", dialCode: "+65" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "ZA", name: "South Africa", dialCode: "+27" },
  { code: "NG", name: "Nigeria", dialCode: "+234" },
  { code: "EG", name: "Egypt", dialCode: "+20" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { code: "IL", name: "Israel", dialCode: "+972" },
  { code: "TR", name: "Turkey", dialCode: "+90" },
  { code: "TH", name: "Thailand", dialCode: "+66" },
  { code: "MY", name: "Malaysia", dialCode: "+60" },
  { code: "ID", name: "Indonesia", dialCode: "+62" },
  { code: "PH", name: "Philippines", dialCode: "+63" },
  { code: "VN", name: "Vietnam", dialCode: "+84" },
  { code: "BD", name: "Bangladesh", dialCode: "+880" },
  { code: "PK", name: "Pakistan", dialCode: "+92" },
  { code: "LK", name: "Sri Lanka", dialCode: "+94" },
  { code: "NP", name: "Nepal", dialCode: "+977" },
  { code: "MM", name: "Myanmar", dialCode: "+95" },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(countries[1]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const router = useRouter();
  const { toast } = useToast();

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  );

  const validatePassword = (password) => {
    return {
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, mobileNumber: value }));
  };

  const isPasswordStrong = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isPasswordStrong()) {
      setError("Please meet all password requirements");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const fcmToken = "dummy_fcm_token_for_testing_signup";
    const fullMobileNumber = selectedCountry.dialCode + formData.mobileNumber;

    try {
      const response = await fetch(
        "https://juristo-back.vercel.app/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            mobileNumber: fullMobileNumber,
            countryCode: selectedCountry.code,
            fcmToken
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }
      await response.json();
      toast({
        title: "Success",
        description: "Your account has been created. Please log in.",
        variant: "default",
      });
      router.push("/login");
    } catch (err) {
      console.error("Signup Error:", err);
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
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl flex flex-col">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                  <img src="https://res.cloudinary.com/dc9msi1wn/image/upload/v1737221626/LOGO_1_nj85xe.png" alt="Logo" />
                </div>
                <span className="text-xl font-semibold">Juristo</span>
              </Link>
            </div>
            <CardTitle className="text-xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Start your 30-day free trial. No credit card required.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-sm">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-sm">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm">Work email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="mobileNumber" className="text-sm">Mobile number</Label>
                  <div className="flex relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={isLoading}
                      className="h-9 px-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md flex items-center gap-1 min-w-[90px]"
                    >
                      <Flag
                        code={selectedCountry.code}
                        className="w-4 h-3 rounded-sm border border-gray-200 dark:border-gray-600"
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {selectedCountry.dialCode}
                      </span>
                      <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-black/20"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl">
                          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700"
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setIsDropdownOpen(false);
                                    setSearchTerm("");
                                  }}
                                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-xs ${
                                    selectedCountry.code === country.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                  }`}
                                >
                                  <Flag
                                    code={country.code}
                                    className="w-4 h-3 rounded-sm border border-gray-200 dark:border-gray-600"
                                  />
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                      {country.dialCode}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400 truncate">
                                      {country.name}
                                    </span>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                No countries found
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      placeholder="1234567890"
                      value={formData.mobileNumber}
                      onChange={handleMobileChange}
                      required
                      disabled={isLoading}
                      className="h-9 rounded-l-none border-l-0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-9 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="text-xs space-y-0.5">
                      <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        At least 6 characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        One number
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                        One special character
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="h-9 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-3 w-3 text-gray-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className={`text-xs flex items-center gap-1 ${
                      formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-600 leading-none"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#4B6BFB] hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#4B6BFB] hover:underline"
                    >
                      privacy policy
                    </Link>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="h-9 bg-gray-100 text-gray-700 hover:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#4B6BFB] hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right Section: Illustration */}
      <div className="hidden lg:block lg:flex-1 bg-gray-50">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-gray-900/0" />
          <img
            src="https://static.vecteezy.com/system/resources/previews/027/105/968/large_2x/legal-law-and-justice-concept-open-law-book-with-a-wooden-judges-gavel-in-a-courtroom-or-law-enforcement-office-free-photo.jpg"
            alt="Sign up illustration"
            fill
            className="object-cover h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <blockquote className="space-y-1">
              <p className="text-base">
                "The onboarding process was seamless, and the platform's
                capabilities exceeded our expectations."
              </p>
              <footer className="text-xs">
                <cite>Michael Torres, Legal Operations Manager</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flag-fallback {
          width: 16px;
          height: 12px;
          background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
          border-radius: 2px;
          display: inline-block;
          position: relative;
        }
        
        .flag-fallback::after {
          content: '🏴';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8px;
        }
        
        .react-world-flags {
          display: inline-block;
          vertical-align: middle;
        }
        
        @media (max-width: 640px) {
          .react-world-flags {
            width: 12px !important;
            height: 9px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;