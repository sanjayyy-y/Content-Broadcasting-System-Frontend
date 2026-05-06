"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "teacher@demo.com", password: "123456" }
  });

  const onSubmit = async (values) => {
    try {
      const session = await login(values.email, values.password);
      toast({ title: "Welcome back", description: `Signed in as ${session.user.name}` });
      router.push(session.user.role === "principal" ? "/principal/dashboard" : "/dashboard");
    } catch (error) {
      toast({ title: "Login failed", description: error.message, variant: "error" });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your demo teacher or principal account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="teacher@demo.com" {...register("email")} />
            {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="123456" {...register("password")} />
            {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-5 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          Teacher: teacher@demo.com / 123456<br />
          Principal: principal@demo.com / 123456
        </div>
      </CardContent>
    </Card>
  );
}
