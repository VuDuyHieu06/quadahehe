export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-gray-500">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <div className="mb-2 text-base font-bold text-gray-900">Radiant Hope Hotel</div>
            <p>Hệ thống đặt phòng trực tuyến — đồ án môn Lập trình Web nâng cao.</p>
          </div>
          <div>
            <div className="mb-2 font-semibold text-gray-700">Hỗ trợ</div>
            <ul className="space-y-1">
              <li>Liên hệ</li>
              <li>Điều khoản</li>
              <li>Chính sách riêng tư</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Stayhub — Radiant Hope Hotel. Đồ án Lập trình Web nâng cao.
        </div>
      </div>
    </footer>
  );
}
