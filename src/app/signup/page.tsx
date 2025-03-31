"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            toast.success("Account created successfully!", {
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                },
            });
            router.push("/login");
        } catch (error: any) {
            console.log("Signup failed", error.message);
            toast.error(
                error.response?.data?.error || error.message || "Signup failed",
                {
                    style: {
                        background: "#1e293b",
                        color: "#fff",
                        border: "1px solid #334155",
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const { email, password, username } = user;
        setButtonDisabled(
            !(
                email.length > 0 &&
                password.length >= 6 &&
                username.length >= 3 &&
                email.includes("@") &&
                email.includes(".")
            )
        );
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-indigo-400">
                        {loading
                            ? "Creating your account..."
                            : "Create Account"}
                    </h1>
                    <p className="text-gray-400 mt-2">Join us to get started</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Username
                        </label>
                        <input
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-400"
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={(e) =>
                                setUser({ ...user, username: e.target.value })
                            }
                            placeholder="Enter your username"
                            disabled={loading}
                        />
                        {user.username.length > 0 &&
                            user.username.length < 3 && (
                                <p className="text-xs text-red-400 mt-1">
                                    Username must be at least 3 characters
                                </p>
                            )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Email
                        </label>
                        <input
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-400"
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                        {user.email.length > 0 &&
                            !(
                                user.email.includes("@") &&
                                user.email.includes(".")
                            ) && (
                                <p className="text-xs text-red-400 mt-1">
                                    Please enter a valid email
                                </p>
                            )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Password
                        </label>
                        <input
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-white placeholder-gray-400"
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                        {user.password.length > 0 &&
                            user.password.length < 6 && (
                                <p className="text-xs text-red-400 mt-1">
                                    Password must be at least 6 characters
                                </p>
                            )}
                    </div>

                    <button
                        onClick={onSignup}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                            buttonDisabled || loading
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </div>

                <div className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
