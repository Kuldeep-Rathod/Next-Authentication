'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function VerifyEmailPage() {
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            setLoading(true);
            await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
            toast.success('Email verified successfully!', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                },
            });
            // Redirect to login after 2 seconds
            setTimeout(() => router.push('/login'), 2000);
        } catch (error: any) {
            setError(true);
            toast.error(error.response?.data?.error || 'Verification failed', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                },
            });
            console.error(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split('=')[1];
        setToken(urlToken || '');
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4'>
            <div className='w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700 text-center'>
                <h1 className='text-3xl font-bold text-indigo-400'>
                    {loading ? 'Verifying Email...' : 'Verify Email'}
                </h1>

                {loading && (
                    <div className='flex justify-center py-4'>
                        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500'></div>
                    </div>
                )}

                {token ? (
                    <div className='p-3 bg-gray-700 rounded-lg break-all'>
                        <code className='text-gray-300 text-sm'>
                            Token: {token}
                        </code>
                    </div>
                ) : (
                    <p className='text-gray-400'>No verification token found</p>
                )}

                {verified && (
                    <div className='space-y-4'>
                        <div className='p-4 bg-green-900/30 border border-green-700 rounded-lg'>
                            <h2 className='text-xl font-medium text-green-400'>
                                Email Verified Successfully!
                            </h2>
                            <p className='text-gray-300 mt-2'>
                                You will be redirected to login shortly...
                            </p>
                        </div>
                        <Link
                            href='/login'
                            className='inline-block px-4 py-2 text-indigo-400 hover:text-indigo-300 font-medium transition'
                        >
                            Or click here to login now
                        </Link>
                    </div>
                )}

                {error && (
                    <div className='p-4 bg-red-900/30 border border-red-700 rounded-lg'>
                        <h2 className='text-xl font-medium text-red-400'>
                            Verification Failed
                        </h2>
                        <p className='text-gray-300 mt-2'>
                            The verification link may be invalid or expired.
                        </p>
                        <Link
                            href='/signup'
                            className='inline-block mt-3 px-4 py-2 text-indigo-400 hover:text-indigo-300 font-medium transition'
                        >
                            Sign up again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
