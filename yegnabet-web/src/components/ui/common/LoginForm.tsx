import { AnimInput } from "../basic/AnimInput";
import Link from "../basic/Link";
import Button from "../basic/Button";
import ErrorBlock from "./ErrorBlock";
import Loading from "./Loading";

type SignInBoxProps = {
  phone: string;
  password: string;
  loading: boolean;
  onPhoneChange: any;
  onPasswordChange: any;
  onClose?: () => void;
  onSignup?: any;
  onForgotPassword?: () => void;
  onSubmit?: any;
  error: string;
};

export default function LoginForm({
  phone,
  password,
  loading,
  onPhoneChange,
  onPasswordChange,
  onClose,
  onSignup,
  onForgotPassword,
  onSubmit,
  error
}: SignInBoxProps) {

  return (
    <div
      className="
        relative isolate overflow-hidden
        w-[min(92vw,28rem)]
        min-h-[min(80svh,31rem)]
        rounded-[0.6rem]
       

        before:content-['']
        before:absolute
        before:top-[-50%] before:left-[-50%]
        before:w-[200%] before:h-[200%]
        before:z-0
        before:origin-center
        before:animate-[spin_6s_linear_infinite]
        before:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_265deg,#287747_300deg,#287747_330deg,transparent_360deg)]

        after:content-['']
        after:absolute
        after:top-[-50%] after:left-[-50%]
        after:w-[200%] after:h-[200%]
        after:z-0
        after:origin-center
        after:animate-[spin_6s_linear_infinite]
        after:[animation-delay:-3s]
        after:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_265deg,#287747_300deg,#287747_330deg,transparent_360deg)]

        dark:before:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_255deg,#FF851B_295deg,#FFC078_325deg,transparent_360deg)]
        dark:after:bg-[conic-gradient(from_0deg,transparent_0deg,transparent_255deg,#FF851B_295deg,#FFC078_325deg,transparent_360deg)]
      "
    >
      <form
        onSubmit={onSubmit}
        className="
          absolute inset-1 z-10
          flex flex-col
          rounded-[0.4rem]
          px-[clamp(1.25rem,5vw,2.5rem)]
          py-[clamp(1rem,4vh,1.75rem)]
          bg-[#FAFCFA]
          dark:bg-[#1D2028]
        "
      >
        <div className="flex justify-end pb-[clamp(0.75rem,2vh,1.25rem)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="
              text-[1.125rem] leading-none
              text-[#557260]
              hover:text-yegna-600
              dark:text-[#B8B9C4]
              dark:hover:text-[#FF851B]
              transition-colors
            "
          >
            ×
          </button>
        </div>

        <h2
          className="
            text-center text-[clamp(1.4rem,4vw,1.75rem)]
            font-medium
            text-[#173D2A]
            dark:text-[#FFF0DE]
          "
        >
          Sign in
        </h2>

        <AnimInput 
          type="text"
          label="Phone"
          required
          value={phone}
          onChange={onPhoneChange}
        />

        <AnimInput 
          type="password"
          label="Password"
          required
          value={password}
          onChange={onPasswordChange}
        />

        <div className="mt-1 flex flex-wrap justify-between gap-x-3">
          <Link label="Forgot Password"
            onClick={onForgotPassword} />
          
          <Link label="Signup"
            onClick={onSignup} />
        </div>

        {error && <ErrorBlock message={error} />}

        {!loading ? <Button label="Sign in" type="submit" /> :
          <Loading />}
      </form>
    </div>
  );
}