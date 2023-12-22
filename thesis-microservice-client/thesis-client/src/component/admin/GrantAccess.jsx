import { useParams } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import callApi from "../../apicaller";
import styled from "styled-components";
import { Checkbox, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

export default function GrantAccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataBranch, setDataBranch] = useState([]);

  useEffect(() => {
    callApi(`branch`, "get", null).then((res) => {
      setDataBranch(res.data);
    });
  }, []);

  const [value, setValue] = useState("");

  function handleChangeBranch(checkedValues) {
    setValue(checkedValues.target.value);
  }

  const [valueRole, setValueRole] = useState("");

  function handleChangeRole(checkedValues) {
    setValueRole(checkedValues.target.value);
  }

  const [valuePrivilege, setValuePrivilege] = useState([]);

  const onChangePrivilege = (checkedValues) => {
    setValuePrivilege(checkedValues);
  };

  const onChange = () => {
    const newValue = [...valuePrivilege, valueRole]
    const changeData = {
      managementAt: value,
      roles: newValue,
    };
    callApi(`auth/${id}`, "patch", changeData).then((res) => {
      navigate("/user");
    });
  };

  return (
    <>
      <div class="grid grid-cols-3 divide-x">
        <div>
          {dataBranch &&
            dataBranch.map((branch, index) => {
              return (
                <>
                  <Checkbox
                    key={index}
                    onChange={handleChangeBranch}
                    value={branch.id}
                    checked={branch.id == value}
                    className="m-4"
                  >
                    {branch.name}
                  </Checkbox>
                  <br />
                </>
              );
            })}
        </div>
        {value ? (
          <div>
            <Checkbox
              onChange={handleChangeRole}
              value="admin"
              checked={"admin" == valueRole}
              className="m-4"
            >
              Admin
            </Checkbox>
            <br />
            <Checkbox
              onChange={handleChangeRole}
              value="manager"
              checked={"manager" == valueRole}
              className="m-4"
            >
              Quản trị viên
            </Checkbox>
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
        ) : (
          ""
        )}
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
