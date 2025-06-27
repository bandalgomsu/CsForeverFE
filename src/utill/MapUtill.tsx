export const TagToEnumMap: Record<string, string> = {
    "Spring": "SPRING",
    "NodeJS": "NODE_JS",
    "ASP.Net": "ASP_NET",
    "React": "REACT",
    "Flutter": "FLUTTER",
    "Java": "JAVA",
    "C#": "C_SHARP",
    "JavaScript": "JAVA_SCRIPT",
    "Python": "PYTHON",
    "R": "R",
    "C++": "C_PLUS_PLUS",
    "Unity": "UNITY",
    "Go": "GO",
    "Ruby": "RUBY",
    "AI": "AI",
    "Block Chain": "BLOCK_CHAIN",
    "NoSql": "NOSQL",
    "Redis": "REDIS",
    "RDB": "RDB",
    "OS": "OS",
    "Algorithm": "ALGORITHM",
    "Data Structure": "DATA_STRUCTURE",
    "Network": "NETWORK",
    "Design Pattern": "DESIGN_PATTERN",
    "SW Engineering": "SW_ENGINEERING",
    "AWS": "AWS",
    "DevOps": "DEVOPS",
    "Kubernetes": "KUBERNETES",
    "Kafka": "KAFKA",
    "MSA": "MSA",
};

export const PositionToEnumMap: Record<string, string> = {
    "프론트엔드": "FRONTEND",
    "백엔드": "BACKEND",
    "풀스택": "FULLSTACK",
    "안드로이드": "ANDROID",
    "IOS": "IOS",
    "게임": "GAME",
    "AI": "AI",
    "데이터 엔지니어": "DATA_ENGINEER",
    "DevOps": "DEVOPS",
    "기타": "DEFAULT"
};

export const CareerToEnumMap: Record<string, string> = {
    "0년차": "0",
    "1년차": "1",
    "2년차": "2",
    "3년차": "3",
    "4년차": "4",
    "5년차": "5",
    "6년차": "6",
    "7년차": "7",
    "8년차": "8",
    "9년차": "9",
    "10년차": "10",
    "11년차": "11",
    "12년차": "12",
    "13년차": "13",
    "14년차": "14",
    "15년차 이상": "15",
};

export function CorrectCountToTitleMap(count: number): { title: string, color: string } {
    let color;
    let title;
    if (count < 10) {
        color = "text-gray-400";
        title = "[입문자]"
    } else if (count < 50) {
        color = "text-sky-400";
        title = "[탐구자]"
    } else if (count < 100) {
        color = "text-blue-700";
        title = "[실력자]"
    } else if (count < 200) {
        color = "text-purple-300";
        title = "[전문가]"
    } else if (count < 400) {
        color = "text-amber-400";
        title = "[지식인]"
    } else if (count < 600) {
        color = "text-gray-800";
        title = "[마스터]"
    } else if (count < 1000) {
        color = "text-red-700";
        title = "[전설]"
    } else {
        color = "text-violet-800";
        title = "[신화]"
    }

    return {
        color: color,
        title: title
    }
}


