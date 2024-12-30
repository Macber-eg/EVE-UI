import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Brain, Sparkles, Shield, Rocket } from 'lucide-react';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const features = [
    {
      icon: Brain,
      title: 'EVE™ Automation',
      description: 'Fully autonomous business operations powered by AI'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC 2 Type II compliance'
    },
    {
      icon: Sparkles,
      title: 'Instant Setup',
      description: 'Get started in minutes with Stripe Atlas integration'
    }
  ];

  return (
    <div className="min-h-screen bg-[#040707] flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-[#72f68e]" />
            <span className="text-2xl font-bold text-white">maverika</span>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {isSignUp 
                  ? 'Start building your EVE™-powered company'
                  : 'Sign in to continue to your dashboard'}
              </p>
            </div>

            {isSignUp ? <SignUpForm /> : <SignInForm />}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#72f68e] hover:text-[#72f68e]/80 text-sm transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#040707] to-[#0a0f0f]">
        <div className="w-full max-w-2xl mx-auto flex flex-col justify-center px-12">
          <div className="relative">
            {/* Background effects */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#72f68e] rounded-full blur-[128px] opacity-20 animate-pulse" />
            <div className="absolute bottom-20 -left-20 w-60 h-60 bg-[#72f68e] rounded-full blur-[128px] opacity-10 animate-pulse delay-300" />

            {/* Content */}
            <div className="relative">
              <div className="flex items-center space-x-2 mb-12">
                <Rocket className="h-8 w-8 text-[#72f68e]" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#72f68e] to-white text-transparent bg-clip-text">
                  The Future of Business
                </h2>
              </div>

              <div className="space-y-12">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 group"
                  >
                    <div className="flex-shrink-0 p-3 rounded-lg bg-[#72f68e]/10 group-hover:bg-[#72f68e]/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-[#72f68e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-white/10">
                <blockquote className="text-lg text-gray-300 italic">
                  "maverika's EVE™ platform has transformed how we operate. 
                  Our virtual workforce handles 90% of routine tasks."
                </blockquote>
                <div className="mt-4">
                  <p className="text-white font-medium">Sarah Chen</p>
                  <p className="text-sm text-gray-400">CEO, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}