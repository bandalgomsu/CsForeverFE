import {useEffect, useState} from 'react';
import {Spinner} from '../utill/Spinner.tsx';
import {useNavigate} from 'react-router-dom';
import api from "../axios/Axios.tsx";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        !!token && navigate('/'); // 토큰이 있으면 메인 페이지로 이동
    }, [location.pathname]); // 경로가 바뀔 때마다 토큰 다시 확인

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.post(`/api/v1/auth/login`, {
                email,
                password,
            });


            const {token} = res.data;
            localStorage.setItem('token', token);

            //@ts-ignore
            if (window.ReactNativeWebView) {
                //@ts-ignore
                window.ReactNativeWebView.postMessage(JSON.stringify({token}));
            }

            navigate('/');
        } catch (e) {
            setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-16 px-4 scale-105 sm:scale-110 transition-transform origin-top">
            {/* 로고 */}
            <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>


            {/* 로그인 폼 */}
            <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow mb-6">
                <label className="block text-sm font-medium mb-2">이메일</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    placeholder="you@example.com"
                />

                <label className="block text-sm font-medium mb-2">비밀번호</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    placeholder="••••••••"
                />

                <button
                    onClick={handleLogin}
                    disabled={isLoading || email.trim() === '' || password.trim() === ''}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <Spinner/>
                            로그인 중...
                        </>
                    ) : (
                        '로그인'
                    )}
                </button>

                {/* 회원가입 링크 */}
                <div className="mt-2 flex justify-end w-full">
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        회원가입
                    </button>
                </div>

                {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
}
