import {Outlet, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import api from "../axios/Axios.tsx";

export default function Layout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location.pathname, isLoggedIn]);

    const handleClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    async function handleLogout() {
        try {
            await api.delete("/api/v1/auth/logout")
            localStorage.removeItem("token");

            //@ts-ignore
            if (window.ReactNativeWebView?.postMessage) {
                //@ts-ignore
                await window.ReactNativeWebView.postMessage(JSON.stringify({type: 'logout'}));
            }

            setIsLoggedIn(false);

            //@ts-ignore
            if (!window.ReactNativeWebView) {
                alert("로그아웃에 성공했습니다.")
            }

            navigate('/login');
        } catch (e) {
            //@ts-ignore
            if (!window.ReactNativeWebView) {
                alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.")
            }

            //@ts-ignore
            if (window.ReactNativeWebView?.postMessage) {
                //@ts-ignore
                await window.ReactNativeWebView.postMessage(JSON.stringify({type: 'logout-fail'}));
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* 헤더 */}
            <header className="flex justify-end items-center px-4 sm:px-6 py-3 sm:py-4">
                <div
                    onClick={() => navigate('/donation')}
                    className="cursor-pointer text-gray-600 hover:underline text-sm sm:text-base
                             min-h-[44px] flex items-center px-2 py-1 touch-manipulation"
                >
                    CS 기부
                </div>

                <div
                    onClick={handleClick}
                    className="cursor-pointer text-gray-600 hover:underline text-sm sm:text-base
                             min-h-[44px] flex items-center px-2 py-1 touch-manipulation"
                >
                    {isLoggedIn ? '내 정보' : '로그인'}
                </div>
            </header>

            {/* 페이지 컨텐츠 */}
            <main className="flex-1 px-3 sm:px-4 py-6 sm:py-8">
                <Outlet/>
            </main>

            <br></br>
            {/* 푸터 */}
            <footer className="text-center text-xs sm:text-sm text-gray-600 py-3 sm:py-4 px-3">
                <div className="mb-2 sm:mb-0">
                    Contact :
                    <a
                        href="mailto:maildevgogo@gmail.com"
                        className="underline ml-1 break-all"
                    >
                        maildevgogo@gmail.com
                    </a>
                </div>
                <div
                    onClick={() => navigate("/app-policy")}
                    className="mt-2 hover:underline cursor-pointer min-h-[44px]
                             flex items-center justify-center touch-manipulation py-1"
                >
                    개인정보 처리 방침
                </div>

                {isLoggedIn && (
                    <div
                        onClick={() => handleLogout()}
                        className="mt-2 hover:underline cursor-pointer min-h-[44px]
                                 flex items-center justify-center touch-manipulation py-1"
                    >
                        로그아웃
                    </div>
                )}
            </footer>
        </div>
    );
}