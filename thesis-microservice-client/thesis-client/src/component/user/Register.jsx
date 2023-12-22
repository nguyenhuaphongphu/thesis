import callApi from "../../apicaller";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { message} from "antd";
import validator from "validator";


const Register = () => {
  const navigate = useNavigate();
  const [nameCustomerAdd, setNameCustomerAdd] = useState("");
  const [sdtCustomerAdd, setSDTCustomerAdd] = useState("");
  const [emailCustomerAdd, setEmailCustomerAdd] = useState("");
  const [addressCustomerAdd, setAddressCustomerAdd] = useState("");
  const [accountCustomerAdd, setAccountCustomerAdd] = useState("");
  const [passwordCustomerAdd, setPasswordCustomerAdd] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (
      nameCustomerAdd === "" ||
      sdtCustomerAdd === "" ||
      emailCustomerAdd === "" ||
      addressCustomerAdd === "" ||
      accountCustomerAdd === "" ||
      passwordCustomerAdd === ""
    ) {
      message.warning("Vui lòng nhập đầy đủ thông tin !");
    } else if (validator.isEmail(emailCustomerAdd) === false) {
      message.warning("Email không hợp lệ !");
    } else {
      const dataAdd = {
        fullName: nameCustomerAdd,
        phone: sdtCustomerAdd,
        email: emailCustomerAdd,
        address: addressCustomerAdd,
        username: accountCustomerAdd,
        password: passwordCustomerAdd,
      };
      callApi("auth/signup", "post", dataAdd).then((res) => {
        message.success("Đăng ký thành công!")
        navigate("/login")
      });
    }
  };
  return (
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
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 -mt-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="http://localhost:8888/images/logoPP.png"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Đăng ký thành viên
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div className="mb-6 flex gap-4">
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Họ và tên
                  </label>
                  <div className="mt-1">
                    <input
                    onChange={e => setNameCustomerAdd(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Số điện thoại
                  </label>
                  <div className="mt-1">
                    <input
                    type="number"
                    onChange={e => setSDTCustomerAdd(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Địa chỉ
                  </label>
                  <div className="mt-1">
                    <input
                    onChange={e => setAddressCustomerAdd(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                    onChange={e => setEmailCustomerAdd(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              <div className="mb-6 flex gap-4">
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Tài khoản
                  </label>
                  <div className="mt-1">
                    <input
                    onChange={e => setAccountCustomerAdd(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mật khẩu
                  </label>
                  <div className="mt-1">
                    <input
                    onChange={e => setPasswordCustomerAdd(e.target.value)}
                    type='password'
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button onClick={handleAdd} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Đăng ký ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    // <Container>
    //   <Wrapper>
    //     <Title>TẠO TÀI KHOẢN</Title>
    //     <Form>
    //       <Input placeholder="Tên khách hàng"
    //         onChange={e => setNameCustomerAdd(e.target.value)} />
    //       <Input placeholder="Số điện thoại"
    //         onChange={e => setSDTCustomerAdd(e.target.value)} />
    //       <Input placeholder="Địa chỉ"
    //         onChange={e => setAddressCustomerAdd(e.target.value)} />
    //       <Input placeholder="Email"
    //         onChange={e => setEmailCustomerAdd(e.target.value)} />
    //       <Input placeholder="Tài khoản"
    //         onChange={e => setAccountCustomerAdd(e.target.value)} />
    //       <Input
    //         type='password'
    //         placeholder="Mật khẩu"
    //         onChange={e => setPasswordCustomerAdd(e.target.value)} />
    //       <Button
    //         style={{
    //           width: 100,
    //           border: 'none',
    //           backgroundColor: 'teal',
    //           color: 'white',
    //           cursor: 'pointer',
    //           marginTop: 20,
    //           height: 40
    //         }}
    //         onClick={handleAdd}>ĐỒNG Ý
    //       </Button>
    //     </Form>
    //   </Wrapper>
    // </Container>
  );
};

export default Register;
