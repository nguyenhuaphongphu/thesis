import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import validator from "validator";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  text-align: center;
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;
const Input = styled.input`
  flex: 1;
  margin: 20px 10px 20px 0px;
  padding: 10px;
`;
const ButtonCustom = styled.button`
  width: 20%;
  border: none;
  background-color: teal;
  color: white;
  cursor: pointer;
  padding: 10px;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

export default function AdminSupplier() {
  const user = JSON.parse(localStorage.getItem("user")) || "";

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    callApi(`supplier`, "get", null).then((res) => {
      setData(res.data);
    });
  }, [data]);
  //message response
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  //find user info show update
  const [openChange, setOpenChange] = useState(false);
  const [findData, setFindData] = useState("");
  const handleOpenChange = (id) => {
    callApi(`supplier/${id}`, "get", null).then((res) => {
      setFindData(res.data);
    });
    setOpenChange(true);
  };

  //update part
  const handleCloseChange = () => setOpenChange(false);
  const [nameSupplierChange, setNameSupplierChange] = useState("");
  const [sdtSupplierChange, setSDTSupplierChange] = useState("");
  const [emailSupplierChange, setEmailSupplierChange] = useState("");
  const [addressSupplierChange, setAddressSupplierChange] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    if (
      nameSupplierChange == "" ||
      sdtSupplierChange == "" ||
      emailSupplierChange == "" ||
      addressSupplierChange == ""
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin !");
      setOpen(true);
    } else if (validator.isEmail(emailSupplierChange) === false) {
      setMessage("Email không hợp lệ !");
      setOpen(true);
    } else {
      const changeData = {
        name: nameSupplierChange,
        phone: sdtSupplierChange,
        email: emailSupplierChange,
        address: addressSupplierChange,
      };
      callApi(`supplier/${findData.id}`, "put", changeData)
        .then((res) => {
          setOpenChange(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };
  //add new supplier
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [nameSupplierAdd, setNameSupplierAdd] = useState("");
  const [sdtSupplierAdd, setSDTSupplierAdd] = useState("");
  const [emailSupplierAdd, setEmailSupplierAdd] = useState("");
  const [addressSupplierAdd, setAddressSupplierAdd] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (
      nameSupplierAdd == "" ||
      sdtSupplierAdd == "" ||
      emailSupplierAdd == "" ||
      addressSupplierAdd == ""
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin !");
      setOpen(true);
    } else if (validator.isEmail(emailSupplierAdd) === false) {
      setMessage("Email không hợp lệ !");
      setOpen(true);
    } else {
      const dataAdd = {
        name: nameSupplierAdd,
        phone: sdtSupplierAdd,
        email: emailSupplierAdd,
        address: addressSupplierAdd,
      };
      callApi("supplier", "post", dataAdd)
        .then((res) => {
          setOpenAdd(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };
  //delete one
  const handleDelete = (id) => {
    callApi(`supplier/${user.managementAt}/${id}`, "delete", null).then((res) => {
      setMessage(res.data.message);
      setOpen(true);
    });
  };

  return (
    <>
      <Button sx={{ mb: 2 }} variant="contained" onClick={handleOpenAdd}>
        <AddCircleOutlineIcon />
        &nbsp;Thêm mới
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">
                <b>Tên nhà cung cấp</b>
              </TableCell>
              <TableCell align="right">
                <b>Số điện thoại</b>
              </TableCell>
              <TableCell align="right">
                <b>Email</b>
              </TableCell>
              <TableCell align="right">
                <b>Địa chỉ</b>
              </TableCell>
              <TableCell align="right">
                <b>Hành động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data
                .slice(0)
                .reverse()
                .map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell align="right">{supplier.name}</TableCell>
                    <TableCell align="right">{supplier.phone}</TableCell>
                    <TableCell align="right">{supplier.email}</TableCell>
                    <TableCell align="right">{supplier.address}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sửa nhà cung cấp">
                        <ModeOutlinedIcon
                          onClick={() => handleOpenChange(supplier.id)}
                        />
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xóa nhà cung cấp">
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(supplier.id)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* form thêm loại sản phẩm */}
      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box sx={style}>
          <Title>Thêm nhà cung cấp</Title>
          <Form>
            <Input
              placeholder="Tên nhà cung cấp"
              onChange={(e) => setNameSupplierAdd(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Số điện thoại"
              onChange={(e) => setSDTSupplierAdd(e.target.value)}
            />
            <Input
              placeholder="Địa chỉ"
              onChange={(e) => setAddressSupplierAdd(e.target.value)}
            />
            <Input
              placeholder="Email"
              onChange={(e) => setEmailSupplierAdd(e.target.value)}
            />
          </Form>
          <div className="text-center">
            <ButtonCustom onClick={handleAdd}>Đồng ý</ButtonCustom>
          </div>
        </Box>
      </Modal>
      {/* form sửa loại sản phẩm */}
      <Modal open={openChange} onClose={handleCloseChange}>
        <Box sx={style}>
          <Title>Thay đổi nhà cung cấp</Title>
          <Form>
            <Input
              placeholder={findData.name}
              onChange={(e) => setNameSupplierChange(e.target.value)}
            />
            <Input
              type="number"
              placeholder={findData.phone}
              onChange={(e) => setSDTSupplierChange(e.target.value)}
            />
            <Input
              placeholder={findData.address}
              onChange={(e) => setAddressSupplierChange(e.target.value)}
            />
            <Input
              placeholder={findData.email}
              onChange={(e) => setEmailSupplierChange(e.target.value)}
            />
          </Form>
          <div className="text-center">
            <ButtonCustom onClick={handleChange}>Thay đổi</ButtonCustom>
          </div>
        </Box>
      </Modal>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
