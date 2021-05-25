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

app.post("/api/delete", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });

  let del = req.body.del;
  const query = await connection.execute(
    `delete from customer 
    where cust_name = :del`,
    [del]
  );
  connection.commit();
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

  const sql = await connection.execute(
    `insert into customer
      values (:id,:name,:mail,:gender,:phone,address_info(:house,:street,:postal))
      `,
    [id, name, mail, gender, phone, house, street, postal]
  );
  connection.commit();
  console.log(sql.rowsAffected);
});

app.get("/api/get/order_info", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(`select * from order_info`);
  res.send(sql.rows);
});

app.get("/api/get/customer", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(`select * from customer`);
  res.send(sql.rows);
});
app.listen(port, () => console.log(`Listening on localhost:${port}`));
