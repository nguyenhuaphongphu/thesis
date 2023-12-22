import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import callApi from "../../apicaller";
import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import _ from "lodash";

const { RangePicker } = DatePicker;

const Filter = styled.div``;
const FilterContainer = styled.div`
  justify-content: flex-start;
  margin: 20px 0px 20px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ManagerEmail() {
  const [page, setPage] = useState(0);
  const handleChangePage = (event, value) => {
    setPage(value - 1);
  };

  const [data, setData] = useState([]);
  const [dataBranch, setDataBranch] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || "";

  useEffect(() => {
    callApi(`emailByBranch/branch/${user?.managementAt}`, "get", null).then(
      (res) => {
        setData(res.data);
      }
    );
    callApi(`branch/${user?.managementAt}`, "get", null).then((res) => {
      setDataBranch(res.data);
    });
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [getDate, setGetDate] = useState(0);
  const [getMonth, setGetMonth] = useState(0);
  const [getYear, setGetYear] = useState(0);
  const [valueDate, setValueDate] = useState(false);
  const onChange = (data, dateString) => {
    setGetDate(new Date(dateString).getDate());
    setGetMonth(new Date(dateString).getMonth() + 1);
    setGetYear(new Date(dateString).getFullYear());
    setValueDate(!valueDate);
  };

  const [getDateFrom, setGetDateFrom] = useState(0);
  const [getDateTo, setGetDateTo] = useState(0);
  const [valueForm, setValueForm] = useState(false);
  const onChangeForm = (data, dateString) => {
    setGetDateFrom(new Date(dateString[0]));
    setGetDateTo(new Date(dateString[1]));
    setValueForm(!valueForm);
  };

  const filterArrEmail = () => {
    if (valueDate) {
      return (
        data &&
        data.filter(
          (element) =>
            new Date(element.time).getDate() === getDate &&
            new Date(element.time).getMonth() + 1 === getMonth &&
            new Date(element.time).getFullYear() === getYear
        )
      );
    } else if (valueForm) {
      return (
        data &&
        data.filter(
          (element) =>
            getDateFrom < new Date(element.time) &&
            new Date(element.time) < getDateTo
        )
      );
    } else if (valueDate) {
      return (
        data &&
        data.filter(
          (element) =>
            new Date(element.time).getDate() === getDate &&
            new Date(element.time).getMonth() + 1 === getMonth &&
            new Date(element.time).getFullYear() === getYear
        )
      );
    } else {
      return data;
    }
  };

  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTittle] = useState("");
  const handleGetFile = (event) => {
    setFile(event.target.files[0].name);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const data = {
      subject: title,
      message: message,
      branch: dataBranch.name,
      website: "P&PSHOP.com",
      attachment: "C:/Users/phongphu/Downloads/" + file,
    };
    callApi(`email/sendMailBranch/${user?.managementAt}`, "post", data).then(
      (res) => {
        window.location.reload()
      }
    );
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Email đến" {...a11yProps(0)} />
            <Tab label="Gửi Email" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <FilterContainer>
            <Filter>
              <DatePicker
                presets={[
                  {
                    label: "Yesterday",
                    value: dayjs().add(-1, "d"),
                  },
                  {
                    label: "Last Week",
                    value: dayjs().add(-7, "d"),
                  },
                  {
                    label: "Last Month",
                    value: dayjs().add(-1, "month"),
                  },
                ]}
                onChange={onChange}
                style={{ marginRight: 20 }}
              />
              <RangePicker onChange={onChangeForm} />
            </Filter>
          </FilterContainer>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Ngày đặt</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>Email</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.chunk(filterArrEmail().slice(0).reverse(), 8)[page] &&
                  _.chunk(filterArrEmail().slice(0).reverse(), 8)[page].map(
                    (element) => {
                      return (
                        <TableRow key={element.id}>
                          <TableCell>
                            {moment.utc(element.time).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {element.emailCustomer}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="grid grid-flow-col justify-stretch">
            <div className="flex justify-center mt-8 lg:justify-end">
              <Pagination
                onChange={handleChangePage}
                count={_.chunk(filterArrEmail(), 8).length}
                color="primary"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <form onSubmit={handleSendEmail}>
            <div className="grid gap-6 md:grid-cols-2 mx-8 mt-8">
              <div>
                <label
                  for="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tiêu đề
                </label>
                <input
                  onChange={(e) => setTittle(e.target.value)}
                  type="text"
                  id="first_name"
                  className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
                <input
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  onChange={(e) => handleGetFile(e)}
                />
              </div>
              <div>
                <label
                  for="message"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Lời nhắn
                </label>
                <textarea
                  onChange={(e) => setMessage(e.target.value)}
                  id="message"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Viết mới nhắn gửi đến khách hàng..."
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="ml-8 mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Gửi
            </button>
          </form>
        </TabPanel>
      </Box>
    </>
  );
}
