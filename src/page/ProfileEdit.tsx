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
                className="text-xl sm:text-3xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>

            <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow mb-6 text-left">
                <div className="text-blue-700 text-base sm:text-xl font-bold text-left flex justify-between">
                    <span><span className={color}>{title}</span> {nickname}</span>
                </div>

                <div>
                    <span className="text-gray-400 font-bold text-left text-xs sm:text-base">해결한 문제</span>
                    <span
                        className="text-black font-bold text-left text-xs sm:text-base"> - {correctSubmissionCount} 개</span>
                </div>

                <div>
                    <span className="text-gray-400 font-bold text-left text-xs sm:text-base">랭킹</span>
                    <span className="text-black font-bold text-left text-xs sm:text-base"> - {ranking}</span>
                </div>

                <div>
                    <span className="text-gray-400 font-bold text-left text-xs sm:text-base">제출 / 정답률</span>
                    <span
                        className="text-black font-bold text-left text-xs sm:text-base"> - {submissionCount} / {correctPercent}%</span>
                </div>

                <hr className="my-4 border-t border-gray-300"/>

                <label className="block text-xs sm:text-base font-bold text-gray-700 mb-2">
                    닉네임
                </label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-2 text-xs sm:text-base border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="닉네임을 입력하세요"
                />

                <label className="block text-xs sm:text-base font-bold text-gray-700 mb-2 mt-4">
                    직군
                </label>
                <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-2 text-xs sm:text-base border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">직군을 선택하세요</option>
                    {Object.keys(PositionToEnumMap).map((pos) => (
                        <option key={pos} value={PositionToEnumMap[pos]}>
                            {pos}
                        </option>
                    ))}
                </select>

                <label className="block text-xs sm:text-base font-bold text-gray-700 mb-2 mt-4">
                    경력
                </label>
                <select
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full p-2 text-xs sm:text-base border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">경력을 선택하세요</option>
                    {Object.keys(CareerToEnumMap).map((career) => (
                        <option key={career} value={CareerToEnumMap[career]}>
                            {career}
                        </option>
                    ))}
                </select>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => navigate("/profile")}
                        className="px-4 py-2 text-xs sm:text-base bg-gray-300 text-gray-700 font-bold rounded hover:bg-gray-400 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={fetchProfileEdit}
                        disabled={isLoading || !nickname.trim() || !position || !career}
                        className="px-4 py-2 text-xs sm:text-base bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? '저장 중...' : '저장'}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-600 text-xs sm:text-sm mt-4 text-center">{error}</p>}
        </div>
    );
}