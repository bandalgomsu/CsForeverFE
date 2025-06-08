import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import api from "../axios/Axios.tsx";
import {CareerToEnumMap, PositionToEnumMap} from "../utill/MapUtill.tsx";

export default function ProfileEdit() {
    const navigate = useNavigate();
    const location = useLocation();

    const [nickname, setNickname] = useState<string>(location.state?.nickname ?? '');
    const [title, setTitle] = useState<string>(location.state?.title);
    const [color, setColor] = useState<string>(location.state?.color);
    const [position, setPosition] = useState<string>(PositionToEnumMap[location.state?.position]);
    const [career, setCareer] = useState<string>(String(location.state?.career));
    const [correctSubmissionCount, setCorrectSubmissionCount] = useState(location.state?.correctSubmissionCount);
    const [ranking, setRanking] = useState(location.state?.ranking);
    const [submissionCount, setSubmissionCount] = useState(location.state?.submissionCount);
    const [correctPercent, setCorrectPercent] = useState(location.state?.correctPercent);

    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        !token && navigate('/login');
        (!position || !career) && navigate('/profile')
    }, [location.pathname]);

    async function fetchProfileEdit() {
        try {
            setIsLoading(true);
            const res = await api.put(`/api/v1/user/profile`, {
                nickname: nickname,
                position: position,
                career: career
            });
            setIsLoading(false);
            navigate("/profile")
        } catch (e) {
            setError('프로필을 수정하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }

        setIsLoading(false);
    }

    return (
        <div
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-16 px-4 scale-105 sm:scale-110 transition-transform origin-top">
            <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>

            <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow mb-6 text-left">
                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4"/>
                        <div className="h-4 bg-gray-200 rounded w-1/2"/>
                        <div className="h-4 bg-gray-200 rounded w-2/3"/>
                        <div className="h-4 bg-gray-200 rounded w-1/3"/>
                        <div className="h-5 bg-gray-300 rounded w-full mt-6"/>
                    </div>
                ) : (
                    <>
                        <div className="text-blue-700 text-xl font-bold text-left flex justify-between">
                            <span>
                                <span className={color}>{title} </span>
                                <input
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="focus:outline-none focus:ring-0 bg-transparent border-2"
                                    placeholder='최대 20자'
                                />
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">해결한 문제</span>
                            <span className="text-black font-bold text-left"> - {correctSubmissionCount} 개</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">랭킹</span>
                            <span className="text-black font-bold text-left"> - {ranking}</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">제출 / 정답률</span>
                            <span
                                className="text-black font-bold text-left"> - {submissionCount}번 / {correctPercent}%</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">직군</span>
                            <span className="text-black font-bold text-left"> - </span>
                            <select
                                value={position}
                                className="bg-transparent
                                    border-2
                                    p-0
                                    text-sm
                                    font-bold
                                    focus:outline-none focus:ring-0
                                    cursor-pointer
                                    text-center"
                                onChange={(e) => setPosition(e.target.value)}
                            >
                                {Object.entries(PositionToEnumMap).map(([label, value]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">경력</span>
                            <span className="text-black font-bold text-left"> - </span>
                            <select
                                value={career}
                                className="bg-transparent
                                    border-2
                                    p-0
                                    text-sm
                                    font-bold
                                    focus:outline-none focus:ring-0
                                    cursor-pointer
                                    text-center"
                                onChange={(e) => setCareer(e.target.value)}
                            >
                                {Object.entries(CareerToEnumMap).map(([label, value]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <br/>

                        <div className="flex justify-between">
                            <span
                                onClick={() => navigate('/profile')}
                                className="text-gray-400 font-bold text-right cursor-pointer hover:underline"
                            >
                                뒤로가기
                            </span>
                            <button
                                onClick={fetchProfileEdit}
                                disabled={(!nickname.trim() || nickname.length > 20 || !career || !position)}
                                className={`bg-transparent font-bold text-right hover:underline ${
                                    (!nickname.trim() || nickname.length > 20 || !career || !position) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer'
                                }`}
                            >
                                수정하기
                            </button>
                        </div>
                    </>
                )}
            </div>

            {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        </div>
    );
}
