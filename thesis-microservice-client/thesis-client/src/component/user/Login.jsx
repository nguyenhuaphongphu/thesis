import { useState } from "react";
import { useNavigate } from "react-router-dom";
import callApi from "../../apicaller";
import { Link } from "react-router-dom";
import { message } from "antd";
import { Input, Button, Modal } from "antd";
import validator from "validator";
import Swal from "sweetalert2";

export default function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataAdd = {
      username: account,
      password: password,
    };
    callApi("auth/signin", "post", dataAdd)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.roles?.includes("ROLE_USER")) {
          navigate("/");
          message.success(` Chào khách hàng đến với P&P shop `);
        } else if (user.roles?.includes("ROLE_SELLER")) {
          navigate("/bill");
          message.success(`Chào quản trị viên  của P&P shop `);
        } else if (user.roles?.includes("ROLE_ADMIN")) {
          navigate("/user");
          message.success(`Chào quản trị viên  của P&P shop `);
        } else if (user.roles?.includes("ROLE_MANAGER")) {
          navigate("/statisticalManager");
          message.success(`Chào quản trị viên  của P&P shop `);
        } else {
          navigate("/product");
          message.success(`Chào quản trị viên  của P&P shop `);
        }
      })
      .catch((error) => {
        message.warning("Tài khoản hoặc mật khẩu không đúng !");
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [emailUser, setEmailUser] = useState("");

  const handleForGotPassword = () => {
    if (!validator.isEmail(emailUser)) {
      Swal.fire({
        title: "Lỗi!",
        text: "Email không hợp lệ!",
        icon: "error",
      });
    } else
      callApi(`auth/forgot-password/${emailUser}`, "post", null).then((res) => {
        const data = res.data
        navigate(
          '/resetPassword',
          { state: { data } })
      });
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
                Đăng nhập tài khoản
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tài khoản
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setAccount(e.target.value)}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
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
                      Mật khẩu
                    </label>
                    <div className="text-sm">
                      <a
                        onClick={showModal}
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleSubmit}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Bạn không phải thành viên?{" "}
                <Link
                  to="/register"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Quên mật khẩu ?"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="send email" onClick={handleForGotPassword}>
            Gửi đi
          </Button>,
        ]}
      >
        <Input
        className="my-6"
          placeholder="Nhập email"
          onChange={(e) => setEmailUser(e.target.value)}
        />
      </Modal>
    </>
  );
}
