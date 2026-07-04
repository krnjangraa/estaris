import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { saveAuth } from "../auth";
import { useSignup } from "../hooks";
import { signupSchema, type SignupSchema } from "../schema";

export default function SignupForm() {
  const navigate = useNavigate();

  const signup = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SignupSchema) {
    signup.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess(data) {
          saveAuth(
            data.access_token,
            data.refresh_token,
            data.admin
          );

          toast.success(`Welcome ${data.admin.name}!`);

          navigate("/", {
            replace: true,
          });
        },

        onError(error: any) {
          const msg =
            error?.response?.data?.detail ||
            "Something went wrong";
          toast.error(msg);
        },
      }
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl text-center">
          Estaris
        </CardTitle>

        <CardDescription className="text-center">
          Create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="signup-name">
              Full Name
            </Label>

            <Input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">
              Email
            </Label>

            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">
              Password
            </Label>

            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-confirm">
              Confirm Password
            </Label>

            <Input
              id="signup-confirm"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            disabled={signup.isPending}
            type="submit"
          >
            {signup.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
