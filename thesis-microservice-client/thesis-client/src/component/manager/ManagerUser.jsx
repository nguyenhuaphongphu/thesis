import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd";
import Tooltip from "@mui/material/Tooltip";
import _ from "lodash";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

export default function ManagerUser() {

  const user = JSON.parse(localStorage.getItem("user")) || [];

  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    callApi(`auth/userManager/${user.managementAt}`, "get", null).then((res) => {
      setData(res.data);
    });
  }, []);

  const handleDelete = (id) => {
    callApi(`auth/${id}`, "delete", null);
    window.location.reload();
  };

  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const handleChange = (event) => {
    setRole(event.target.value);
  };


  const filterArrUser = () => {
    if (search) {
      return (
        data &&
        data.filter((data) =>
          data.fullName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    }else if (role) {
      return (
        data &&
        data.filter((data) => 
          data.roles.some((el) => el.name === role)
        )
      );
    }else{
      return data;
    }
  };

  return (
    <>
      <div className="flex justify-start mb-4">
        <Box sx={{ minWidth: 160}} className="mr-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Quyền</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Quyền"
              defaultValue=""
              onChange={handleChange}
            >
              <MenuItem value="ROLE_UPDATER">Cập nhật viên</MenuItem>
              <MenuItem value="ROLE_SELLER">Người bán hàng</MenuItem>
              <MenuItem value="ROLE_USER">Người dùng</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": {width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField onChange={(e)=>setSearch(e.target.value)} id="outlined-basic" label="Tìm kiếm" multiline variant="outlined" />
        </Box>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">
                <b>Tên khách hàng</b>
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
                <b>Quyền hạn</b>
              </TableCell>
              <TableCell align="right">
                <b>Hành động</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.chunk(filterArrUser(), 8)[page] &&
              _.chunk(filterArrUser(), 8)[page].map((user) => (
                <TableRow key={user.id}>
                  <TableCell align="right">{user.fullName}</TableCell>
                  <TableCell align="right">{user.phone}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.address}</TableCell>
                  <TableCell align="right">
                    {user.roles
                      .filter((role) => {
                        return (
                          role.name !== "ROLE_READ" &&
                          role.name !== "ROLE_CREATE" &&
                          role.name !== "ROLE_UPDATE" &&
                          role.name !== "ROLE_DELETE"
                        );
                      })
                      .map((role, index) => {
                        return (
                          <>
                            <Tag key={index} color="processing">
                              {role.name}
                            </Tag>
                            <br />
                          </>
                        );
                      })}
                  </TableCell>
                  <TableCell align="right">
                    <Link
                      to={`/grantaccessManager/${user.id}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <Tooltip title="Phân quyền cho người dùng">
                        <AccessibilityNewIcon />
                      </Tooltip>
                    </Link>
                    &nbsp;&nbsp;
                    <Tooltip title="Xóa người dùng">
                      <DeleteOutlineOutlinedIcon
                        onClick={() => handleDelete(user.id)}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-8 lg:justify-end">
        <Pagination
          onChange={handleChangePage}
          count={_.chunk(filterArrUser(), 8).length}
          color="primary"
        />
      </div>
    </>
  );
}
