import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      
      <h1 className="text-[120px] font-bold text-[#1C2561] leading-none">
        404
      </h1>

      <p className="text-lg text-black/70 mb-8">
        Страница не найдена
      </p>

      <Link
        to="/"
        className="px-8 py-4 bg-[#F61114] text-white rounded-full hover:scale-105 transition"
      >
        На главную
      </Link>

    </div>
  )
}