import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Phone,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getRoleHome,
} from "../../auth/RequireAuth";

import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({
        phoneNumber: phoneNumber.trim(),
        password,
      });

      const params =
        new URLSearchParams(
          location.search
        );

      const requestedUrl =
        params.get("returnUrl");

      /*
       * For protected routes we only honor
       * the requested URL if the user's role
       * is allowed to use it.
       */

      if (
        requestedUrl &&
        canAccessRequestedRoute(
          requestedUrl,
          user.role
        )
      ) {
        navigate(
          requestedUrl,
          { replace: true }
        );

        return;
      }

      navigate(
        getRoleHome(user.role),
        { replace: true }
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">

        {/* Back */}

        <Link
          to="/"
          className="
            mb-8
            inline-flex
            w-fit
            items-center
            gap-2
            text-sm
            text-slate-500
            transition-colors
            hover:text-slate-900

            dark:text-slate-400
            dark:hover:text-white
          "
        >
          <ArrowLeft size={16} />
          Back to Yegna Bet
        </Link>

        {/* Card */}

        <div
          className="
            rounded-3xl
            border border-slate-200
            bg-white
            p-7
            shadow-xl shadow-slate-200/30

            dark:border-white/10
            dark:bg-white/[0.045]
            dark:shadow-black/20
          "
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold">
              Welcome back
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500

                dark:text-slate-400
              "
            >
              Sign in to continue to Yegna Bet.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Phone */}

            <div>
              <label
                htmlFor="phoneNumber"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  text-slate-700

                  dark:text-slate-300
                "
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value
                    )
                  }
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/10

                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-white
                    dark:focus:border-orange-400
                    dark:focus:ring-orange-400/10
                  "
                  placeholder="09xxxxxxxx"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  text-slate-700

                  dark:text-slate-300
                "
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-10
                    pr-12
                    text-sm
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/10

                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-white
                    dark:focus:border-orange-400
                    dark:focus:ring-orange-400/10
                  "
                  placeholder="Your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-slate-700

                    dark:hover:text-white
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700

                  dark:border-red-400/20
                  dark:bg-red-400/10
                  dark:text-red-300
                "
              >
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                bg-slate-900
                text-sm
                font-semibold
                text-white
                transition-all
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:bg-orange-400
                dark:text-slate-950
                dark:hover:bg-orange-300
              "
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>
        </div>

        <p
          className="
            mt-6
            text-center
            text-xs
            text-slate-400
          "
        >
          Find your place. Find your match.
        </p>
      </div>
    </div>
  );
}

function canAccessRequestedRoute(
  path: string,
  role: string
) {
  if (path.startsWith("/provider")) {
    return role === "Provider";
  }

  if (path.startsWith("/employee")) {
    return role === "Employee";
  }

  if (path.startsWith("/owner")) {
    return role === "Owner";
  }

  return true;
}