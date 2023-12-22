import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import callApi from "../../apicaller";
import { Link } from "react-router-dom";
import { message } from "antd";
import { Input, Button, Modal } from "antd";
import validator from "validator";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const { state } = useLocation();

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleChangePassword = (event) => {
    event.preventDefault();
    if (password === "" || repeatPassword === "") {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập đầy đủ thông tin!",
        icon: "warning",
      });
    } else if (password === repeatPassword) {
        callApi(`auth/reset-password/${state.data}/${password}`, "put", null)
        .then((res) => {
            Swal.fire({
                title: "Thành công!",
                text: "Thay đổi mật khẩu thành công!",
                icon: "success",
              });
              setPassword("")
              setRepeatPassword("")
        })
        .catch((error) => {
          message.warning(error);
        });
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Mật khẩu không trùng khớp!",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="bg-white fix">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-12 w-auto"
                src="http://localhost:8888/images/logoPP.png"
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Đổi lại mật khẩu
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nhập lại mật khẩu
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      type="password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleChangePassword}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Thay đổi
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Tôi nhớ lại rồi?{" "}
                <Link
                  to="/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
