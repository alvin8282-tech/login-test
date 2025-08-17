import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="mb-8">
            <div className="w-32 h-20 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-xl mx-auto flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xs px-2 tracking-wide">HYUNDAI AutoEver</span>
            </div>
            <h1 className="text-3xl font-bold text-[#003876] mb-2">원격IP차단장비</h1>
            <p className="text-3xl font-bold text-slate-600">Manager</p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-[#003876] to-[#0066CC] text-white py-3 px-6 rounded-lg font-medium hover:from-[#002952] hover:to-[#0052a3] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              로그인
            </Link>
            
            <Link
              href="/register"
              className="block w-full border-2 border-[#0066CC] text-[#0066CC] py-3 px-6 rounded-lg font-medium hover:bg-[#0066CC] hover:text-white transition-all duration-200"
            >
              회원가입
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            © 2024 HYUNDAI AutoEver. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
