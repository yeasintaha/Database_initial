import express from "express";
import oracledb from "oracledb";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/ ", (req, res) => res.status(200).send("Hello database"));

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
dotenv.config();

app.delete("/api/delete/:cust_name", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });

  let del = req.params.cust_name;
  try {
    const query = await connection.execute(
      `delete from customer 
    where cust_name = :del`,
      [del]
    );
    connection.commit();
    console.log("Deletion successful ", query.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});

app.post("/api/insert", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let id, name, mail, gender, phone, house, street, postal;
  id = req.body.id;
  name = req.body.name;
  mail = req.body.mail;
  gender = req.body.gender;
  phone = req.body.phone;
  house = req.body.house;
  street = req.body.street;
  postal = req.body.postal;

  try {
    const sql = await connection.execute(
      `insert into customer
      values (:id,:name,:mail,:gender,:phone,address_info(:house,:street,:postal))
      `,
      [id, name, mail, gender, phone, house, street, postal]
    );
    connection.commit();
    console.log("Insertion successful ", sql.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});

app.get("/api/get/order_info", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  try {
    const sql = await connection.execute(`select * from order_info`);
    res.send(sql.rows);
  } catch (err) {
    console.log(err);
  }
  await connection.close();
});

app.get("/api/get/customer", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `select * from customer
  order by CUST_ID desc`
  );
  res.send(sql.rows);
});

app.get("/api/get/new_customer_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `select * from customer
  order by CUST_ID desc`
  );
  let last_id = sql.rows[0].CUST_ID;
  let last_id_int = parseInt(last_id) + 1;
  last_id = last_id_int.toString();
  last_id = "00" + last_id;
  console.log(last_id);
  res.send(last_id);
});

app.put("/api/update", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const updated_name = req.body.updated_cust_name;
  const name = req.body.cust_name;
  console.log(" Updated name : ", updated_name);
  console.log("Previous name : ", name);
  try {
    const query = await connection.execute(
      `update customer 
    set cust_name =:updated_name
    where cust_name=:name`,
      [updated_name, name]
    );
    connection.commit();
    console.log("Update successful ", query.rowsAffected);
  } catch (err) {
    console.error("There are some error ");
  }
  await connection.close();
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
