import {useState} from 'react';
import './App.css';
import axios from "axios";
import {baseUrl} from "./main.tsx";

const Spinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-white mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
    </svg>
);

const TAGS = ['Spring', 'NodeJS', "ASP.Net", 'React', 'DB', "Java", "C#", "JavaScript", 'OS', 'Algorithm', 'Data Structure', 'Network', "Design Pattern", "SW Engineering", "DevOps",];

// 샘플 정답 및 해설
const CORRECT_ANSWER = '서로 다른 시스템 간 통신을 가능하게 한다';
const EXPLANATION = 'API는 프론트엔드와 백엔드, 혹은 시스템 간 데이터를 주고받을 수 있도록 하는 인터페이스입니다.';

function App() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showQuestionBox, setShowQuestionBox] = useState(false);
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [feedback, setFeedback] = useState('');
    const [questionId, setQuestionId] = useState(0);
    const [showResultBox, setShowResultBox] = useState(false);

    const [isAnswer, setIsAnswer] = useState<boolean | null>(null);
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
            const res = await axios.post(`${baseUrl}/api/v1/questions`, {"questionId": questionId, "answer": answer});
            const data = res.data
            setIsAnswer(data.isAnswer);
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
            const res = await axios.get(`${baseUrl}/api/v1/questions?tags=${selectedTags.join(',')}`);
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
            const res = await axios.get(`${baseUrl}/api/v1/questions?tags=${selectedTags.join(',')}`);
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
        <div className="bg-white text-gray-900 flex flex-col min-h-screen justify-center items-center px-4
                scale-90 sm:scale-100 transition-transform origin-top">
            {/* 로고 */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center">
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
                            className={`w-full min-w-0 px-2 py-1 sm:px-3 sm:py-2 rounded-full border transition
                    flex justify-center items-center
                    ${isSelected
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                        >
                <span className="text-[10px] sm:text-xs md:text-sm text-center leading-tight break-keep">
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
                        placeholder="정답을 입력하세요... (최소 10글자)"
                        className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    />

                    {showResultBox && (
                        <div className="mt-6 mb-4 bg-white border border-gray-300 rounded p-4 shadow-sm">
                            <p className="mb-2 font-semibold">
                                <span className={isAnswer ? 'text-blue-600' : 'text-red-600'}>
                                    {isAnswer ? '정답 !' : '오답 !'}
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
                            disabled={isLoading || isGetQuestionReLoading}
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
                disabled={isLoading || isGetQuestionLoading}
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

export default App;
