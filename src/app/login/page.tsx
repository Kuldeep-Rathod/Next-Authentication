'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: '',
        password: '',
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const onLogin = async () => {
        setError(''); // Clear previous errors
        try {
            setLoading(true);
            const response = await axios.post('/api/users/login', user);
            console.log('Login success', response.data);
            toast.success('Login successful!');
            router.push('/profile');
        } catch (error: any) {
            console.error('Login error:', error);

            // Set the error state
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Login failed. Please try again.';
            setError(errorMessage);

            // Show toast only if it's a server error
            if (error.response) {
                toast.error(errorMessage, {
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const { email, password } = user;
        setButtonDisabled(
            !(
                email.length > 0 &&
                password.length >= 6 &&
                email.includes('@') &&
                email.includes('.')
            )
        );
    }, [user]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4'>
            <div className='w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-indigo-400'>
                        {loading ? 'Logging in...' : 'Welcome Back'}
                    </h1>
                    <p className='text-gray-400 mt-2'>
                        Sign in to access your account
                    </p>
                </div>

                {/* Error Message Display */}
                {error && (
                    <div className='p-3 bg-red-900/30 border border-red-700 rounded-lg'>
                        <p className='text-red-400'>{error}</p>
                    </div>
                )}

                <div className='space-y-4'>
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-300 mb-1'
                        >
                            Email Address
                        </label>
                        <input
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-400'
                            id='email'
                            type='email'
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            placeholder='Enter your email'
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-300 mb-1'
                        >
                            Password
                        </label>
                        <input
                            className='w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-400'
                            id='password'
                            type='password'
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            placeholder='Enter your password'
                            disabled={loading}
                        />
                        {user.password.length > 0 &&
                            user.password.length < 6 && (
                                <p className='text-xs text-red-400 mt-1'>
                                    Password must be at least 6 characters
                                </p>
                            )}
                    </div>

                    <button
                        onClick={onLogin}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                            buttonDisabled || loading
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {loading ? (
                            <span className='flex items-center justify-center'>
                                <svg
                                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <circle
                                        className='opacity-25'
                                        cx='12'
                                        cy='12'
                                        r='10'
                                        stroke='currentColor'
                                        strokeWidth='4'
                                    ></circle>
                                    <path
                                        className='opacity-75'
                                        fill='currentColor'
                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    ></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <div className='flex items-center justify-between text-sm'>
                        <Link
                            href='/forgot-password'
                            className='text-indigo-400 hover:text-indigo-300 font-medium transition'
                        >
                            Forgot password?
                        </Link>
                        <Link
                            href='/signup'
                            className='text-gray-400 hover:text-gray-300 transition'
                        >
                            Don't have an account?{' '}
                            <span className='text-indigo-400 hover:text-indigo-300 font-medium'>
                                Sign up
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
