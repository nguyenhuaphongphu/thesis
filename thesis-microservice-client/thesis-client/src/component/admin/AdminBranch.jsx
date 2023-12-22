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
import Swal from "sweetalert2";

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

export default function AdminBranch() {
  const [data, setData] = useState([]);

  useEffect(() => {
    callApi(`branch`, "get", null).then((res) => {
      setData(res.data);
    });
  }, []);
  //Message response
  const [open, setOpen] = useState(false);
  const [messageResponse, setMessageResponse] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  //Change branch
  const [openChange, setOpenChange] = useState(false);
  const [findData, setFindData] = useState("");
  const handleOpenChange = (id) => {
    callApi(`branch/${id}`, "get", null).then((res) => {
      setFindData(res.data);
    });
    setOpenChange(true);
  };

  const handleCloseChange = () => setOpenChange(false);
  const [nameChange, setNameChange] = useState("");
  const [phoneChange, setPhoneChange] = useState("");
  const [emailChange, setEmailChange] = useState("");
  const [addressChange, setAddressChange] = useState("");
  const [urlNameChange, setUrlNameChange] = useState("");
  const [longitudeChange, setLongitudeChange] = useState("");
  const [latitudeChange, setLatitudeChange] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    if (
      nameChange == "" ||
      phoneChange == "" ||
      emailChange == "" ||
      addressChange == "" ||
      urlNameChange == ""
    ) {
      setMessageResponse("Vui lòng điền đầy đủ thông tin!");
      setOpen(true);
    } else if (validator.isEmail(emailChange) === false) {
      setMessageResponse("Email không hợp lệ !");
      setOpen(true);
    } else {
      const changeData = {
        name: nameChange,
        phone: phoneChange,
        email: emailChange,
        address: addressChange,
        longitude: longitudeChange,
        latitude: latitudeChange,
        urlName: urlNameChange
      };
      callApi(`branch/${findData.id}`, "put", changeData)
        .then((res) => {
          setOpenChange(false);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };
  //Add branch
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [nameAdd, setNameAdd] = useState("");
  const [phoneAdd, setPhoneAdd] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [addressAdd, setAddressAdd] = useState("");
  const [urlNameAdd, setUrlNameAdd] = useState("");
  const [longitudeAdd, setLongitudeAdd] = useState("");
  const [latitudeAdd, setLatitudeAdd] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (nameAdd == "" || phoneAdd == "" || emailAdd == "" || addressAdd == "" || urlNameAdd == "") {
      setMessageResponse("Vui lòng điền đầy đủ thông tin!");
      setOpen(true);
    } else if (validator.isEmail(emailAdd) === false) {
      setMessageResponse("Email không hợp lệ !");
      setOpen(true);
    } else {
      const dataAdd = {
        name: nameAdd,
        phone: phoneAdd,
        email: emailAdd,
        address: addressAdd,
        longitude: longitudeAdd,
        latitude: latitudeAdd,
        urlName: urlNameAdd
      };
      callApi("branch", "post", dataAdd)
        .then((res) => {
          setOpenAdd(false);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };
  //delete branch
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn muốn xóa?",
      text: "Xóa một thương hiệu đồng nghĩa với việc những sản phẩm trực thuộc cũng sẽ mất",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Trở về",
      confirmButtonText: "Đồng ý!",
    }).then((result) => {
      if (result.isConfirmed) {
        callApi(`bill/checkExistBranch/${id}`, "get", null).then((res) => {
          if (res.data.length > 0) {
            setMessageResponse(
              "Không thể xóa, còn quá đơn trong quá trình xửu lý!"
            );
            setOpen(true);
          } else {
            callApi(`branch/${id}`, "delete", null);
            window.location.reload();
          }
        });
      }
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
                <b>Tên chi nhánh</b>
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
                .map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell align="right">{branch.name}</TableCell>
                    <TableCell align="right">{branch.phone}</TableCell>
                    <TableCell align="right">{branch.email}</TableCell>
                    <TableCell align="right">{branch.address}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sửa chi nhánh">
                        <ModeOutlinedIcon
                          onClick={() => handleOpenChange(branch.id)}
                        />
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xóa chi nhánh">
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(branch.id)}
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
        <Box sx={style} className="rounded-3xl">
          <Title>Thêm chi nhánh mới</Title>
          <Form>
            <Input
              placeholder="Tên chi nhánh"
              onChange={(e) => setNameAdd(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Số điện thoại"
              onChange={(e) => setPhoneAdd(e.target.value)}
            />
            <Input
              placeholder="Email"
              onChange={(e) => setEmailAdd(e.target.value)}
            />
            <Input
              placeholder="Tên đại diện"

              onChange={(e) => setUrlNameAdd(e.target.value)}
            />
            <Input
              placeholder="Kinh độ"
              onChange={(e) => setLongitudeAdd(e.target.value)}
            />
            <Input
              placeholder="Vĩ độ"
              onChange={(e) => setLatitudeAdd(e.target.value)}
            />
            <Input
              placeholder="Địa chỉ"
              onChange={(e) => setAddressAdd(e.target.value)}
            />
          </Form>
          <div className="text-center">
            <ButtonCustom onClick={handleAdd}>Đồng ý</ButtonCustom>
          </div>
        </Box>
      </Modal>
      {/* form sửa loại sản phẩm */}
      <Modal open={openChange} onClose={handleCloseChange}>
        <Box sx={style} className="rounded-3xl">
          <Title>Thay đổi chi nhánh</Title>
          <Form>
            <Input
              placeholder={findData.name}
              onChange={(e) => setNameChange(e.target.value)}
            />
            <Input
              type="number"
              placeholder={findData.phone}
              onChange={(e) => setPhoneChange(e.target.value)}
            />
            <Input
              placeholder={findData.email}
              onChange={(e) => setEmailChange(e.target.value)}
            />
            <Input
              placeholder={findData.urlName}
              onChange={(e) => setUrlNameChange(e.target.value)}
            />
            <Input
              placeholder={findData.longitude}
              onChange={(e) => setLongitudeChange(e.target.value)}
            />
            <Input
              placeholder={findData.latitude}
              onChange={(e) => setLatitudeChange(e.target.value)}
            />
            <Input
              placeholder={findData.address}
              onChange={(e) => setAddressChange(e.target.value)}
            />
          </Form>
          <div className="text-center">
            <ButtonCustom onClick={handleChange}>Thay đổi</ButtonCustom>
          </div>
        </Box>
      </Modal>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {messageResponse}
        </Alert>
      </Snackbar>
    </>
  );
}
