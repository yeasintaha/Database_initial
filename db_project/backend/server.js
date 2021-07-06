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

app.get("/api/get/order_info/:order_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  try {
    let order_id = req.params.order_id;
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
         insert_supplier(sq_supplier_id.nextval,:name,:mail,:phone,:house,:street,:postal);
        END;
        `,
      [name, mail, phone, house, street, postal]
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

app.post("/api/update/customer", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const name = req.body.name;
  const phone = req.body.phone;
  const gender = req.body.gender;
  const house = req.body.house;
  const street = req.body.street;
  const postal = req.body.postal;
  const previous_mail = req.body.previous_mail;
  // console.log("Address ", house, " ", street, " ", postal);
  try {
    const query = await connection.execute(
      `update customer c
    set c.cust_name =:name ,c.cust_phone=:phone,c.cust_gender =:gender,
    c.cust_address.house_no=:house, c.cust_address.street_no = :street,c.cust_address.postal_code = :postal
    where cust_mail=:previous_mail`,
      [name, phone, gender, house, street, postal, previous_mail]
    );
    console.log(gender, " and ", previous_mail);
    connection.commit();
    console.log("Update successful ", query.rowsAffected);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});
app.get("/api/get/customer/:cust_mail", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const mail = req.params.cust_mail;
  try {
    const query = await connection.execute(
      `select * from customer 
        where cust_mail = :mail
      `,
      [mail]
    );
    res.send(query.rows);
    connection.commit();
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
app.post("/api/update/product", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let id = req.body.id;
  let qty = req.body.qty;
  try {
    const sql = await connection.execute(
      `update product set product_quantity=:qty
      where product_id = :id
        `,
      [id, qty]
    );
    connection.commit();
    console.log("update ", id, " ", qty);
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
  console.log("Product info ", id, name, image, price, qty, price, category);
  try {
    const sql = await connection.execute(
      `insert into product (product_id,product_name,product_quantity,product_price,product_image,product_category)
      values(:id,:name,:qty,:price,:image,:category)
        `,
      [id, name, qty, price, image, category]
    );
    connection.commit();

    const update_product_category = await connection.execute(
      ` UPDATE PRODUCT 
        SET PRODUCT_UNIT= CASE 
            WHEN  lower(PRODUCT_CATEGORY)='fruits' AND lower(PRODUCT_NAME)='banana' THEN '1 dozen'
            WHEN  lower(PRODUCT_CATEGORY)='fruits' THEN '1 kg'
            WHEN lower(PRODUCT_CATEGORY)='grocery' AND lower(PRODUCT_NAME) ='egg' THEN '1 dozen'
            WHEN lower(PRODUCT_CATEGORY)='grocery' AND lower(PRODUCT_NAME) LIKE '%oil%' THEN '1 L'
            WHEN lower(PRODUCT_CATEGORY)='grocery' AND lower(PRODUCT_NAME) !='egg' THEN '1 kg'
            WHEN lower(PRODUCT_CATEGORY)='dairy' THEN '1 L'
            ELSE '1 kg'
            END
      `
    );
    connection.commit();
    console.log(
      "Affected rows products ",
      update_product_category.rowsAffected
    );
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

app.get("/api/get/popular_products", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `SELECT count(bc.product_id) AS product_count , bc.product_id,p.PRODUCT_NAME,p.PRODUCT_CATEGORY,
    p.PRODUCT_IMAGE ,p.PRODUCT_PRICE,p.product_UNIT FROM BUY_CART bc
    INNER JOIN product p ON bc.PRODUCT_ID =p.PRODUCT_ID 
    GROUP BY bc.product_id,p.PRODUCT_NAME,p.PRODUCT_CATEGORY,p.PRODUCT_IMAGE ,
    p.PRODUCT_PRICE,p.PRODUCT_UNIT ORDER BY product_count desc`
  );
  res.send(sql.rows);
});
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
app.get("/api/get/stock_out_products", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const sql = await connection.execute(
    `SELECT * FROM PRODUCT  WHERE PRODUCT_QUANTITY = 0`
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
app.get(
  "/api/get/order_id_from_cust_mail/:cust_mail",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    const mail = req.params.cust_mail;
    const result = await connection.execute(
      `SELECT oi.ORDER_ID,c.cust_name,c.cust_id,c.cust_mail
      FROM customer C 
      INNER JOIN BUY_CART bc 
      ON bc.cust_id = c.cust_id
      INNER JOIN ORDER_INFO oi 
      ON oi.order_id = bc.ORDER_ID 
      GROUP BY c.cust_id,oi.ORDER_ID,c.cust_name,c.cust_mail
      having c.cust_mail = :mail
      `,
      [mail]
    );
    res.send(result.rows);
  }
);

app.get(
  "/api/get/order_id_from_cust_name_function/:cust_id",
  async function (req, res) {
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
  }
);

///
///
/// Supplies
///
///

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

//
//
/// Buy Cart
//
//

/*




*/
app.get("/api/get/order_id", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  const mail = req.params.cust_mail;
  const sql = await connection.execute(
    `
    select order_id from order_info order by order_id desc 
  `
  );
  res.send(sql.rows);
});
app.get(
  "/api/get/order_table_from_cust_mail/:cust_mail",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    const mail = req.params.cust_mail;
    const sql = await connection.execute(
      `
    SELECT oi.order_id,oi.ORDER_TOTAL_COST ,oi.order_time,oi.order_quantity,c.cust_mail,c.cust_name
    FROM order_info oi INNER JOIN BUY_CART bc ON bc.ORDER_ID = oi.ORDER_ID 
    INNER JOIN CUSTOMER c ON c.CUST_ID = bc.CUST_ID 
    GROUP BY oi.order_id,oi.ORDER_TOTAL_COST ,oi.order_time,oi.order_quantity,bc.ORDER_ID ,c.CUST_ID ,c.CUST_MAIL,c.cust_name 
    having c.CUST_MAIL = :mail
    ORDER BY oi.ORDER_ID  
  `,
      [mail]
    );
    res.send(sql.rows);
  }
);

app.get(
  "/api/get/order_details_from_cust_mail/:cust_mail",
  async function (req, res) {
    let connection;
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: "localhost/XE",
    });
    const mail = req.params.cust_mail;
    const sql = await connection.execute(
      `
    SELECT bc.PRODUCT_ID,bc.ORDER_ID ,p.PRODUCT_ID ,p.PRODUCT_NAME ,p.PRODUCT_IMAGE ,p.PRODUCT_PRICE ,bc.PRODUCT_SELECTED_QUANTITY 
    FROM BUY_CART bc
    INNER JOIN PRODUCT p ON p.PRODUCT_ID =bc.PRODUCT_ID 
    WHERE bc.cust_id = 
    (SELECT cust_id FROM customer WHERE cust_mail= :mail)
    ORDER BY order_id 
   
  `,
      [mail]
    );
    res.send(sql.rows);
  }
);

///
//
//
//
app.post("/api/insert/buy_cart", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let cust_id = req.body.cust_id;
  let prd_id = req.body.product_id;
  let order_id = req.body.order_id;
  let psd = req.body.product_selected_quantity;
  let price = req.body.price;
  try {
    const sql = await connection.execute(
      `insert into buy_cart values(:cust_id,:product_id,:order_id,:psd,:price)
        `,
      [cust_id, prd_id, order_id, psd, price]
    );
    connection.commit();
    console.log("Insertion successful ", sql.outBinds);
  } catch (err) {
    console.error(err);
  }
  await connection.close();
});
app.post("/api/insert/order_info", async function (req, res) {
  let connection;
  connection = await oracledb.getConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: "localhost/XE",
  });
  let total_cost = req.body.total_cost;
  let qty = req.body.quantity;
  let id = req.body.id;
  try {
    const sql = await connection.execute(
      `INSERT INTO ORDER_INFO values(sq_order_info.nextval,:total_cost,CURRENT_TIMESTAMP,:qty,:id)
        `,
      [total_cost, qty, id]
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
