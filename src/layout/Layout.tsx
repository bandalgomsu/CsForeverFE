import {Outlet, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import api from "../axios/Axios.tsx";

export default function Layout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [location.pathname, isLoggedIn]); // 경로가 바뀔 때마다 토큰 다시 확인

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
            setIsLoggedIn(false);
            alert("로그아웃에 성공했습니다.")
        } catch (e) {
            console.error(e)
            alert("로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.")
        }


    }

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

            <br></br>
            {/* 푸터 */}
            <footer className="text-center text-sm text-gray-600 py-4">
                <div>
                    Contact : <a href="mailto:maildevgogo@gmail.com" className="underline">maildevgogo@gmail.com</a>
                </div>
                {isLoggedIn && (
                    <div
                        onClick={() => handleLogout()}
                        className="mt-2 hover:underline cursor-pointer"
                    >로그아웃</div>
                )}
            </footer>

        </div>
    );
}
