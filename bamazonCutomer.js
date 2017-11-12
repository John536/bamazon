var mysql = require("mysql");
var inquirer = require("inquirer");

//connection information for DB
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", // Your username
  password: "Mondo12",// Your password
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  start();
});


// function which displays inventory and prompts the user for orders
function start() {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");

    inquirer
      .prompt([
        {
          name: "items",
          type: "rawlist",
          message: "What item ID would you like to purchase?",
          choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        },

        {
          type: "input",
          name: "amount",
          message: "How many?"
        }


      ])
      .then(function (answer) {
        var item = answer.items
        var quantity = answer.amount


        //we received something that was not an object so we converted it via stringify and parse
        var trav = (JSON.stringify(res));
        res = JSON.parse(trav);

        for (var i = 0; i < res.length; i++) {

          if (res[i].item_id == item) {
            if (res[i].stock_quantity >= quantity) {
              console.log("Processing your order! Your bill is $" + (quantity * res[i].price));
              var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (res[i].stock_quantity - quantity) + ' WHERE item_id = ' + item;

              connection.query(updateQueryStr, function (err, data) {
                if (err) throw err;
              })

            } else {
              console.log("Sorry we cannot fullfill that order.")

            }
            start();
          }
        }

      }
      )
  }
  )
}


