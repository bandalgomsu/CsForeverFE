import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from "../axios/Axios.tsx";

export default function Signup() {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [career, setCareer] = useState('');
    const [position, setPosition] = useState('');

    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);

    const [authExpireTime, setAuthExpireTime] = useState<number | null>(null); // 인증 유효 타이머
    const [resendCooldown, setResendCooldown] = useState<number | null>(null); // 재전송 제한 타이머
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        !!token && navigate('/'); // 토큰이 있으면 메인 페이지로 이동
    }, [location.pathname]); // 경로가 바뀔 때마다 토큰 다시 확인

    // 인증 유효 타이머
    useEffect(() => {
        if (authExpireTime === null || authExpireTime <= 0) return;
        const interval = setInterval(() => {
            setAuthExpireTime((prev) => (prev ?? 0) - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [authExpireTime]);

    // 재전송 제한 타이머
    useEffect(() => {
        if (resendCooldown === null || resendCooldown <= 0) return;
        const interval = setInterval(() => {
            setResendCooldown((prev) => (prev ?? 0) - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleSendVerificationCode = async () => {
        try {
            await api.post(`/api/v1/auth/mail/${email}`,);

            setIsSendingCode(true);
            setIsSendingCode(false);
            setIsCodeSent(true);
            setIsVerified(null);
            setVerificationCode('');
            setAuthExpireTime(180);      // 인증 유효 시간 3분
            setResendCooldown(10);       // 재전송 제한 10초
            setError('');
        } catch (e) {
            setError('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            setIsVerifying(true);
            const response = await api.post(`/api/v1/auth/mail/verify`,
                {
                    "email": email,
                    "code": verificationCode
                });

            setIsVerified(true);
            setAuthExpireTime(null);
            setResendCooldown(null);
            setError('');
        } catch (e) {
            console.log(e)
            setIsVerified(false);
            setError('이메일 인증에 실패 했습니다.');
        }

        setIsVerifying(false);
    };

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await api.post(`/api/v1/auth/signUp`, {
                "nickname": nickname,
                "email": email,
                "password": password,
                "career": career,
                "position": position
            });

            await localStorage.setItem("token", response.data.token);
            navigate('/');
        } catch (e) {
            setError('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const isSignupDisabled =
        !nickname.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !career ||
        !position ||
        isVerified !== true;

    return (
        <div
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-16 px-4 scale-105 sm:scale-110 transition-transform origin-top">
            <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>

            <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow mb-6">
                {/* 닉네임 */}
                <label className="block text-sm font-medium mb-2">닉네임</label>
                <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    placeholder="닉네임을 입력하세요"
                />

                {/* 이메일 + 인증번호 전송 */}
                <label className="block text-sm font-medium mb-2">이메일</label>
                <div className="flex flex-wrap gap-2 mb-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 min-w-0 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
                        placeholder="you@example.com"
                        disabled={isVerified === true}
                    />
                    <button
                        onClick={handleSendVerificationCode}
                        className={`h-10 px-3 rounded text-sm shrink-0 transition 
        ${isVerified === true || (resendCooldown && resendCooldown > 0) || email.trim() === ''
                            ? 'bg-gray-400 text-white cursor-default'
                            : 'bg-blue-500 text-white hover:bg-blue-600'}
    `}
                        disabled={
                            isSendingCode ||
                            isVerified === true ||
                            (resendCooldown && resendCooldown > 0) ||
                            email.trim() === ''
                        }
                    >
                        {isSendingCode
                            ? '전송 중...'
                            : isCodeSent
                                ? resendCooldown && resendCooldown > 0
                                    ? `재전송 (${resendCooldown}s)`
                                    : '재전송'
                                : '인증번호 전송'}
                    </button>

                </div>

                {/* 인증번호 입력 + 인증 */}
                {isCodeSent && (
                    <>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <input
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="flex-1 min-w-0 h-10 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
                                placeholder="인증번호 입력"
                                disabled={isVerified === true}
                            />
                            <button
                                onClick={handleVerifyCode}
                                className={`h-10 px-3 rounded text-sm shrink-0 transition 
                                    ${isVerified === true
                                    ? 'bg-gray-400 text-white cursor-default'
                                    : 'bg-green-500 text-white hover:bg-green-600'}
                                `}
                                disabled={isVerifying || isVerified === true}
                            >
                                {isVerified === true
                                    ? '인증 성공'
                                    : isVerifying
                                        ? '인증 중...'
                                        : '인증'}
                            </button>
                        </div>

                        {authExpireTime !== null && (
                            authExpireTime > 0 ? (
                                <p className="text-xs text-gray-500 mb-2">
                                    인증 유효
                                    시간: {`${String(Math.floor(authExpireTime / 60)).padStart(2, '0')}:${String(authExpireTime % 60).padStart(2, '0')}`}
                                </p>
                            ) : (
                                <p className="text-xs text-red-500 mb-2">
                                    시간이 만료되었습니다. 인증번호를 다시 요청해주세요.
                                </p>
                            )
                        )}
                    </>
                )}

                {/* 비밀번호 */}
                <label className="block text-sm font-medium mb-2">비밀번호</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    placeholder="비밀번호"
                />

                {/* 비밀번호 확인 */}
                <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    placeholder="비밀번호 확인"
                />

                {/* 년차 */}
                <label className="block text-sm font-medium mb-2">년차</label>
                <select
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                    <option value="">선택하세요</option>
                    <option value="1">1년차</option>
                    <option value="2">2년차</option>
                    <option value="3">3년차</option>
                    <option value="4">4년차</option>
                    <option value="5">5년차</option>
                    <option value="6">6년차</option>
                    <option value="7">7년차</option>
                    <option value="8">8년차</option>
                    <option value="9">9년차</option>
                    <option value="10">10년차 이상</option>
                </select>

                {/* 선호 직군 */}
                <label className="block text-sm font-medium mb-2">직군</label>
                <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                    <option value="">선택하세요</option>
                    <option value="FRONTEND">프론트엔드</option>
                    <option value="BACKEND">백엔드</option>
                    <option value="FULLSTACK">풀스택</option>
                    <option value="ANDROID">안드로이드</option>
                    <option value="IOS">IOS</option>
                    <option value="GAME">게임</option>
                    <option value="AI">AI</option>
                    <option value="DATA_ENGINEER">데이터 엔지니어</option>
                    <option value="DEVOPS">DevOps</option>
                    <option value="DEFAULT">기타</option>
                </select>

                {/* 회원가입 버튼 */}
                <button
                    onClick={handleSignup}
                    disabled={isSignupDisabled}
                    className={`w-full py-2 rounded transition flex items-center justify-center
                    ${isSignupDisabled
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}
                    `}
                >
                    회원가입
                </button>


                {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
}
