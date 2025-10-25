import {useEffect, useState} from 'react';
import {TagToEnumMap} from "../utill/MapUtill.tsx";
import {Spinner} from "../utill/Spinner.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import api from "../axios/Axios.tsx";
import {ArrowLeft, CircleCheck, Search} from "lucide-react";


// const TAGS = ['Spring', 'NodeJS', "ASP.Net", 'React', 'RDB', 'NoSql', "Java", "C#", "JavaScript", 'OS', 'Algorithm', 'Data Structure', 'Network', "Design Pattern", "SW Engineering", "DevOps"];

const TAGS = Object.keys(TagToEnumMap);

export function Question() {
    const navigate = useNavigate();
    const location = useLocation();

    const {questionId} = useParams<{ questionId: string }>();
    const currentPage = location.state.page ?? 1;
    const tag = location.state.tag ?? '';

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showQuestionBox, setShowQuestionBox] = useState(false);
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showResultBox, setShowResultBox] = useState(false);

    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isSolution, setIsSolution] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<String | null>(null);

    const [isCheckLoading, setIsCheckLoading] = useState(false);

    const [term, setTerm] = useState<string>('');
    const [termDefinition, setTermDefinition] = useState<string>('');
    const [isGetTermDefinitionLoading, setIsGetTermDefinitionLoading] = useState(false);

    const [isGetQuestionLoading, setIsGetQuestionLoading] = useState(false);
    const [isGetQuestionReLoading, setIsGetQuestionReLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        !token && navigate('/login');

        const fetch = async () => {
            await handleGetQuestion()
        }
        fetch()

        setError("");

    }, [location.pathname]);

    const handleSubmitCheck = async () => {
        setIsLoading(true)
        setIsCheckLoading(true);           // 로딩 시작

        try {
            const res = await api.post(`/api/v1/questions`, {
                    "questionId": questionId,
                    "answer": answer
                }
            )

            const data = res.data
            setIsCorrect(data.isCorrect);

            if (data.isCorrect) {
                setIsSolution(true);
            }

            setFeedback(data.feedback);

            setError("")
            setShowQuestionBox(true);
            setShowResultBox(true);
        } catch (error) {
            setError('정답을 채점하던 중 오류가 발생했습니다. 잠시 후 다시 시도 해주세요.');
        } finally {
            setIsCheckLoading(false);
            setIsLoading(false)
        }
    };

    const handleGetBestAnswer = async () => {
        setIsLoading(true)
        setIsCheckLoading(true);           // 로딩 시작

        try {
            const res = await api.get(`/api/v1/questions/bestAnswer/${questionId}`)

            const data = res.data
            setIsCorrect(false);
            setFeedback(`모범답안 : ${data.bestAnswer}`);

            setError("")
            setShowQuestionBox(true);
            setShowResultBox(true);

        } catch (error) {
            setError('모범 답안을 불러오던 중 오류가 발생했습니다. 잠시 후 다시 시도 해주세요.');
        } finally {
            setIsCheckLoading(false);
            setIsLoading(false)
        }
    };

    const handleGetQuestion = async () => {
        setIsLoading(true)
        setIsGetQuestionLoading(true);// 로딩 시작

        try {
            const res = await api.get(`/api/v1/questions/${questionId}`);
            const data = res.data
            setQuestion(data.question);

            setError("")
            setShowQuestionBox(true);
            setShowResultBox(false);
            setAnswer('');
            setTerm('');
            setTermDefinition('');

            setIsSolution(data.isSolution)
        } catch (error) {
            setError('문제를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도 해주세요.');
        } finally {
            setIsGetQuestionLoading(false);
            setIsLoading(false)
        }
    };

    const handleGetTermDefinition = async () => {
        setIsLoading(true)
        setIsGetTermDefinitionLoading(true);// 로딩 시작

        try {
            const trimmed = term.trim();
            const isKorean = /[가-힣]/.test(trimmed);
            const noSpaceTerm = trimmed.replace(/\s+/g, '');

            const res = await api.get(`/api/v1/terms/${encodeURIComponent(noSpaceTerm)}`);
            setTermDefinition(res.data.definition);
        } catch (error) {
            setError('단어를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsGetTermDefinitionLoading(false);
            setIsLoading(false)
        }
    };

    return (
        <div
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-8 sm:pt-16 px-3 sm:px-4 scale-100 sm:scale-105 md:scale-110 transition-transform origin-top">

            {/* 로고 */}
            <h1
                className="text-xl sm:text-3xl md:text-6xl font-bold mb-6 sm:mb-8 text-blue-600 text-center cursor-pointer touch-manipulation"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>

            {/* 문제 박스 */}
            {showQuestionBox && (
                <div className="w-full max-w-xl bg-gray-100 p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">

                    <p className="text-xs sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 flex justify-between">
                         <span
                             onClick={() => navigate(`/question?page=${encodeURIComponent(currentPage)}&tag=${encodeURIComponent(tag)}`)}>
                              <ArrowLeft className="hover:underline cursor-pointer"/>
                         </span>

                        <span>
                        {isSolution ? <CircleCheck className="inline align-middle mr-2 text-blue-600"/> : null}
                            문제: {question}
                        </span>

                        <span
                            className="cursor-pointer hover:underline font-bold text-red-600 touch-manipulation ml-2"
                            onClick={handleGetBestAnswer}>[답안 보기]
                        </span>
                    </p>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="정답을 입력하세요... (최소 10글자 / 최대 300글자)"
                        className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-xs sm:text-base"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // 기본 줄바꿈 방지
                                if (!(isLoading || isCheckLoading || answer.trim().length < 10)) {
                                    handleSubmitCheck();
                                }
                            }
                        }}
                    />

                    {showResultBox && (
                        <div
                            className="mt-4 sm:mt-6 mb-3 sm:mb-4 bg-white border border-gray-300 rounded p-3 sm:p-4 shadow-sm">
                            <p className="mb-2 font-semibold">
                                <span className={isCorrect ? 'text-blue-600' : 'text-red-600'}>
                                    {isCorrect ? '정답 !' : '오답 !'}
                                 </span>
                            </p>
                            <p className="text-xs sm:text-sm lg:text-base text-gray-700 whitespace-pre-line">
                                <span className="font-semibold"> - 정답 해설 - </span>
                                <p>{feedback}</p>
                            </p>
                        </div>
                    )}
                    {showResultBox && (
                        <div
                            className="mt-4 sm:mt-6 mb-3 sm:mb-4 bg-white border border-gray-300 rounded p-3 sm:p-4 shadow-sm">
                            <p className="flex flex-col sm:inline-flex sm:flex-row items-start sm:items-center gap-2 mb-3">
                                <span className="text-xs sm:text-sm">용어 검색 </span>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        className="h-8 sm:h-6 w-full sm:w-20 text-xs p-1 border border-gray-300 bg-white rounded"
                                        placeholder="최대 30자"
                                        value={term}
                                        onChange={(e) => setTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (!(isLoading || isGetTermDefinitionLoading || term.trim().length < 1 || term.trim().length > 30)) {
                                                    handleGetTermDefinition();
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        className="bg-blue-500 px-2 sm:px-1 py-1 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center min-h-[44px] sm:min-h-0 touch-manipulation"
                                        onClick={handleGetTermDefinition}
                                        disabled={isLoading || isGetTermDefinitionLoading || term.trim().length < 1 || term.trim().length > 30}
                                    >
                                        {isGetTermDefinitionLoading ? (
                                            <Spinner/>
                                        ) : (
                                            <Search size={16}/>
                                        )}
                                    </button>
                                </div>
                            </p>
                            {termDefinition != '' && (
                                <p className="text-xs sm:text-sm lg:text-base text-gray-700 whitespace-pre-line">
                                    <p>{termDefinition}</p>
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                        <span></span>

                        {/* 정답 제출 버튼 */}
                        <button
                            className="bg-blue-500 text-white px-4 py-3 sm:py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center min-h-[44px] touch-manipulation text-xs sm:text-base"
                            onClick={handleSubmitCheck}
                            disabled={isLoading || isCheckLoading || answer.trim().length < 10}
                        >
                            {isCheckLoading ? (
                                <>
                                    <Spinner/>
                                </>
                            ) : (
                                '정답 제출'
                            )}
                        </button>
                    </div>
                </div>
            )}

            <p className="text-center text-red-600 text-sm sm:text-xl font-bold px-2">{error}</p>
        </div>
    );
}

export default Question;