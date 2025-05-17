import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import api from "../axios/Axios.tsx";

export default function Profile() {
    const navigate = useNavigate();

    // const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [position, setPosition] = useState('');
    const [career, setCareer] = useState('');
    const [correctSubmissionCount, setCorrectSubmissionCount] = useState('');

    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        !token && navigate('/login');
        const fetch = async () => {
            await fetchProfile();
        }
        fetch()

    }, [location.pathname]);

    async function fetchProfile() {
        try {
            setIsLoading(true);
            const res = await api.get(`/api/v1/user/profile`);
            const {email, nickname, correctSubmissionCount, position, career} = res.data;
            // setEmail(email);
            setNickname(nickname);
            setCorrectSubmissionCount(correctSubmissionCount)
            setPosition(position)
            setCareer(career)
        } catch (e) {
            console.error(e);
            setError('프로필을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
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
                        <div className="text-blue-700 text-xl font-bold text-left">
                            {nickname}
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">해결한 문제</span>
                            <span className="text-black font-bold text-left"> - {correctSubmissionCount} 개</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">직군</span>
                            <span className="text-black font-bold text-left"> - {position}</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left">경력</span>
                            <span className="text-black font-bold text-left"> - {career}년</span>
                        </div>

                        <br/>

                        <div className="flex justify-between">
            <span
                onClick={() => navigate('/profile/submission', {state: {isCorrect: true}})}
                className="text-gray-400 font-bold text-left cursor-pointer hover:underline"
            >
              해결한 문제
            </span>
                            <span
                                onClick={() => navigate('/profile/submission', {state: {isCorrect: false}})}
                                className="text-gray-400 font-bold text-right cursor-pointer hover:underline"
                            >
              틀린 문제
            </span>
                        </div>
                    </>
                )}
            </div>

            {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        </div>
    );
}
