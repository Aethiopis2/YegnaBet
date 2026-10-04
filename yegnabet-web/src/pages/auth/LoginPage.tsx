import {
  FormEvent,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../types/auth/authContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] =useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    try {
      const user = await login({
        phoneNumber,
        password,
      });

      const params =
        new URLSearchParams(
          location.search
        );

      const returnUrl =
        params.get("returnUrl");

      if (returnUrl) {
        navigate(returnUrl, {
          replace: true,
        });

        return;
      }

      switch (user.role) {
        case "Provider":
          navigate("/provider", {
            replace: true,
          });
          break;

        case "Employee":
          navigate("/employee", {
            replace: true,
          });
          break;

        case "Owner":
          navigate("/owner", {
            replace: true,
          });
          break;

        case "Customer":
        default:
          navigate("/", {
            replace: true,
          });
          break;
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl p-8
                        bg-white dark:bg-zinc-900
                        shadow-xl">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Welcome to YegnaBet
            </h1>

            <p className="mt-2 text-sm opacity-60">
              Sign in to continue
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm font-medium">
                Phone number
              </label>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value
                  )
                }
                className="w-full rounded-xl
                           border border-zinc-200
                           dark:border-zinc-700
                           bg-transparent px-4 py-3
                           outline-none"
                placeholder="09..."
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                className="w-full rounded-xl
                           border border-zinc-200
                           dark:border-zinc-700
                           bg-transparent px-4 py-3
                           outline-none"
                placeholder="Password"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3
                              text-sm
                              bg-red-500/10
                              text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl
                         bg-yegna-500
                         dark:bg-orange-500
                         px-4 py-3
                         font-semibold
                         text-white
                         transition
                         hover:bg-yegna-600
                         dark:hover:bg-orange-600
                         active:scale-[0.98]
                         disabled:opacity-50"
            >
              {isLoading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}