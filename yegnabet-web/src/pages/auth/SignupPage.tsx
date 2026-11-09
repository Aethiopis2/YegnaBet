import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../types/auth/authContext";

interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  avatar?: File | null;

  // Optional location fields
  country?: string;
  city?: string;
  area?: string;
  subArea?: string;

  // Optional map coordinates
  latitude?: number;
  longitude?: number;
}

type SignUpAuthContext = ReturnType<
  typeof useAuth
> & {
  register: (
    request: RegisterRequest
  ) => Promise<{ role: string }>;
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { register, isLoading } =
    useAuth() as SignUpAuthContext;

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [avatar, setAvatar] =
    useState<File | null>(null);

  const [showLocation, setShowLocation] =
    useState(false);

  const [country, setCountry] = useState("Ethiopia");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [subArea, setSubArea] = useState("");

  const [latitude, setLatitude] =
    useState<number | undefined>();

  const [longitude, setLongitude] =
    useState<number | undefined>();

  const [error, setError] = useState("");

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setAvatar(null);
      return;
    }

    // Optional client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setAvatar(file);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      const request: RegisterRequest = {
        fullName,
        phoneNumber,
        email,
        password,
        avatar,

        ...(showLocation && {
          country,
          city,
          area,
          subArea,
          latitude,
          longitude,
        }),
      };

      const user = await register(request);

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
          : "Registration failed."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div
          className="
            rounded-3xl p-8
            bg-white dark:bg-zinc-900
            shadow-xl
          "
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Join YegnaBet
            </h1>

            <p className="mt-2 text-sm opacity-60">
              Create your account to get started
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="avatar"
                className="
                  relative flex items-center justify-center
                  w-24 h-24
                  rounded-full
                  overflow-hidden
                  cursor-pointer
                  bg-zinc-100 dark:bg-zinc-800
                  border border-zinc-200
                  dark:border-zinc-700
                "
              >
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm opacity-50">
                    Add photo
                  </span>
                )}

                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-xs opacity-50">
                Optional
              </p>
            </div>

            {/* Full name */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Full name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                className="
                  w-full rounded-xl
                  border border-zinc-200
                  dark:border-zinc-700
                  bg-transparent px-4 py-3
                  outline-none
                  focus:ring-2
                  focus:ring-yegna-500
                  dark:focus:ring-orange-500
                "
                placeholder="Your full name"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Phone number
              </label>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(event.target.value)
                }
                className="
                  w-full rounded-xl
                  border border-zinc-200
                  dark:border-zinc-700
                  bg-transparent px-4 py-3
                  outline-none
                  focus:ring-2
                  focus:ring-yegna-500
                  dark:focus:ring-orange-500
                "
                placeholder="09..."
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="
                  w-full rounded-xl
                  border border-zinc-200
                  dark:border-zinc-700
                  bg-transparent px-4 py-3
                  outline-none
                  focus:ring-2
                  focus:ring-yegna-500
                  dark:focus:ring-orange-500
                "
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="
                  w-full rounded-xl
                  border border-zinc-200
                  dark:border-zinc-700
                  bg-transparent px-4 py-3
                  outline-none
                  focus:ring-2
                  focus:ring-yegna-500
                  dark:focus:ring-orange-500
                "
                placeholder="Password"
                required
              />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Confirm password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                className="
                  w-full rounded-xl
                  border border-zinc-200
                  dark:border-zinc-700
                  bg-transparent px-4 py-3
                  outline-none
                  focus:ring-2
                  focus:ring-yegna-500
                  dark:focus:ring-orange-500
                "
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Optional location */}
            <div
              className="
                rounded-2xl
                border border-zinc-200
                dark:border-zinc-700
                p-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowLocation(
                    !showLocation
                  )
                }
                className="
                  w-full flex items-center
                  justify-between
                  text-left
                "
              >
                <div>
                  <p className="font-medium">
                    Add your location
                  </p>

                  <p className="text-xs opacity-50 mt-1">
                    Optional — helps us find better matches
                  </p>
                </div>

                <span className="text-lg opacity-60">
                  {showLocation ? "−" : "+"}
                </span>
              </button>

              {showLocation && (
                <div className="mt-5 space-y-4">

                  {/* Country */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Country
                    </label>

                    <input
                      type="text"
                      value={country}
                      onChange={(event) =>
                        setCountry(
                          event.target.value
                        )
                      }
                      className="
                        w-full rounded-xl
                        border border-zinc-200
                        dark:border-zinc-700
                        bg-transparent px-4 py-3
                        outline-none
                      "
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(event) =>
                        setCity(
                          event.target.value
                        )
                      }
                      className="
                        w-full rounded-xl
                        border border-zinc-200
                        dark:border-zinc-700
                        bg-transparent px-4 py-3
                        outline-none
                      "
                      placeholder="Addis Ababa"
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Area
                    </label>

                    <input
                      type="text"
                      value={area}
                      onChange={(event) =>
                        setArea(
                          event.target.value
                        )
                      }
                      className="
                        w-full rounded-xl
                        border border-zinc-200
                        dark:border-zinc-700
                        bg-transparent px-4 py-3
                        outline-none
                      "
                      placeholder="Bole"
                    />
                  </div>

                  {/* Sub-area */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Sub-area
                      <span className="ml-1 opacity-40">
                        (optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      value={subArea}
                      onChange={(event) =>
                        setSubArea(
                          event.target.value
                        )
                      }
                      className="
                        w-full rounded-xl
                        border border-zinc-200
                        dark:border-zinc-700
                        bg-transparent px-4 py-3
                        outline-none
                      "
                      placeholder="Optional"
                    />
                  </div>

                  {/* Map coordinates */}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          setError(
                            "Location is not supported by your browser."
                          );
                          return;
                        }

                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setLatitude(
                              position.coords.latitude
                            );

                            setLongitude(
                              position.coords.longitude
                            );

                            setError("");
                          },
                          () => {
                            setError(
                              "Unable to access your location."
                            );
                          }
                        );
                      }}
                      className="
                        w-full rounded-xl
                        border
                        border-zinc-200
                        dark:border-zinc-700
                        px-4 py-3
                        text-sm
                        font-medium
                        hover:bg-zinc-100
                        dark:hover:bg-zinc-800
                        transition
                      "
                    >
                      {latitude !== undefined
                        ? "Location selected"
                        : "Use my approximate location"}
                    </button>

                    {latitude !== undefined &&
                      longitude !== undefined && (
                        <p className="mt-2 text-xs opacity-50">
                          Map location selected.
                        </p>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  rounded-xl px-4 py-3
                  text-sm
                  bg-red-500/10
                  text-red-500
                "
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full rounded-xl
                bg-yegna-500
                dark:bg-orange-500
                px-4 py-3
                font-semibold
                text-white
                transition
                hover:bg-yegna-600
                dark:hover:bg-orange-600
                active:scale-[0.98]
                disabled:opacity-50
              "
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 text-center">
            <p className="text-sm opacity-60">
              Already have an account?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/login${location.search}`
                )
              }
              className="
                mt-1
                text-sm font-semibold
                text-yegna-600
                dark:text-orange-400
                hover:underline
              "
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}