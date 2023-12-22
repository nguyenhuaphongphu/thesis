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
  margin: 20px 0px;
  width: 30%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 200,
  bgcolor: "background.paper",
  p: 4,
};

export default function AdminTag() {
  const user = JSON.parse(localStorage.getItem("user")) || "";

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    callApi(`tag`, "get", null).then((res) => {
      setData(res.data);
    });
  }, [data]);

  //Message response
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [openChange, setOpenChange] = useState(false);
  const [findData, setFindData] = useState("");
  const handleOpenChange = (id) => {
    callApi(`tag/${id}`, "get", null).then((res) => {
      setFindData(res.data);
    });
    setOpenChange(true);
  };

  const handleCloseChange = () => setOpenChange(false);
  const [nameTagChange, setNameTagChange] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    if (nameTagChange == "") {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      setOpen(true);
    } else {
      const data = {
        name: nameTagChange,
      };
      callApi(`tag/${findData.id}`, "put", data)
        .then((res) => {
          setOpenChange(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [nameTag, setNameTag] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (nameTag == "") {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      setOpen(true);
    } else {
      const data = {
        name: nameTag,
      };
      callApi("tag", "post", data)
        .then((res) => {
          setOpenAdd(false);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const handleDelete = (id) => {
    callApi(`tag/${user.managementAt}/${id}`, "delete", null).then((res) => {
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
              <TableCell>
                <b>Mã tag</b>
              </TableCell>
              <TableCell align="right">
                <b>Tên tag</b>
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
                .map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell align="right">{tag.name}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Sửa tag">
                        <ModeOutlinedIcon
                          onClick={() => handleOpenChange(tag.id)}
                        />
                      </Tooltip>
                      &nbsp;&nbsp;
                      <Tooltip title="Xóa tag">
                        <DeleteOutlineOutlinedIcon
                          onClick={() => handleDelete(tag.id)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box sx={style}>
          <Title>Thêm tag</Title>
          <Form>
            <Input
              placeholder="Tên tag"
              onChange={(e) => setNameTag(e.target.value)}
            />
            <ButtonCustom onClick={handleAdd}>Đồng ý</ButtonCustom>
          </Form>
        </Box>
      </Modal>

      <Modal open={openChange} onClose={handleCloseChange}>
        <Box sx={style}>
          <Title>Thay đổi tag</Title>
          <Form>
            <Input
              placeholder={findData.name}
              onChange={(e) => setNameTagChange(e.target.value)}
            />
            <ButtonCustom onClick={handleChange}>Đồng ý</ButtonCustom>
          </Form>
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
