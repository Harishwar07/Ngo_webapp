
import React, { useEffect,useState } from 'react';
import { NGO_ICON } from '../constants';
import { loadCsrfToken } from "../services/mockApi";

interface LoginViewProps {
  on_login: () => void;
  on_cancel?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ on_login, on_cancel }) => {
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [error, set_error] = useState('');
  const [is_loading, set_is_loading] = useState(false);
  const [show_forgot_password, set_show_forgot_password] = useState(false);

  useEffect(() => {
    loadCsrfToken();
  }, []);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_error("");
    set_is_loading(true);

    try {
      const res = await fetch("https://localhost:3001/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": (window as any).CSRF_TOKEN || ""
        },
        body: JSON.stringify({ email, password })
      });


      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      
      on_login();
    } catch (err: any) {
      set_error(err.message || "Login failed");
    } finally {
      set_is_loading(false);
    }
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg relative">
        {on_cancel && (
            <button 
                onClick={on_cancel}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>
        )}
        <div className="flex flex-col items-center pt-2">
            <div className="w-16 h-16 text-indigo-600 mb-2">{NGO_ICON}</div>
            <h2 className="text-3xl font-extrabold text-gray-900">Sign in to Data Hub</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your credentials to access the portal</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handle_submit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => set_email(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => set_password(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
                type="button"
                onClick={() => set_show_forgot_password(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none hover:underline"
            >
                Forgot your password?
            </button>
          </div>

          {error && (
             <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {show_forgot_password && (
              <div className="text-blue-600 text-sm text-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                  Please contact the administrator to reset your password.
              </div>
          )}

          <div>
            <button
              type="submit"
              disabled={is_loading}
              className={`group relative flex w-full justify-center rounded-lg bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${is_loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {is_loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
         <div className="text-center text-xs text-gray-500">
            Protected Area &copy; NGO Data Hub
        </div>
      </div>
    </div>
  );
};
