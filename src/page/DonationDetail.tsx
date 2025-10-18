import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {ArrowLeft} from "lucide-react";
import {SpinnerBlue} from "../utill/Spinner.tsx";
import api from "../axios/Axios.tsx";
import {TagToEnumMap} from "../utill/MapUtill.tsx";


export default function DonationDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const {donationId} = useParams<{ donationId: string }>();

    const currentPage = location.state?.currentPage ?? 1;
    const [question, setQuestion] = useState<string>("")
    const [tag, setTag] = useState<string>("")
    const [bestAnswer, setBestAnswer] = useState<string>("");
    const [isConfirmed, setIsConfirmed] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean | null>(false);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchDetail();
    }, [location.pathname, isEditing]);

    async function edit() {
        try {
            setIsLoading(true);

            const res = await api.put(`/api/v1/donations/${donationId}`, {
                question: question,
                tag: TagToEnumMap[tag],
                bestAnswer: bestAnswer
            });

            setIsEditing(false)
        } catch (e) {
            setError('편집에 실패했습니다. 잠시 후 다시 시도해주세요.');
            setIsEditing(true)
        }

        setIsLoading(false);
    }

    async function fetchDetail() {
        try {
            setIsLoading(true);

            const res = await api.get(`/api/v1/donations/${donationId}`);

            setTag(res.data.tag);
            setQuestion(res.data.question);
            setBestAnswer(res.data.bestAnswer);
            setIsConfirmed(res.data.isConfirmed);

        } catch (e) {
            setError('편집에 실패했습니다. 잠시 후 다시 시도해주세요.');
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

            <div className="w-full max-w-2xl bg-gray-100 p-6 rounded-lg shadow mb-6 text-left">
                <div className="flex justify-between relative">
                      <span
                          onClick={() => navigate('/donation', {
                              state: {
                                  "currentPage": currentPage
                              }
                          })}
                      > <ArrowLeft className="hover:underline cursor-pointer"/> </span>

                    {
                        isEditing ? (
                            <span className="flex items-center gap-2">
                              <label htmlFor="tag-select" className="text-xs sm:text-sm text-gray-600"></label>
                              <select
                                  id="tag-select"
                                  value={tag!}
                                  onChange={(e) => {
                                      setTag(e.target.value);
                                  }}
                                  className={`   
                                    bg-transparent
                                    border-2
                                    p-0
                                    text-xs sm:text-sm
                                    text-blue-500
                                    font-bold
                                    focus:outline-none focus:ring-0
                                    cursor-pointer
                                    text-center
                                  `}
                              >
                                <option>tag</option>
                                  {Object.entries(TagToEnumMap).map(([label, value]) => (
                                      <option key={value} value={label}>
                                          {label}
                                      </option>
                                  ))}
                              </select>
                            </span>
                        ) : (
                            <span
                                className={`
                                    absolute left-1/2 transform -translate-x-1/2
                                    font-bold text-xs sm:text-base text-blue-500`}>
                                 {tag}
                            </span>
                        )
                    }

                    {
                        isConfirmed ? (<span className="font-bold text-blue-500"> Thanks! </span>) : (
                            <span>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? "취소" : "편집"}
                                </button>
                            </span>
                        )
                    }
                </div>
                <br></br>
                <div className="flex justify-center">
                    <span className="font-bold text-gray-500 text-xs sm:text-sm">
                        문제
                    </span>
                </div>
                <div className="flex justify-start">
                    <textarea
                        className="bg-white w-full p-2 border border-white-300 rounded-lg text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={5}
                        value={question!!}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="문제를 입력해주세요 (최대 50자)"
                        disabled={!isEditing}
                    />
                </div>

                <br></br>

                <div className="flex justify-center">
                    <span className="font-bold text-gray-500 text-xs sm:text-sm">
                        모범 답안
                    </span>
                </div>
                <div className="flex justify-start w-full">
                    <textarea
                        className="bg-white w-full p-2 border border-white-300 rounded-lg text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={5}
                        value={bestAnswer!!}
                        onChange={(e) => setBestAnswer(e.target.value)}
                        placeholder="모범답안을 입력해주세요 (최대 300자)"
                        disabled={!isEditing}
                    />
                </div>

                <br></br>

                {isEditing && (
                    <div className="flex justify-center">
                        <button
                            className={`
                            border-white
                            px-6
                            rounded-lg
                            font-bold
                            ${question!.length >= 1 && question!.length <= 50 &&
                            bestAnswer!.length >= 1 && bestAnswer!.length <= 300 && tag ?
                                'bg-white text-blue-400 hover:text-blue-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                            `}
                            disabled={
                                !(question!.length >= 1 && question!.length <= 50 &&
                                    bestAnswer!.length >= 1 && bestAnswer!.length <= 300 &&
                                    tag && tag !== '' &&
                                    !isLoading
                                )
                            }
                            onClick={async () => {
                                await edit()
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <SpinnerBlue/>
                                </>
                            ) : (
                                '편집 완료'
                            )}
                        </button>
                    </div>
                )}

            </div>

            {error && <p className="text-red-600 text-xs sm:text-sm mt-4 text-center">{error}</p>}
        </div>
    );
}