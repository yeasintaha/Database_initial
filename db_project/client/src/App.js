import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [postal, setPostal] = useState("");
  const [allDataOrder, setAllDataOrder] = useState([]);
  const [allDataCustomer, setAllDataCustomer] = useState([]);

  const [del, setDel] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/order_info").then((response) => {
      setAllDataOrder(response.data);
      console.log(response.data);
    });
    Axios.get("http://localhost:3001/api/get/customer").then((response) => {
      setAllDataCustomer([response.data]);
      console.log([response.data]);
    });
  }, []);

  const insertQuery = () => {
    Axios.post("http://localhost:3001/api/insert", {
      id: id,
      name: name,
      mail: mail,
      gender: gender,
      phone: phone,
      house: house,
      street: street,
      postal: postal,
    }).then(() => {
      alert("Insert successful");
    });
    console.log("Is it really working though ");
    console.log(id);
    console.log(name);
    console.log(mail);
  };

  const deleteQuery = () => {
    Axios.post("http://localhost:3001/api/delete", {
      del: del,
    }).then(() => {
      alert("Deletion successful ");
    });
  };

  return (
    <div className="App">
      <h3>Shafin babaji khela dekhao... Quick time nai </h3>
      <input
        type="text"
        placeholder="Enter id"
        onChange={(e) => setId(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter mail"
        onChange={(e) => setMail(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter gender"
        onChange={(e) => setGender(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter phone_No"
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter house no"
        onChange={(e) => setHouse(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter street no"
        onChange={(e) => setStreet(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter postal code"
        onChange={(e) => setPostal(e.target.value)}
      />
      <br />
      <input type="button" value="submit" onClick={insertQuery} />
      <br />
      <br />
      <input type="text" onChange={(e) => setDel(e.target.value)} />
      <input type="button" value="Delete Please" onClick={deleteQuery} />

      {allDataOrder.map((val) => {
        return (
          <p>
            ID : {val.ORDER_ID} | Qty : {val.ORDER_QUANTITY} | Order_Total_Cost:{" "}
            {val.ORDER_TOTAL_COST}
          </p>
        );
      })}
      <br />
      <br />
      {allDataCustomer.map((row) => {
        return row.map((cell) => {
          return (
            <p>
              Name : {cell.CUST_NAME} | ID : {cell.CUST_ID} | Address :{" "}
              {cell.CUST_ADDRESS.STREET_NO} , {cell.CUST_ADDRESS.HOUSE_NO} ,{" "}
              {cell.CUST_ADDRESS.POSTAL_CODE}
            </p>
          );
        });
      })}
    </div>
  );
}

export default App;
