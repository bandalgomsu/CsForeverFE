import {useNavigate} from 'react-router-dom';


export default function AppPolicy() {
    const navigate = useNavigate();

    return (
        <div
            className="bg-white text-gray-900 flex flex-col min-h-screen justify-start items-center pt-16 px-4 scale-105 sm:scale-110 transition-transform origin-top">
            <h1
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-blue-600 text-center cursor-pointer"
                onClick={() => navigate("/")}
            >
                CS <span className="text-blue-500">Forever</span>
            </h1>

            <div
                className="w-full max-w-2xl bg-gray-100 p-6 rounded-lg shadow mb-6 text-left text-sm whitespace-pre-line">
                {
                    `개인정보 처리방침
                    최종 수정일: 2025년 6월 2일
                    
                    CsForeverApp(이하 "앱")은 사용자 개인정보 보호를 중요하게 생각하며, 관련 법령에 따라 다음과 같은 방침을 따릅니다.
                    
                    1. 수집하는 개인정보 항목
                    - 이메일 주소, 닉네임 (회원가입 및 로그인 시)
                    - 기기 정보, 앱 사용 로그
                    
                    2. 수집 및 이용 목적
                    - 사용자 인증 및 서비스 이용 기록 관리
                    - 서비스 개선 및 오류 분석
                    
                    3. 개인정보 보유 및 이용 기간
                    - 사용자가 서비스 이용을 중단하거나 삭제 요청 시까지 보관합니다.
                    - 회원탈퇴 기능은 현재 제공되지 않으며, 삭제를 원하실 경우 이메일로 요청하실 수 있습니다.
                    
                    4. 개인정보의 제3자 제공
                    - 앱은 원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다.
                    - 법령에 따라 요구되는 경우 또는 사용자 동의가 있는 경우에만 예외적으로 제공됩니다.
                    
                    5. 개인정보 처리 위탁
                    - 현재 외부 업체에 개인정보 처리를 위탁하지 않습니다.
                    
                    6. 이용자의 권리 및 행사 방법
                    - 사용자는 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할 수 있습니다.
                    - 요청은 이메일(maildevgogo@gmail.com)로 가능합니다.
                    
                    7. 개인정보 파기 절차 및 방법
                    - 수집 목적이 달성된 개인정보는 지체 없이 파기합니다.
                    - 전자 파일은 복구 불가능한 방식으로 안전하게 삭제됩니다.
                    
                    8. 개인정보 보호 책임자
                    - 이름: KoSu
                    - 이메일: maildevgogo@gmail.com
                    
                    9. 변경 고지
                    - 방침이 변경될 경우 앱 업데이트 또는 공지사항을 통해 고지합니다.`}
            </div>

        </div>
    );
}
