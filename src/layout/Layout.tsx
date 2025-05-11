import {Outlet, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';

export default function Layout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location.pathname]); // 경로가 바뀔 때마다 토큰 다시 확인

    const handleClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* 헤더 */}
            <header className="flex justify-end items-center px-6 py-4">
                <div
                    onClick={handleClick}
                    className="cursor-pointer text-gray-600 hover:underline"
                >
                    {isLoggedIn ? '내 정보' : '로그인'}
                </div>
            </header>

            {/* 페이지 컨텐츠 */}
            <main className="flex-1 px-4 py-8">
                <Outlet/>
            </main>

            {/* 푸터 */}
            <footer className="flex justify-center text-center text-sm text-gray-600 py-4">
                Contact : <a href="mailto:rhtn1128@gmail.com" className="underline">rhtn1128@gmail.com</a>
            </footer>
        </div>
    );
}
