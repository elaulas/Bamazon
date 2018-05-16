var mysql = require('mysql');
var inquirer = require('inquirer');


// create connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
})

// initialize the connection

connection.connect(function(err){
    if(err) throw err;
    createTable();
});

var createTable = function(){
    connection.query('SELECT * FROM products', function(err, res){
        for (i = 0; i < res.length; i++){
            console.log(res[i].item_id + ' || ' + res[i].product_name + ' || ' + res[i].department_name + ' || $' + res[i].price + ' || ' + res[i].stock_quantity);
        };
    customerChoice(res)
    });
};

var customerChoice = function(res){
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'Please enter the number of the item you would like to purchase: '
    }]).then(function(answer){
        var correct = false;
        for (i = 0; i < res.length; i++){
            if(res[i].item_id == answer.choice){
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt([{
                    type: 'input',
                    name: 'amount',
                    message: 'How many would you like to buy?',
                    validate: function(value){
                        if(isNaN(value) == false){
                            return true;
                        }else {
                            return false;
                        };
                    }
                }]).then(function(answer){
                    if((res[id].stock_quantity - answer.amount) > 0){
                        connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.amount) + "'WHERE item_id= '" + product + "'", function(err,res2){
                            console.log("Product Purchased! The total cost of your puchase was only $" + (answer.amount *res[id].price) + '!');
                            createTable();
                       
                        })
                    }else {
                        console.log('Your Choice was not valid!');
                        customerChoice(res);
                    }
                })
            }
        }
    })
}
