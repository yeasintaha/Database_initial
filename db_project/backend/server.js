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
      `BEGIN
        insert_customer(:id,:name,:mail,:gender,:phone,:house,:street,:postal);
      END;
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

app.post("/api/insert/supplier", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let id, name, mail, phone, house, street, postal;
  id = req.body.id;
  console.log("Id here ", id);
  name = req.body.name;
  mail = req.body.mail;
  phone = req.body.phone;
  house = req.body.house;
  street = req.body.street;
  postal = req.body.postal;

  try {
    const sql = await connection.execute(
      `BEGIN
         insert_supplier(:id,:name,:mail,:phone,:house,:street,:postal);
        END;
        `,
      [id, name, mail, phone, house, street, postal]
    );
    connection.commit();
    console.log("Insertion successful ", sql.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});

app.get("/api/get/supplier", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  try {
    const sql = await connection.execute(`select * from supplier`);
    res.send(sql.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get(
  "/api/get/search_supplier/name/:supplier_name",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    let search = req.params.supplier_name;
    search = "%" + search + "%";
    const sql = await connection.execute(
      `select * from supplier WHERE lower(SUPPLIER_NAME) LIKE :search order by SUPPLIER_ID desc`,
      [search]
    );
    res.send(sql.rows);
  }
);

app.get("/api/get/search_supplier/id/:supplier_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.supplier_id;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from supplier WHERE lower(SUPPLIER_ID) LIKE :search order by SUPPLIER_ID desc`,
    [search]
  );
  res.send(sql.rows);
});
app.get(
  "/api/get/search_supplier/mail/:supplier_mail",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    let search = req.params.supplier_mail;
    search = "%" + search + "%";
    const sql = await connection.execute(
      `select * from supplier WHERE lower(SUPPLIER_MAIL) LIKE :search order by SUPPLIER_ID desc`,
      [search]
    );
    res.send(sql.rows);
  }
);
app.get(
  "/api/get/search_supplier/phone/:supplier_phone",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    let search = req.params.supplier_phone;
    search = "%" + search + "%";
    const sql = await connection.execute(
      `select * from supplier WHERE lower(SUPPLIER_PHONE) LIKE :search order by SUPPLIER_ID desc `,
      [search]
    );
    res.send(sql.rows);
  }
);
//
//
/// Customer
//
//

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
app.get("/api/get/new_supplier_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `select * from supplier
  order by SUPPLIER_ID desc`
  );
  let last_id = sql.rows[0].SUPPLIER_ID;
  let last_id_int = parseInt(last_id) + 1;
  last_id = last_id_int.toString();
  last_id = last_id;
  console.log(last_id, " of new supplier okay done  ");
  res.send(last_id);
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

app.get("/api/get/search_customer/:cust_name", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.cust_name;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from customer WHERE lower(CUST_NAME) LIKE :search `,
    [search]
  );
  res.send(sql.rows);
});
//
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
  res.send(last_id);
});

app.put("/api/update/customer", async function (req, res) {
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
//
//
/// Employee
//
//
app.get("/api/get/employee", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `select * from employee
  order by EMPLOYEE_ID desc`
  );
  res.send(sql.rows);
});
app.post("/api/insert/employee", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let id, name, mail, phone, designation, house, street, postal;
  id = req.body.id;
  console.log("Id here ", id);
  name = req.body.name;
  mail = req.body.mail;
  designation = req.body.designation;
  phone = req.body.phone;
  house = req.body.house;
  street = req.body.street;
  postal = req.body.postal;

  try {
    const sql = await connection.execute(
      `BEGIN
          insert_employee(:id,:name,:mail,:desgination,:phone,:house,:street,:postal);
       END;
        `,
      [id, name, mail, designation, phone, house, street, postal]
    );
    connection.commit();
    console.log("Insertion successful ", sql.outBinds);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});

// app.get("/api/get/search_employee/:employee_name", async function (req, res) {
//   let connection;
//   connection = await oracledb.getConnection({
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     connectString: "localhost/XE",
//   });
//   let search = req.params.employee;
//   search = "%" + search + "%";
//   const sql = await connection.execute(
//     `select * from employee WHERE lower(EMPLOYEE_NAME) LIKE :search `,
//     [search]
//   );
//   res.send(sql.rows);
// });

app.put("/api/update/employee", async function (req, res) {
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
      `update employee 
    set employee_name =:updated_name
    where employee_name=:name`,
      [updated_name, name]
    );
    connection.commit();
    console.log("Update successful ", query.rowsAffected);
  } catch (err) {
    console.error("There are some error ");
  }
  await connection.close();
});

app.delete("/api/delete/employee/:deleted_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const deleted_id = req.params.deleted_id;
  console.log(" employee id delete : ", deleted_id);
  try {
    const query = await connection.execute(
      `delete from employee 
    where employee_id=:id`,
      [deleted_id]
    );
    connection.commit();
    console.log("Delete successful ", query.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});
app.get("/api/get/new_employee_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `select * from employee
  order by EMPLOYEE_ID desc`
  );
  let last_id = sql.rows[0].EMPLOYEE_ID;
  let last_id_int = parseInt(last_id) + 1;
  last_id = last_id_int.toString();
  // console.log("Employee ID ", last_id);
  res.send(last_id);
});

app.get("/api/get/search_employee/id/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from EMPLOYEE WHERE lower(EMPLOYEE_ID) LIKE :search order by EMPLOYEE_ID desc`,
    [search]
  );
  res.send(sql.rows);
});
app.get("/api/get/search_employee/name/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from EMPLOYEE WHERE lower(EMPLOYEE_NAME) LIKE :search order by EMPLOYEE_ID desc`,
    [search]
  );
  res.send(sql.rows);
});
app.get("/api/get/search_employee/phone/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from EMPLOYEE WHERE lower(EMPLOYEE_PHONE) LIKE :search order by EMPLOYEE_ID desc`,
    [search]
  );
  res.send(sql.rows);
});
app.get("/api/get/search_employee/mail/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from EMPLOYEE WHERE lower(EMPLOYEE_MAIL) LIKE :search order by EMPLOYEE_ID desc`,
    [search]
  );
  res.send(sql.rows);
});

//
//
/// Product
//
//
app.delete("/api/delete/product/:deleted_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const deleted_id = req.params.deleted_id;
  console.log(" product id delete : ", deleted_id);
  try {
    const query = await connection.execute(
      `delete from product 
    where product_id=:id`,
      [deleted_id]
    );
    connection.commit();
    console.log("Delete successful ", query.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});
app.post("/api/insert/product", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let id, name, image, qty, price, category;
  id = req.body.productID;
  console.log("Id here ", id);
  name = req.body.name;
  image = req.body.image;
  qty = req.body.qty;
  price = req.body.price;
  category = req.body.category;
  console.log(
    "Everything is here ",
    id,
    name,
    image,
    price,
    qty,
    price,
    category
  );
  try {
    const sql = await connection.execute(
      `insert into product 
      values(:id,:name,:qty,:price,:image,:category)
        `,
      [id, name, qty, price, image, category]
    );
    connection.commit();
    console.log("Insertion successful ", sql.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});

app.get("/api/get/new_product_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(`select * from product`);
  let maxx = parseInt(sql.rows[0].PRODUCT_ID);
  for (let i = 1; i < sql.rows.length; i++) {
    if (maxx < parseInt(sql.rows[i].PRODUCT_ID)) {
      maxx = parseInt(sql.rows[i].PRODUCT_ID);
    }
  }
  maxx = maxx + 1;
  maxx = maxx.toString();
  console.log("Product ID ", maxx);
  res.send(maxx);
});
app.get("/api/get/search_product/id/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from PRODUCT WHERE lower(PRODUCT_ID) LIKE :search order by PRODUCT_ID desc`,
    [search]
  );
  res.send(sql.rows);
});

app.get("/api/get/search_product/name/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from PRODUCT WHERE lower(PRODUCT_NAME) LIKE :search order by PRODUCT_ID desc`,
    [search]
  );
  res.send(sql.rows);
});

app.get("/api/get/search_product/category/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  search = "%" + search + "%";
  const sql = await connection.execute(
    `select * from PRODUCT WHERE lower(PRODUCT_CATEGORY) LIKE :search order by PRODUCT_ID desc`,
    [search]
  );
  res.send(sql.rows);
});
app.get("/api/get/search_product/price/:search", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let search = req.params.search;
  const sql = await connection.execute(
    `select * from PRODUCT WHERE lower(PRODUCT_PRICE) = :search order by PRODUCT_ID desc`,
    [search]
  );
  res.send(sql.rows);
});

///
///
/// GET CUSTOMER NAME FroM ORDER ID
///
///
/*

*/
app.get(
  "/api/get/cust_name_from_order_id/:order_id",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    const id = req.params.order_id;
    const result = await connection.execute(
      `BEGIN
     :ret := get_cust_name_from_order_id(:id);
     END;`,
      {
        id: id,
        ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 },
      }
    );

    res.send(result.outBinds);
  }
);
app.get("/api/get/product", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `select * from product
  order by PRODUCT_ID desc`
  );
  res.send(sql.rows);
});
app.get(
  "/api/get/product_details_from_supplier_id/:search",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    const id = req.params.search;
    const result = await connection.execute(
      `SELECT p.PRODUCT_ID,s.SUPPLIER_ID,s.SUPPLIER_NAME,p.PRODUCT_NAME, p.PRODUCT_PRICE,p.PRODUCT_CATEGORY 
      FROM SUPPLIER s 
      INNER JOIN supplies sup 
      ON s.SUPPLIER_ID =sup.SUPPLIER_ID 
      INNER JOIN PRODUCT p 
      ON p.PRODUCT_ID = sup.PRODUCT_ID
      WHERE s.supplier_id = :id
    `,
      [id]
    );
    res.send(result.rows);
  }
);

app.get("/api/get/order_id_from_cust_name/:cust_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const id = req.params.cust_id;
  await connection.execute(
    `BEGIN
        DBMS_OUTPUT.ENABLE(NULL);
      END;`
  );

  await connection.execute(
    `BEGIN
       dbms_output.get_line(get_order_id_from_cust_id(:id));
      END;
      `,
    [id]
  );

  let result;
  do {
    result = await connection.execute(
      `BEGIN
           DBMS_OUTPUT.GET_LINE(:ln, :st);
         END;`,
      {
        ln: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
        st: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );
    if (result.outBinds.st === 0) {
      console.log(result.outBinds.ln);
    }
  } while (result.outBinds.st === 0);

  // while ((row = await rs.getRow())) {
  //   console.log(row);

  // }
});

///
///
/// Supplies
///
///
/*
BEGIN
	insert_supplies('2','3',CURRENT_TIMESTAMP);
END;

*/

app.post("/api/insert/supplies", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let sup_id, prd_id;
  sup_id = req.body.supplierID;
  prd_id = req.body.productID;
  console.log(sup_id, " paitese naki ");
  try {
    const sql = await connection.execute(
      `BEGIN
          insert_supplies(:sup_id,:prd_id,CURRENT_TIMESTAMP);
        END;
        `,
      [sup_id, prd_id]
    );
    connection.commit();
    console.log("Insertion successful ", sql.outBinds);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});
app.get("/api/get/admin", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(`select * from admin `);
  res.send(sql.rows);
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
