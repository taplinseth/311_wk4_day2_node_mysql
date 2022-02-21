const mysql = require('mysql')
const pool = require('../sql/connection')
const {handleSQLError} = require('../sql/error')

const getAllUsers = (req, res) => {
    // SELECT ALL USERS
    let sql = "SELECT * FROM users JOIN usersAddress, usersContact WHERE users.id = usersAddress.user_id AND users.id = usersContact.user_id;"
    // WHAT GOES IN THE BRACKETS
    pool.query(sql, (err, rows) => {
        if (err) return handleSQLError(res, err)
        return res.json(rows);
    })
}

const getUserById = (req, res) => {
    // SELECT USERS WHERE ID = <REQ PARAMS ID>
    let sql = "SELECT * FROM users WHERE id = ?";
    // WHAT GOES IN THE BRACKETS
    sql = mysql.format(sql, [req.params.id]);

    pool.query(sql, (err, rows) => {
        if (err) return handleSQLError(res, err)
        return res.json(rows[0]);
    })
}

const createUser = (req, res) => {
    // INSERT INTO USERS FIRST AND LAST NAME
    let sql = "INSERT INTO users (first_name, last_name) VALUES (?, ?); " +
        "INSERT INTO usersAddress (user_id, address, city, county, state, zip) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?); " +
        "INSERT INTO usersContact (user_id, phone1, phone2, email) VALUES (LAST_INSERT_ID(), ?, ?, ?);";
    // WHAT GOES IN THE BRACKETS
    sql = mysql.format(sql, [req.body.first_name, req.body.last_name,
        req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip,
        req.body.phone1, req.body.phone2, req.body.email]);

    pool.query(sql, (err, results) => {
        if (err)
            return handleSQLError(res, err);
        return res.json({newId: results[0].insertId});
    })
}

const updateUserById = (req, res) => {
    // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
    let sql = "UPDATE users SET first_name = ?, last_name = ? WHERE id =?"
    // WHAT GOES IN THE BRACKETS
    sql = mysql.format(sql, [req.body.first_name, req.body.last_name, req.params.id])

    pool.query(sql, (err, results) => {
        if (err) return handleSQLError(res, err)
        return res.status(204).json();
    })
}

const deleteUserByFirstName = (req, res) => {
    // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
    let sql = "DELETE FROM users WHERE first_name = '?'"
    // WHAT GOES IN THE BRACKETS
    sql = mysql.format(sql, [req.body.first_name])

    pool.query(sql, (err, results) => {
        if (err) return handleSQLError(res, err)
        return res.json({message: `Deleted ${results.affectedRows} user(s)`});
    })
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserByFirstName
}