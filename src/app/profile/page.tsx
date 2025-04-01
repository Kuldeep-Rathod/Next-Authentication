'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState('nothing');
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);

    const logout = async () => {
        try {
            setLoading(true);
            await axios.get('/api/users/logout');
            toast.success('Logout successful', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid #334155',
                },
            });
            router.push('/login');
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Logout failed',
                {
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const getUserDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/users/me');
            console.log('User details:', res.data);
            setData(res.data.data._id);
            setUserDetails(res.data.data);
        } catch (error: any) {
            console.error('Fetch error:', error);
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to fetch user details',
                {
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid #334155',
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4'>
            <div className='w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-indigo-400'>
                        User Profile
                    </h1>
                    <p className='text-gray-400 mt-2'>
                        Manage your account details
                    </p>
                </div>

                <div className='space-y-4'>
                    {userDetails && (
                        <div className='p-4 bg-gray-700 rounded-lg'>
                            <h2 className='text-xl font-semibold text-white'>
                                Account Information
                            </h2>
                            <div className='mt-2 space-y-2'>
                                <p className='text-gray-300'>
                                    <span className='font-medium'>
                                        Username:
                                    </span>{' '}
                                    {userDetails.username}
                                </p>
                                <p className='text-gray-300'>
                                    <span className='font-medium'>Email:</span>{' '}
                                    {userDetails.email}
                                </p>
                                <p className='text-gray-300'>
                                    <span className='font-medium'>
                                        User ID:
                                    </span>
                                    {data === 'nothing' ? (
                                        ' Not loaded'
                                    ) : (
                                        <Link
                                            href={`/profile/${data}`}
                                            className='text-indigo-400 hover:text-indigo-300 ml-1'
                                        >
                                            {data}
                                        </Link>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className='flex flex-col space-y-3'>
                        <button
                            onClick={getUserDetails}
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                                loading
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
                                    Loading...
                                </span>
                            ) : (
                                'Get User Details'
                            )}
                        </button>

                        <button
                            onClick={logout}
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                                loading
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            Logout
                        </button>
                    </div>

                    <div className='text-center text-sm text-gray-400'>
                        <Link
                            href='/'
                            className='text-indigo-400 hover:text-indigo-300'
                        >
                            ← Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
