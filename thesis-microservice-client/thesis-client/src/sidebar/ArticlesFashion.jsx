import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

export default function ArticlesFashion() {
    return (
      <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-indigo-600">Thời trang</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Cách diễn đạt bản thân !</h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                Thời trang là một khái niệm đã trở thành một phần không thể thiếu trong cuộc sống hiện đại. Nó không chỉ đơn thuần là những bộ quần áo, phụ kiện hay cách ăn mặc mà còn là một lĩnh vực nghệ thuật, thể hiện cá tính và phong cách của mỗi người. Vai trò của thời trang trong cuộc sống hiện đại không chỉ giới hạn ở việc bảo vệ cơ thể khỏi các tác động bên ngoài mà còn có tầm ảnh hưởng sâu sắc đến nhiều khía cạnh của đời sống con người, từ kinh tế, xã hội đến tâm lý và tinh thần.
                </p>
              </div>
            </div>
          </div>
          <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              className=" max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              src="http://localhost:8888/images/fashion-articles.jpg"
              alt=""
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-gray-900">Lịch sử và phát triển của thời trang.</strong> Lịch sử và phát triển của thời trang đã trải qua một cuộc hành trình dài và đa dạng từ những ngày đầu của loài người. Từ việc sử dụng lá cây, vỏ động vật hay vải lanh để che đậy cơ thể cho đến sự tiến hóa của ngành công nghiệp thời trang hiện đại, thời trang đã trở thành một phần không thể thiếu của cuộc sống con người.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-gray-900">Vai trò của thời trang.</strong> Thời trang không chỉ là một phong cách mặc quần áo, mà còn là một phần không thể thiếu trong cuộc sống hiện đại của con người. Vai trò của thời trang trong cuộc sống hiện đại đến nay đã trở thành một yếu tố quan trọng, ảnh hưởng đến cách mà mọi người tự thể hiện bản thân, tương tác với nhau và thể hiện cái tôi của họ.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    <span>
                      <strong className="font-semibold text-gray-900">Ý nghĩa của thời trang.</strong> Thời trang có thể giúp con người tự tin và nổi bật trong mắt mọi người. Một bộ trang phục phù hợp không chỉ giúp tôn lên vẻ đẹp tự nhiên của cơ thể, mà còn giúp nâng cao tự tin, tạo dựng ấn tượng đầu tiên tốt đẹp và thể hiện cá tính riêng của mỗi người.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }