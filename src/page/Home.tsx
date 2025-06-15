import {useState} from 'react';
import {TagToEnumMap} from "../utill/MapUtill.tsx";
import {Spinner} from "../utill/Spinner.tsx";
import {useNavigate} from "react-router-dom";
import api from "../axios/Axios.tsx";
import {CircleCheck, Search} from "lucide-react";


// const TAGS = ['Spring', 'NodeJS', "ASP.Net", 'React', 'RDB', 'NoSql', "Java", "C#", "JavaScript", 'OS', 'Algorithm', 'Data Structure', 'Network', "Design Pattern", "SW Engineering", "DevOps"];

const TAGS = Object.keys(TagToEnumMap);

export function Home() {
    const navigate = useNavigate();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showQuestionBox, setShowQuestionBox] = useState(false);
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [feedback, setFeedback] = useState('');
    const [questionId, setQuestionId] = useState(0);
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

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

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
            const tags = selectedTags.map(tag => encodeURIComponent(TagToEnumMap[tag]));
            const res = await api.get(`/api/v1/questions?tags=${tags.join(',')}`);
            const data = res.data
            setQuestion(data.question);
            setQuestionId(data.questionId);

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

    const handleGetQuestionReLoad = async () => {
        setIsLoading(true)
        setIsGetQuestionReLoading(true);// 로딩 시작

        try {
            const tags = selectedTags.map(tag => encodeURIComponent(TagToEnumMap[tag]));
            const res = await api.get(`/api/v1/questions?tags=${tags.join(',')}`)
            const data = res.data
            setQuestion(data.question);
            setQuestionId(data.questionId);

            setError("")
            setShowQuestionBox(true);
            setShowResultBox(false);
            setAnswer('');
            setTerm('');
            setTermDefinition('');

            setIsSolution(data.isSolution)
        } catch (error) {
            setError('문제를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsGetQuestionReLoading(false);
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
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-16 px-4 scale-105 sm:scale-110 transition-transform origin-top">

            {/* 로고 */}
            <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>


            {/* 태그 선택 */}
            <div className="grid grid-cols-5 gap-3 mb-8 w-full max-w-xl">
                {TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`
                            group min-w-0 w-full h-10 px-2 relative
                            flex items-center justify-center bg-transparent rounded-none
                            after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-1
                            after:h-[2px] after:rounded-full
                            ${isSelected
                                ? 'after:bg-blue-600'
                                : 'after:bg-gray-300 group-hover:after:bg-gray-400'}
                            `}
                        >
                            <span
                                className={`
                                    text-[9px] sm:text-[10px] md:text-xs lg:text-sm
                                    text-center font-bold break-words leading-tight px-1
                                    ${isSelected ? 'text-blue-600' : 'text-gray-700'}
                                `}
                            >
                                {tag}
                            </span>
                        </button>

                    );
                })}
            </div>


            {/* 문제 박스 */}
            {showQuestionBox && (
                <div className="w-full max-w-xl bg-gray-100 p-6 rounded-lg shadow mb-6">
                    <p className="text-base sm:text-lg font-semibold mb-4">
                        {isSolution ? <CircleCheck className="inline align-middle mr-2 text-blue-600"/> : null}
                        문제: {question}
                        <span
                            className="cursor-pointer hover:underline font-bold text-red-600"
                            onClick={handleGetBestAnswer}>[답안 보기]
                        </span>
                    </p>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="정답을 입력하세요... (최소 10글자 / 최대 300글자)"
                        className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
                        <div className="mt-6 mb-4 bg-white border border-gray-300 rounded p-4 shadow-sm">
                            <p className="mb-2 font-semibold">
                                <span className={isCorrect ? 'text-blue-600' : 'text-red-600'}>
                                    {isCorrect ? '정답 !' : '오답 !'}
                                 </span>
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                                <span className="font-semibold"> - 정답 해설 - </span>
                                <p>{feedback}</p>
                            </p>
                        </div>
                    )}
                    {showResultBox && (
                        <div className="mt-6 mb-4 bg-white border border-gray-300 rounded p-4 shadow-sm">
                            <p className="inline-flex items-center gap-2 mb-3">
                                <span className="text-sm">용어 검색 :</span>
                                <input
                                    type="text"
                                    className="h-6 w-20 text-xs p-1 border border-gray-300 bg-white rounded"
                                    placeholder="최대 30자"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // 기본 줄바꿈 방지
                                            if (!(isLoading || isGetTermDefinitionLoading || term.trim().length < 1 || term.trim().length > 30)) {
                                                handleGetTermDefinition();
                                            }
                                        }
                                    }}
                                />
                                <button
                                    className="bg-blue-500 px-1 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
                                    onClick={handleGetTermDefinition}
                                    disabled={isLoading || isGetTermDefinitionLoading || term.trim().length < 1 || term.trim().length > 30}
                                >
                                    {isGetTermDefinitionLoading ? (
                                        <>
                                            <Spinner/>
                                        </>
                                    ) : (
                                        <Search size={18}/>
                                    )}
                                </button>
                            </p>
                            {termDefinition != '' && (
                                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                                    <p>{termDefinition}</p>
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex justify-between">
                        {/* 다른 문제 버튼 */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
                            onClick={handleGetQuestionReLoad}
                            disabled={isLoading || isGetQuestionReLoading || selectedTags.length == 0}
                        >
                            {isGetQuestionReLoading ? (
                                <>
                                    <Spinner/>
                                </>
                            ) : (
                                '다른 문제'
                            )}
                        </button>

                        {/* 정답 제출 버튼 */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
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

            {/* 문제 풀기 버튼 */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center"
                onClick={async () => {
                    await handleGetQuestion();
                }}
                disabled={isLoading || isGetQuestionLoading || selectedTags.length == 0}
            >
                {isGetQuestionLoading ? (
                    <>
                        <Spinner/>
                    </>
                ) : (
                    '문제 풀기'
                )}
            </button>

            <p className="text-center text-red-600 text-xl font-bold">{error}</p>
        </div>
    );
}

export default Home;
