import { DatePicker} from 'antd';
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useEffect, useState} from "react";
import callApi from '../../apicaller';

export default function AdminStatistical() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    callApi(`bill/lineChart/${year}`, "get", null).then((res) => {
      setFilter(res.data);
    });
  }, [year]);

  const onChange = (date, dateString) => {
    setYear(dateString);
  };
  
  return (
    <>
    <DatePicker onChange={onChange} picker="year" />
      <Line
        height="120px"
        data={{
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          datasets: filter,
        }}
        options={{
          title: {
            display: true,
            text: "World population per region (in millions)",
          },
          legend: {
            display: true,
            position: "bottom",
          },
        }}
      />
    </>
  );
}
