import { startLogin } from "@/const";
import { ArrowRight, Chrome, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  return (
    <main className="auth-page">
      <div className="auth-aside">
        <div className="auth-brand"><div className="brand-mark"><span /><span /><span /></div><span>skill<span>bridge</span></span></div>
        <div className="auth-aside-copy"><p className="eyebrow">VERIFIED POTENTIAL</p><h1>Make your next signal visible.</h1><p>Save your skill graph, courses, and challenge progress in one trusted workspace.</p><div className="auth-proof"><ShieldCheck size={17} /><span>Secure sign-in · Your data stays yours</span></div></div>
        <div className="auth-aside-footer">SkillBridge / Learn. Practice. Verify. Apply.</div>
      </div>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-card-heading"><div className="auth-lock"><LockKeyhole size={18} /></div><p className="eyebrow">WELCOME BACK</p><h2>Sign in to SkillBridge</h2><p>Continue where your verified potential left off.</p></div>
          <button className="auth-provider google" onClick={() => startLogin("google")}><Chrome size={18} />Continue with Google<ArrowRight size={16} /></button>
          <div className="auth-divider"><span>or</span></div>
          <button className="auth-provider email" onClick={() => startLogin("email")}><Mail size={18} />Continue with email<ArrowRight size={16} /></button>
          <p className="auth-note">Email sign-in is handled securely by the SkillBridge account portal. We never store your password in this app.</p>
          <Link href="/" className="auth-back">← Back to preview</Link>
        </div>
      </section>
    </main>
  );
}
