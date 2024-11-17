"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signupUser, resetError } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";

// Update schema to include role
const signupSchema = z.object({
  username: z.string().min(3, { message: "Username should be valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
});

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "user", // Default role is user
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    dispatch(resetError());
    const response: any = await dispatch(signupUser(data));
    if (response.payload.success) {
      router.replace("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-700 to-teal-600 p-4">
      <div className="w-full max-w-md bg-[#2D3748] rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Sign Up
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="bg-[#3B4759] border border-gray-600 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-[#3B4759] border border-gray-600 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Role Dropdown */}
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border rounded-lg bg-[#3B4759] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500 mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 py-3 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-teal-600"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Error Message */}
        <div className="w-full mt-2">
          {error && (
            <div className="p-4 bg-red-600 text-white rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-400 font-semibold"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
