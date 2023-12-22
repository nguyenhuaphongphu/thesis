import { useParams } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import callApi from "../../apicaller";
import { Checkbox, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ManagerGrantAccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || [];

  const [valueRole, setValueRole] = useState("");

  function handleChangeRole(checkedValues) {
    setValueRole(checkedValues.target.value);
  }

  const [valuePrivilege, setValuePrivilege] = useState([]);

  const onChangePrivilege = (checkedValues) => {
    setValuePrivilege(checkedValues);
  };

  const onChange = () => {
    const newV = [...valuePrivilege,valueRole]
    const changeData = {
      managementAt: user.managementAt,
      roles: newV,
    };
    callApi(`auth/manager/${id}`, "patch", changeData).then(res=>{
      Swal.fire({
        icon: "success",
        text: "Thành công!",
      });
      setValueRole("")
      setValuePrivilege("")
    })
  };

  return (
    <>
      <div class="grid grid-cols-3 divide-x">
          <div>
            <br />
            <Checkbox
              onChange={handleChangeRole}
              value="updater"
              checked={"updater" == valueRole}
              className="m-4"
            >
              Thay đổi thông tin
            </Checkbox>
            <br />
            <Checkbox
              onChange={handleChangeRole}
              value="seller"
              checked={"seller" == valueRole}
              className="m-4"
            >
              Người bán
            </Checkbox>
          </div>

        {valueRole ? (
          <div>
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              onChange={onChangePrivilege}
            >
              <Row>
                <Col span={24} className="m-4">
                  <Checkbox value="create">Tạo thông tin</Checkbox>
                </Col>
                <Col span={24} className="m-4">
                  <Checkbox value="read">Đọc thông tin</Checkbox>
                </Col>
                <Col span={24} className="m-4">
                  <Checkbox value="update">Thay đổi thông tin</Checkbox>
                </Col>
                <Col span={24} className="m-4">
                  <Checkbox value="delete">Xóa thông tin</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            <div className="text-center m-2">
              <button
                onClick={onChange}
                className="px-5 py-2.5 relative rounded group font-medium text-white font-medium inline-block"
              >
                <span className="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-gradient-to-br from-purple-600 to-blue-500"></span>
                <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-gradient-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-gradient-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
                <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-gradient-to-br to-purple-600 from-blue-500"></span>
                <span className="relative">Cấp quyền</span>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
