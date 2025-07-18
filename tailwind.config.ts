import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#111827',    // 거의 검은색 (Gray 900)
        'secondary': '#374151', // 짙은 회색 (Gray 700)
        'accent': '#2563EB',     // 강조 파란색 (Blue 600)
        'muted': '#6B7280',      // 부드러운 회색 (Gray 500)
        'background': '#F9FAFB', // 매우 밝은 회색 (Gray 50)
        'surface': '#FFFFFF',    // 흰색
        'success': '#16A34A',    // 성공 초록색 (Green 600)
        'warning': '#FACC15',    // 경고 노란색 (Yellow 400)
        'danger': '#DC2626',     // 위험 빨간색 (Red 600)
      },
    },
  },
  plugins: [],
};
export default config;