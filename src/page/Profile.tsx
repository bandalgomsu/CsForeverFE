import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import api from "../axios/Axios.tsx";
import {CorrectCountToTitleMap} from "../utill/MapUtill.tsx";
import ActivityCalendar from "react-activity-calendar";

export default function Profile() {
    const navigate = useNavigate();

    // const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');
    const [position, setPosition] = useState('');
    const [career, setCareer] = useState('');
    const [correctSubmissionCount, setCorrectSubmissionCount] = useState('');
    const [ranking, setRanking] = useState('');
    const [submissionCount, setSubmissionCount] = useState('');
    const [correctPercent, setCorrectPercent] = useState('');
    const [contributions, setContributions] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: currentYear - 2025 + 1}, (_, i) => 2025 + i);
    // const years = [2025, 2026, 2027, 2028, 2029, 2030];

    const [year, setYear] = useState<number>(currentYear);
    const [continuousDay, setContinuousDay] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        !token && navigate('/login');
        const fetch = async () => {
            await fetchProfile();
        }
        fetch()

    }, [location.pathname]);

    useEffect(() => {
        fetchContribution();
    }, [year]);

    async function fetchContribution() {
        try {
            setIsLoading(true);
            const res = await api.get(`/api/v1/contributions?year=${year}`);

            if (res.data.contributions.length === 0) {
                setIsLoading(false);
                return
            }

            const firstDate = res.data.contributions[0].date.slice(5); // 'MM-DD'
            if (firstDate !== '01-01') {
                res.data.contributions.unshift({date: '2025-01-01', count: 0, level: 0});
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yyyy = yesterday.getFullYear();
            const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
            const dd = String(yesterday.getDate()).padStart(2, '0');
            const yesterdayStr = `${yyyy}-${mm}-${dd}`;
            const lastDate = res.data.contributions[res.data.contributions.length - 1].date;

            if (lastDate !== yesterdayStr) {
                res.data.contributions.push({date: yesterdayStr, count: 0, level: 0});
            }

            setContinuousDay(res.data.continuosDay);
            setContributions(res.data.contributions);
        } catch (e) {
            setError('이력 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        }

        setIsLoading(false);
    }

    async function fetchProfile() {
        try {
            setIsLoading(true);
            const res = await api.get(`/api/v1/user/profile`);
            const {
                nickname,
                correctSubmissionCount,
                position,
                career,
                ranking,
                submissionCount,
                correctPercent
            } = res.data;
            // setEmail(email);
            setNickname(nickname);
            setCorrectSubmissionCount(correctSubmissionCount)
            setPosition(position)
            setCareer(career)
            setSubmissionCount(submissionCount)
            setCorrectPercent(correctPercent)

            const titleMap = CorrectCountToTitleMap(correctSubmissionCount)
            const title = titleMap.title;
            const color = titleMap.color;

            setTitle(title);
            setColor(color);

            if (ranking == null) {
                setRanking("집계중..");
            } else {
                setRanking(`${ranking}위`);
            }

        } catch (e) {
            setError('프로필을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
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
                        <div className="text-blue-700 text-base sm:text-xl font-bold text-left flex justify-between">
                            <span><span className={color}>{title}</span> {nickname}</span>
                            <span className="text-xs sm:text-sm text-gray-400 cursor-pointer hover:underline"
                                  onClick={() => navigate("/profile/edit", {
                                      state: {
                                          nickname: nickname,
                                          position: position,
                                          career: career,
                                          correctSubmissionCount: correctSubmissionCount,
                                          submissionCount: submissionCount,
                                          correctPercent: correctPercent,
                                          ranking: ranking,
                                          title: title,
                                          color: color
                                      }
                                  })}>
                                수정
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left text-xs sm:text-base">연속 학습</span>
                            <span
                                className="text-black font-bold text-left text-xs sm:text-base"> - {continuousDay}일 🔥</span>
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
                                className="text-black font-bold text-left text-xs sm:text-base"> - {submissionCount}번 / {correctPercent}%</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left text-xs sm:text-base">직군</span>
                            <span className="text-black font-bold text-left text-xs sm:text-base"> - {position}</span>
                        </div>

                        <div>
                            <span className="text-gray-400 font-bold text-left text-xs sm:text-base">경력</span>
                            <span className="text-black font-bold text-left text-xs sm:text-base"> - {career}년</span>
                        </div>

                        <br/>

                        <div className="flex justify-between">
            <span
                onClick={() => navigate('/profile/submission', {state: {isCorrect: true}})}
                className="text-gray-400 font-bold text-left cursor-pointer hover:underline text-xs sm:text-base"
            >
              해결한 문제
            </span>
                            <span
                                onClick={() => navigate('/profile/submission', {state: {isCorrect: false}})}
                                className="text-gray-400 font-bold text-right cursor-pointer hover:underline text-xs sm:text-base"
                            >
              틀린 문제
            </span>
                        </div>
                    </>
                )}
            </div>

            {contributions.length > 0 && (
                <div className="overflow-auto w-full max-w-md calendar-container">
                    <ActivityCalendar
                        data={contributions}
                        showWeekdayLabels={true}
                        theme={{
                            light: ['#e0f2fe', '#90cdf4', '#60a5fa', '#3b82f6', '#1d4ed8'],
                            dark: ['#e0f2fe', '#90cdf4', '#60a5fa', '#3b82f6', '#1d4ed8']
                        }}
                    />
                </div>
            )}

            <div className="w-full max-w-md flex justify-end">
                <select
                    value={year}
                    className="bg-transparent
                                    border-2
                                    p-0
                                    text-xs sm:text-sm
                                    font-bold
                                    focus:outline-none focus:ring-0
                                    cursor-pointer
                                    text-center"
                    onChange={(e) => setYear(parseInt(e.target.value))}
                >
                    {
                        years.map((year) => (
                            <option key={year} value={year}>
                                {year}년
                            </option>
                        ))
                    }
                </select>
            </div>

            {error && <p className="text-red-600 text-xs sm:text-sm mt-4 text-center">{error}</p>}
        </div>


    );
}