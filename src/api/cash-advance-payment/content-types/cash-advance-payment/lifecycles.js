
module.exports = {
    async afterCreate(event) {
        const { result, params } = event

        const cashAdvanceId = params.data.cash_advance
        const cashAdvance = result

        console.log("Employee: ", cashAdvanceId)
        console.log("Cash Advance: ", cashAdvance)

        const cash_advance = await strapi.entityService.findOne(
            'api::cash-advance.cash-advance',
            cashAdvanceId.set[0].id
        )

        console.log('Cash Advance Result: ', cash_advance)
        console.log('Cash advance balance: ', cash_advance.cash_advance_balance)

        const currentBalance = Number(cash_advance.cash_advance_balance || 0)
        const newBalance = Math.max(currentBalance - cashAdvance.cash_advance_payment, 0)

        console.log('New Balance: ', newBalance)

        await strapi.db.query("api::cash-advance.cash-advance").update({
            where: { id: cashAdvanceId.set[0].id },
            data: { cash_advance_balance: newBalance}
        })
    }
}