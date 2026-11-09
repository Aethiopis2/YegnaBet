import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { login } from "../../../lib/auth/authService";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "../../../types/auth/authTypes";


type LogInModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

export default function LogInModal({
  open,
  setOpen,
  setUser,
  setToken,
}: LogInModalProps) {
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const resp = await login({phoneNumber, password });
      setUser(resp.user);
      setToken(resp.accessToken);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error
          ? err.message
          : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };


  const onClose = () => {
    setPassword("");
    setPhoneNumber("");
    setError("");
    setOpen(false);
  }
  
  const onSignup = () => {navigate('/Signup')};
  const onForgotPassword = () => {};

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setPassword(e.target.value);
  };


  useEffect(() => {
    if (open) {
      setMounted(true);

      // Let the browser render the initial state first.
      const frame = requestAnimationFrame(() => {
        setVisible(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);

    const timeout = window.setTimeout(() => {
      setMounted(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);


  if (!mounted) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`
        fixed inset-0 z-1000
        flex items-center justify-center
        overflow-y-auto
        p-[clamp(0.75rem,3vw,2rem)]
        bg-black/10 backdrop-blur-[0.2rem]
        transition-opacity duration-300 ease-out
        motion-reduce:transition-none
        ${visible ? "opacity-`100" : "opacity-0"}
        ${visible ? "pointer-events-auto" : "pointer-events-none"}
      `}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-dialog-title"
        className={`
          flex w-full justify-center
          max-h-[calc(100svh-2rem)]
          overflow-y-auto
          transition-[opacity,transform] duration-300 ease-out
          motion-reduce:transition-none
          ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-[0.96]"
          }
        `}
      >
        <LoginForm
          phone={phoneNumber}
          password={password}
          loading={loading}
          onPhoneChange={onPhoneChange}
          onPasswordChange={onPasswordChange}
          onClose={onClose}
          onSignup={onSignup}
          onForgotPassword={onForgotPassword}
          error={error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}