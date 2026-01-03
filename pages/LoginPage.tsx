
import React, { useState, useEffect } from 'react';
import { OTPInput } from '../components/OTPInput';
import { LoginStep, User, AuthMethod } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<LoginStep>(LoginStep.ID_INPUT);
  const [method, setMethod] = useState<AuthMethod>('sms');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'sms' && !/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (method === 'email' && !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStep(LoginStep.OTP_VERIFY);
      setTimer(60);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (otp === '123456') {
        onLoginSuccess({
          id: 'mem_' + Math.random().toString(36).substr(2, 9),
          mobile: method === 'sms' ? mobile : undefined,
          email: method === 'email' ? email : undefined,
          isVerified: true,
          createdAt: new Date().toISOString(),
        });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 items-center justify-center p-12 text-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">Membership Excellence.</h1>
          <p className="text-xl text-indigo-100 leading-relaxed">
            Multi-channel passwordless authentication. Verify via SMS or Email for maximum flexibility and security.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {step === LoginStep.ID_INPUT ? 'Welcome Back' : 'Verify Identity'}
            </h2>
            <p className="text-gray-500">
              {step === LoginStep.ID_INPUT 
                ? 'Choose your preferred verification method.' 
                : `We sent a code to ${method === 'sms' ? `+91 ${mobile}` : email}`}
            </p>
          </div>

          {step === LoginStep.ID_INPUT && (
            <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
              <button 
                onClick={() => setMethod('sms')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${method === 'sms' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Mobile
              </button>
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${method === 'email' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Email
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === LoginStep.ID_INPUT ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {method === 'sms' ? 'Mobile Number' : 'Email Address'}
                </label>
                {method === 'sms' ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+91</span>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="99999 00000"
                      className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP...' : 'Send Access Code'}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <OTPInput length={6} onComplete={handleVerifyOTP} disabled={loading} />
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setStep(LoginStep.ID_INPUT)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Change {method === 'sms' ? 'mobile number' : 'email'}
                </button>
                <button
                  onClick={handleSendOTP}
                  disabled={timer > 0 || loading}
                  className="w-full py-3 px-4 border-2 border-gray-200 hover:border-indigo-100 hover:bg-indigo-50 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Access Code'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 italic">Demo code: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};
