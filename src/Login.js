import { signIn } from "@junobuild/core";

export const Login = () => {
  //TODO: STEP_2_AUTH_SIGN_IN
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <button
        type="button"
        onClick={signIn}
        className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <div className="flex items-center justify-center gap-1.5">
          
          Write
        </div>
      </button>
    </div>
  );
};
