import Link from "next/link";

type Course = {
  title: string;
  url: string;
};

export default function CoursePage() {
  const episode = process.env.COURSE_EPISODE || "";

  // 支持两个课程：COURSE_TITLE_1/COURSE_VIDEO_URL_1 和 COURSE_TITLE_2/COURSE_VIDEO_URL_2
  // 兼容旧的单课程配置：COURSE_TITLE/COURSE_VIDEO_URL
  const courses: Course[] = [
    {
      title:
        process.env.COURSE_TITLE_1 || process.env.COURSE_TITLE || "课程一",
      url:
        process.env.COURSE_VIDEO_URL_1 || process.env.COURSE_VIDEO_URL || "#",
    },
    {
      title: process.env.COURSE_TITLE_2 || "",
      url: process.env.COURSE_VIDEO_URL_2 || "",
    },
  ].filter((c) => c.url && c.url !== "#" && c.title);

  // 如果第一项也没有就兜底显示一个占位
  const displayCourses =
    courses.length > 0
      ? courses
      : [
          {
            title:
              process.env.COURSE_TITLE_1 ||
              process.env.COURSE_TITLE ||
              "课程回放",
            url:
              process.env.COURSE_VIDEO_URL_1 ||
              process.env.COURSE_VIDEO_URL ||
              "#",
          },
        ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">家长课堂</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
            最新课程回放
          </span>
          {episode && (
            <h1 className="text-3xl font-bold text-gray-900">{episode}</h1>
          )}
          <p className="text-gray-500 mt-2">本期共 {displayCourses.length} 节课程</p>
        </div>

        {/* Course Cards Grid */}
        <div
          className={`grid gap-6 max-w-4xl mx-auto ${
            displayCourses.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1 max-w-2xl"
          }`}
        >
          {displayCourses.map((course, index) => (
            <CourseCard key={index} index={index} course={course} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-xs">
        <p>本课程内容仅供已购课家长观看，请勿外传</p>
      </footer>
    </div>
  );
}

function CourseCard({ index, course }: { index: number; course: Course }) {
  // 两张卡片用不同色调以区分
  const gradient =
    index === 0
      ? "from-blue-600 to-indigo-700"
      : "from-indigo-600 to-purple-700";
  const buttonColor =
    index === 0
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-indigo-600 hover:bg-indigo-700";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <div className={`bg-gradient-to-br ${gradient} px-6 py-10 text-center`}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
          <svg
            className="w-8 h-8 text-white ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-white/80 text-xs uppercase tracking-wider mb-2">
          第 {index + 1} 节
        </p>
        <h2 className="text-xl font-semibold text-white px-2">
          {course.title}
        </h2>
      </div>

      <div className="p-6 text-center flex-1 flex flex-col justify-center">
        <Link
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 ${buttonColor} text-white font-medium rounded-xl transition-colors`}
        >
          进入课堂观看回放
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>
        <p className="text-gray-400 text-xs mt-3">
          视频将在腾讯会议中打开播放
        </p>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/logout" method="POST">
      <button
        type="submit"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        退出登录
      </button>
    </form>
  );
}
