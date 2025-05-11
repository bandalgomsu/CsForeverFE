import {useState} from 'react';
import {TagToEnumMap} from "../utill/MapUtill.tsx";
import {Spinner} from "../utill/Spinner.tsx";
import {useNavigate} from "react-router-dom";
import api from "../axios/Axios.tsx";

const TAGS = ['Spring', 'NodeJS', "ASP.Net", 'React', 'RDB', 'NoSql', "Java", "C#", "JavaScript", 'OS', 'Algorithm', 'Data Structure', 'Network', "Design Pattern", "SW Engineering", "DevOps",];

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
    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<String | null>(null);

    const [isCheckLoading, setIsCheckLoading] = useState(false);

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
        } catch (error) {
            setError('문제를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsGetQuestionReLoading(false);
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
                        문제: {question}
                    </p>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="정답을 입력하세요... (최소 10글자 / 최대 300글자)"
                        className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
                                    불러오는 중...
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
                                    채점 중...
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
                        불러오는 중...
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
