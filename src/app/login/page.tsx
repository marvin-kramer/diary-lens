import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Label} from "@/components/ui/label";

export default function Login({
                                searchParams,
                              }: {
  searchParams: { message: string, callback: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect(searchParams.callback ?? '/gallery');
  };

  return (
    <div
      className="flex w-full h-screen justify-center items-center"
    >
      <form action={signIn}>
        <Card className={"flex flex-col gap-3 p-3 w-96"}>
          <div>
            <Label htmlFor="email">
              Email
            </Label>
            <div className={"h-1"}/>
            <Input
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">
              Password
            </Label>
            <div className={"h-1"}/>
            <Input
                type="password"
                name="password"
                placeholder="••••••••"
                required
            />
          </div>
          <Button>
            Sign In
          </Button>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </Card>
      </form>
    </div>
  );
}
