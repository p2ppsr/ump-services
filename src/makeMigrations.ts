export default ({ tablePrefix }) => ([{
    up: async knex => {
        await knex.schema.createTable(`${tablePrefix}users`, table => {
            table.increments()
            table.string('txid')
            table.integer('vout')
            table.string('presentationKeyHash')
            table.string('recoveryKeyHash')
        })
    },
    down: async knex => {
        await knex.schema.dropTable(`${tablePrefix}users`)
    }
}])
