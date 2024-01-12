const dbConnection = require('./dbConnection');
const sql = require("mssql");


async function DBshowConnect(orderNumber) {

    let statePool; 
    try{
        console.log('Looking for Equipement...')
        await connectToDB().then((pool) => {
            console.log('Connected to the database:', pool);
            statePool = pool; 
            }).catch((error) => {
                console.error('Failed to connect to the dtabase:', error);
            });  
        const lineData = await getShowEquipment(statePool, orderNumber); 
        const details = await findInvoiceById(statePool, orderNumber)


        const data = {
            showname: details.recordset[0].bill_to_name, 
            address: details.recordset[0].ship_to_name, 
            ship: lineData.recordset[0].req_ship_dt, 
            order: orderNumber,
            equipment: lineData.recordset.map(item => ({
                description: item.item_desc_1.trim(),
                quantity: item.qty_ordered
            }))
        };
        

        return data

    } catch (error) {
        console.error('error has occured', error); 
    }
}


async function findInvoiceById(pool, orderId) {
    return await pool
      .request()
      .input("orderId", sql.VarChar, orderId)
      .query("SELECT * FROM dbo.OEHDRHST_SQL WHERE ord_no = @orderId");
  }
  


async function getShowEquipment(pool, orderNumber) {
    try {
        return await pool
            .request()
            .input('order', sql.Char, orderNumber)
            .query(`
                SELECT item_desc_1, item_desc_2, qty_ordered, req_ship_dt
                FROM dbo.OELINAUD_SQL 
                WHERE ord_no = @order 
                AND aud_action = 'A' 
                AND aud_dt = (
                    SELECT MAX(aud_dt)
                    FROM dbo.OELINAUD_SQL
                    WHERE ord_no = @order
                    AND aud_action = 'A'
                );
            `);
    } catch (err) {
        console.log('sql error:', err);
        throw err;
    }
}







module.exports = DBshowConnect, findInvoiceById