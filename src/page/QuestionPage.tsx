import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import api from "../axios/Axios.tsx";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {TagToEnumMap} from "../utill/MapUtill.tsx";

export interface Question {
    submissionId: number;
    tag: string;
    answer: string;
    feedback: string;
    isCorrect: boolean;

    questionId: number,
    question: string,
    bestAnswer: string,
    isSolution: boolean
}

export default function QuestionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') ?? '1'));
    const [page, setPage] = useState<Question[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 15;

    const pageBlockSize = 10;

    const currentBlockStart = Math.floor((currentPage - 1) / pageBlockSize) * pageBlockSize + 1;
    const currentBlockEnd = Math.min(currentBlockStart + pageBlockSize - 1, totalPages);

    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') ?? '');

    useEffect(() => {
        const token = localStorage.getItem('token');
        !token && navigate('/login');

        const fetch = async () => {
            await fetchSubmissions();
        }
        fetch()

        setError("");

    }, [location.pathname, currentPage, selectedTag]);

    async function fetchSubmissions() {
        try {
            setIsLoading(true);

            if (selectedTag != '') {
                const res = await api.get(`/api/v1/questions?tag=${TagToEnumMap[selectedTag]}&page=${currentPage}&size=${pageSize}`);

                setPage(res.data.results);
                setSearchParams({page: res.data.currentPage.toString(), tag: selectedTag});
                setTotalPages(res.data.totalPages)
            }
        } catch (e) {
            setError('문제를 불러오는데 문제가 생겼습니다. 잠시 후 다시 시도해주세요.');
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
                {isLoading ? (
                    // 🔵 로딩 중: 스피너만 보여줌
                    <div className="space-y-4 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-5 bg-gray-300 rounded w-full"/>
                        ))}
                        <div className="flex justify-center gap-2 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-8 h-4 bg-gray-200 rounded"/>
                            ))}
                        </div>
                    </div>

                ) : (
                    // ✅ 로딩 완료 후: 전체 콘텐츠 렌더링
                    <>
                        <div className="flex justify-between relative">
                            <span>
                            </span>
                            <span
                                className={`
                                    absolute left-1/2 transform -translate-x-1/2
                                    font-bold text-xs sm:text-base text-blue-500`}>
                                CS 문제
                            </span>
                            <span></span>

                        </div>

                        <br/>

                        <div>
                            {page.map((data, index) => (
                                <div key={data.submissionId} className="text-xs sm:text-sm">
                                    <p
                                        onClick={() =>
                                            navigate(`/question/${data.questionId}`, {
                                                state: {
                                                    page: currentPage,
                                                    tag: selectedTag
                                                }
                                            })
                                        }
                                        className={
                                            `
                                            ${data.isSolution ? 'text-blue-500' : 'text-black'}
                                            font-bold truncate block max-w-full cursor-pointer hover:underline
                                            `
                                        }
                                    >
                                        {(index + 1) + pageSize * (currentPage - 1)}.{" "}{data.question}
                                    </p>
                                    <br/>
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                onClick={() => setCurrentPage(currentBlockStart - 1)}
                                disabled={currentBlockStart === 1}
                                className="px-2 py-1 rounded text-blue-500 disabled:text-gray-500"
                            >
                                <ArrowLeft/>
                            </button>

                            {Array.from({length: currentBlockEnd - currentBlockStart + 1}, (_, i) => {
                                const pageNum = currentBlockStart + i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`focus:outline-none text-xs sm:text-base ${
                                            pageNum === currentPage ? 'text-blue-400' : 'text-black'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setSearchParams({page: (currentPage + 1).toString(), tag: selectedTag})}
                                disabled={currentBlockEnd >= totalPages}
                                className="px-2 py-1 rounded text-blue-500 disabled:text-gray-500"
                            >
                                <ArrowRight/>
                            </button>
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <span className="flex items-center gap-2">
                              <label htmlFor="tag-select" className="text-xs sm:text-sm text-gray-600"></label>
                              <select
                                  id="tag-select"
                                  value={selectedTag}
                                  onChange={(e) => {
                                      setSelectedTag(e.target.value);
                                      setCurrentPage(1); // 태그 바뀌면 첫 페이지로
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
                                <option value="">Tag를 선택해주세요</option>
                                  {Object.entries(TagToEnumMap).map(([label, value]) => (
                                      <option key={label} value={label}>
                                          {label}
                                      </option>
                                  ))}
                              </select>
                            </span>
                        </div>
                    </>
                )}
            </div>

            {error && <p className="text-red-600 text-xs sm:text-sm mt-4 text-center">{error}</p>}
        </div>
    );

}