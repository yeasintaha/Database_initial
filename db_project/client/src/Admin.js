import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
function Admin() {
  const [allDataCustomer, setAllDataCustomer] = useState([
    {
      id: "",
      name: "",
      mail: "",
      gender: "",
      phone: "",
      house: "",
      street: "",
      postal: "",
    },
  ]);

  // const [id, setId] = useState("");
  // const [name, setName] = useState("");
  // const [mail, setMail] = useState("");
  // const [gender, setGender] = useState("");
  // const [phone, setPhone] = useState("");
  // const [house, setHouse] = useState("");
  // const [street, setStreet] = useState("");
  // const [postal, setPostal] = useState("");

  const [allDataOrder, setAllDataOrder] = useState([]);
  const [custUpdate, setCustUpdate] = useState({
    previousName: "",
    updatedName: "",
  });

  const [del, setDel] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/order_info").then((response) => {
      setAllDataOrder(response.data);
    });
    Axios.get("http://localhost:3001/api/get/customer").then((response) => {
      setAllDataCustomer(response.data);
    });
  }, []);

  let id,
    name,
    mail,
    gender,
    phone,
    house,
    street,
    postal,
    previous_name,
    updated_name;

  const setValue = (val, type) => {
    if (type === "id") {
      id = val;
    }
    if (type === "name") {
      name = val;
    }
    if (type === "mail") {
      mail = val;
    }
    if (type === "gender") {
      gender = val;
    }
    if (type === "phone") {
      phone = val;
    }
    if (type === "house") {
      house = val;
    }
    if (type === "street") {
      street = val;
    }
    if (type === "postal") {
      postal = val;
    }
    if (type === "update_previous_name") {
      previous_name = val;
    }
    if (type === "update_updated_name") {
      updated_name = val;
    }
  };

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
    });

    setAllDataCustomer([
      ...allDataCustomer,
      {
        id: id,
        name: name,
        mail: mail,
        gender: gender,
        phone: phone,
        house: house,
        street: street,
        postal: postal,
      },
    ]);
    window.location.reload();
  };

  const deleteQuery = (cust_name) => {
    Axios.delete(`http://localhost:3001/api/delete/${cust_name}`);
    window.location.reload();
  };

  const updateQuery = (previous_name, updated_name) => {
    Axios.put("http://localhost:3001/api/update", {
      cust_name: previous_name,
      updated_cust_name: updated_name,
    });
    console.log("Update query ", updated_name);
    console.log("Update query ", previous_name);

    setCustUpdate("");
    window.location.reload();
  };
  return (
    <div className="App">
      <h3>Okay Insert</h3>
      <input
        type="text"
        placeholder="Enter Id"
        onChange={(e) => setValue(e.target.value, "id")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter name"
        onChange={(e) => setValue(e.target.value, "name")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter mail"
        onChange={(e) => setValue(e.target.value, "mail")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter gender"
        onChange={(e) => setValue(e.target.value, "gender")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter phone_No"
        onChange={(e) => setValue(e.target.value, "phone")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter house no"
        onChange={(e) => setValue(e.target.value, "house")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter street no"
        onChange={(e) => setValue(e.target.value, "street")}
      />
      <br />
      <input
        type="text"
        placeholder="Enter postal code"
        onChange={(e) => setValue(e.target.value, "postal")}
      />
      <br />
      <input type="button" value="submit" onClick={insertQuery} />
      <br />
      <br />
      <input type="text" onChange={(e) => setDel(e.target.value)} />
      <input
        type="button"
        value="Delete Please"
        onClick={() => {
          deleteQuery(del);
        }}
      />
      <br />
      <br />
      <input
        type="text"
        placeholder="Previous Name"
        onChange={(e) => setValue(e.target.value, "update_previous_name")}
      />
      <br />
      <input
        type="text"
        placeholder="Update Name"
        onChange={(e) => setValue(e.target.value, "update_updated_name")}
      />
      <br />
      <input
        type="button"
        value="Update Please"
        onClick={() => {
          updateQuery(previous_name, updated_name);
        }}
      />

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
      {allDataCustomer.map((item) => {
        return (
          <p>
            ID :{item.CUST_ID} | Name : {item.CUST_NAME}
          </p>
        );
      })}
    </div>
  );
}

export default Admin;
