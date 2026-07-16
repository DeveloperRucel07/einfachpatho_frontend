import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import "../styles/auth.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth-screen">
      <div className="auth-card card">
        <div className="auth-brand">
          <BrandMark size={40} />
          <span>EinfachPatho</span>
        </div>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}
