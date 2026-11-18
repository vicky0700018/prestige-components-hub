import { adminHead } from "@/lib/page-meta";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, KEYS, write, setLoggedIn, logActivity } from "@/lib/store";
import { Field, isEmail, toast } from "@/components/ui";
import { PageHeader, Panel } from "@/components/admin/kit";

export const Route = createFileRoute("/admin/settings")({ head: () => adminHead("Admin Settings"), component: Settings });

function Settings() {
  const admin = useStore<any>(KEYS.admin);
  const nav = useNavigate();
  const [name, setName] = useState(admin.name); const [email, setEmail] = useState(admin.email);
  const [cur, setCur] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const saveProfile = () => {
    if (!name.trim()) return toast("Name is required.", "error");
    if (!isEmail(email)) return toast("Enter a valid email.", "error");
    write(KEYS.admin, { ...admin, name: name.trim(), email: email.trim() }); logActivity("Admin profile updated"); toast("Profile saved");
  };
  const savePw = () => {
    if (cur !== admin.password) return toast("Current password is incorrect.", "error");
    if (pw.length < 6) return toast("New password must be at least 6 characters.", "error");
    if (pw !== pw2) return toast("Passwords do not match.", "error");
    write(KEYS.admin, { ...admin, password: pw }); setCur(""); setPw(""); setPw2(""); logActivity("Admin password changed"); toast("Password changed");
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" text="Demo admin profile, saved in this browser." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4 p-6"><h2 className="font-semibold text-primary">Profile</h2>
          <Field label="Admin Name"><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Login Email"><input className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <button className="btn btn-accent" onClick={saveProfile}>Save Profile</button></Panel>
        <Panel className="space-y-4 p-6"><h2 className="font-semibold text-primary">Change Password</h2>
          <Field label="Current Password"><input type="password" className="field" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
          <Field label="New Password"><input type="password" className="field" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
          <Field label="Confirm New Password"><input type="password" className="field" value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
          <button className="btn btn-accent" onClick={savePw}>Change Password</button></Panel>
      </div>
      <button className="btn btn-outline text-destructive" onClick={() => { setLoggedIn(false); nav({ to: "/admin/login" }); }}>Logout</button>
    </div>
  );
}
