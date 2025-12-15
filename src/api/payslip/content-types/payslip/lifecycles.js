//@ts-ignore
const { ApplicationError } = require("@strapi/utils").errors;
module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;
        console.log(data.employee.set[0].id)
        const exists = await strapi.entityService.findMany("api::payslip.payslip", {
            filters: {
                employee: data.employee.set[0].id,
                payroll_period: data.payroll_period.set[0].id
            },
            limit: 1,
        });

        if (exists.length > 0) {
            //throw new Error("Payslip already created for this employee and payroll period.")
            throw new ApplicationError("A payslip already exist for this employee and payroll period.");
        }
    },

    async afterCreate(event) {
        const { result, params } = event

        // const employeeId = result.employee?.id || result.employee
        const employeeId = params.data.employee
        //const newBalance = result
        // console.log('Employee ID: ', employeeId)
        // console.log('Payslip: ', newBalance)

        //const newCashAdvanceBalance = Number(result.cash_advance_balance) - Number(result.cash_advance_deduction);
        await strapi.db.query("api::employee.employee").update({
            where: { id: employeeId.set[0].id },
            data: { cash_advance_balance: result.cash_advance_balance}
        })

        console.log(`Updated cash advance balance for employee ${employeeId.set[0].id}: ${result.cash_advance_balance}`);
    }
}