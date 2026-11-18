import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { read, KEYS, isLoggedIn, setLoggedIn, logActivity } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Brand } from "@/components/site/Navbar";
import { Field, SmartImg, toast } from "@/components/ui";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — New Prestige Corporation LLP" },
      { name: "description", content: "Sign in to manage products, gallery, content and enquiries." },
      { property: "og:title", content: "Admin Login — New Prestige Corporation LLP" },
      { property: "og:description", content: "Admin area for New Prestige Corporation LLP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (isLoggedIn()) nav({ to: "/admin" }); }, [nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Please enter both email and password."); return; }
    const a = read<any>(KEYS.admin);
    if (email.trim().toLowerCase() !== a.email.toLowerCase() || password !== a.password) { setError("Incorrect email or password."); return; }
    setLoggedIn(true);
    logActivity("Admin signed in");
    toast(`Welcome back, ${a.name}`);
    nav({ to: "/admin" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-deep lg:block">
        <SmartImg src="asset:hero" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Brand />
          <div>
            <p className="eyebrow">Admin Panel</p>
            <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight text-navy-foreground">Manage your website content in one place.</h1>
            <p className="mt-4 max-w-md text-navy-foreground/70">Products, categories, gallery, page text and customer enquiries.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-surface p-6">
        <form onSubmit={submit} noValidate className="animate-pop-in w-full max-w-md rounded-2xl border bg-card p-8 shadow-lift">
          <div className="lg:hidden"><Brand light={false} /></div>
          <h2 className="mt-6 text-2xl font-bold text-primary lg:mt-0">Admin Login</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to the dashboard.</p>
          <div className="mt-6 space-y-4">
            <Field label="Email"><input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></Field>
            <Field label="Password">
              <div className="relative">
                <input aria-label="Password" type={show ? "text" : "password"} className="field pr-16" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-xs font-semibold text-secondary">{show ? "Hide" : "Show"}</button>
              </div>
            </Field>
          </div>
          {error && <p className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert"><Icon name="alert" className="h-4 w-4" />{error}</p>}
          <button className="btn btn-accent mt-6 w-full">Sign In <Icon name="arrow" className="h-4 w-4" /></button>
          <div className="mt-6 rounded-xl border border-dashed bg-muted p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Demo login</p>
            <p className="mt-1">Email: admin@newprestigecorp.com<br />Password: Admin@123</p>
            <p className="mt-2">This is a demo sign-in stored in your browser only — not real security.</p>
          </div>
          <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-secondary hover:text-accent"><Icon name="left" className="h-4 w-4" />Back to website</Link>
        </form>
      </div>
    </div>
  );
}
