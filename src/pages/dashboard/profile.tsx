import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usd, fmtDate } from "@/lib/format";

,
  component: ProfilePage,
});

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? "");
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initial = (profile?.username ?? user?.email ?? "?").charAt(0).toUpperCase();

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    refreshProfile();
  };

  const changePwd = async () => {
    if (pwd.length < 6) return toast.error("Password too short");
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setPwdSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPwd("");
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      // try to create bucket flow gracefully
      setUploading(false);
      return toast.error("Avatar upload not available yet — ask support to enable storage.");
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    setUploading(false);
    toast.success("Avatar updated");
    refreshProfile();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Profile</h1></div>

      <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-5">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-border" />
        ) : (
          <div className="h-20 w-20 rounded-full grid place-items-center bg-[image:var(--gradient-primary)] text-2xl font-bold text-primary-foreground">{initial}</div>
        )}
        <div className="flex-1">
          <div className="font-semibold">{profile?.username}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
          <label className="inline-block mt-2">
            <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
            <span className="inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium hover:bg-secondary cursor-pointer">{uploading ? "Uploading…" : "Change avatar"}</span>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Account info</h2>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled />
        </div>
        <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Change password</h2>
        <Input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        <Button onClick={changePwd} disabled={pwdSaving || !pwd}>{pwdSaving && <Loader2 className="h-4 w-4 animate-spin" />} Update password</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Account created</div><div className="font-semibold mt-1">{user?.created_at ? fmtDate(user.created_at) : "—"}</div></div>
        <div className="rounded-xl border border-border bg-card p-5"><div className="text-xs text-muted-foreground">Wallet balance</div><div className="font-semibold mt-1">{usd(profile?.wallet_balance)}</div></div>
      </div>
    </div>
  );
}
