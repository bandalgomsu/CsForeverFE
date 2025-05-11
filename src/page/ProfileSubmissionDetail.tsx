import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import {ArrowLeft} from "lucide-react";

export default function ProfileSubmissionDetail() {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPage = location.state?.currentPage ?? 1;
    const question = location.state?.question ?? null;
    const tag = location.state?.tag ?? null;
    const answer = location.state?.answer ?? null;
    const feedback = location.state?.feedback ?? null;
    const isCorrect = location.state?.isCorrect ?? null;

    useEffect(() => {
        const token = localStorage.getItem('token');
        (!token) && navigate('/login');
        (!question || !tag || !answer || !feedback || !isCorrect) && navigate('/profile')
    }, [location.pathname]);

    return (
        <div
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-16 px-4 scale-105 sm:scale-110 transition-transform origin-top">
            <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>

            <div className="w-full max-w-2xl bg-gray-100 p-6 rounded-lg shadow mb-6 text-left">
                <div className="flex justify-between relative">
                      <span
                          onClick={() => navigate('/profile/submission', {
                              state: {
                                  "isCorrect": isCorrect,
                                  "currentPage": currentPage
                              }
                          })}
                      > <ArrowLeft className="hover:underline cursor-pointer"/> </span>

                    <span
                        className={`
                        absolute left-1/2 transform -translate-x-1/2
                        font-bold ${isCorrect ? 'text-blue-500' : 'text-red-500'}`}>
                        {isCorrect ? "O" : "X"}
                    </span>
                    <span></span>
                </div>

                <div className="flex justify-center">
                    <span className={`
                        font-bold ${isCorrect ? 'text-blue-500' : 'text-red-500'}`}>
                            [{tag}]
                    </span>
                </div>

                <div className="flex justify-start">
                    <span className="font-bold text-gray-500 text-sm">
                        문제
                    </span>
                </div>
                <div className="flex justify-start">
                    <span className="font-bold text-black text-sm whitespace-pre-line">
                        {question}
                    </span>
                </div>

                <br></br>

                <div className="flex justify-start">
                    <span className="font-bold text-gray-500 text-sm">
                        답변
                    </span>
                </div>
                <div className="flex justify-start">
                    <span className="font-bold text-black text-sm whitespace-pre-line">
                        {answer}
                    </span>
                </div>

                <br></br>

                <div className="flex justify-start">
                    <span className="font-bold text-gray-500 text-sm">
                        피드백
                    </span>
                </div>
                <div className="flex justify-start">
                    <span className="font-bold text-black text-sm whitespace-pre-line">
                        {feedback}
                    </span>
                </div>

            </div>

            {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
        </div>
    );
}
