//@ts-ignore
const { ApplicationError } = require("@strapi/utils").errors;
module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;
        console.log(data.employee.set[0].id)
        // const existing = await strapi.db.query("api::payslip.payslip").findOne({
        //     where: {
        //         employee: data.employee.set[0].id,
        //         payroll_period: data.payroll_period.set[0].id
        //     }
        // });

        // const myPayload = {
        //     message: " payslip already exist for this employee and payroll period.",
        //     status: 500
        // }

        // if (existing) {
        //     //return event.body = myPayload
        //     throw new ApplicationError("A payslip already exist for this employee and payroll period.");
        // }
        

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
}