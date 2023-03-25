const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
    // multer file upload validation
    fileUpload: validator({
        file: Joi.object({
            uploadExcel: Joi.any().required(),
        })
    }),

    update: validator({
        body: Joi.object({
            id: { type: String },
            createdTime: { type: String },
            adId: { type: String },
            adName: { type: String },
            adsetId: { type: String },
            adsetName: { type: String },
            campaignId: { type: String },
            campaignName: { type: String },
            formId: { type: String },
            formName: { type: String },
            isOrganic: { type: String },
            plateform: { type: String },
            fname: { type: String },
            email: { type: String },
            phone: { type: String },
            postCode: { type: String },
            sms: Joi.boolean().allow(null, ""),
            contactedBy: Joi.string().allow(null, ""),
            contactedOn: Joi.string().allow(null, ""),
            contactedAgain: Joi.string().allow(null, ""),
            lastContact: Joi.string().allow(null, ""),
            emailFailed: Joi.boolean().allow(null, ""),
            reached: Joi.boolean().allow(null, ""),
            appointmentDate: Joi.string().allow(null, ""),
            appointmentTime: Joi.string().allow(null, ""),
            makeAppointment: Joi.string().allow(null, ""),
            usefulInformation: Joi.string().allow(null, ""),
            nichtGeeignet: Joi.boolean().allow(null, ""),
            color: Joi.string(),
            isActive: Joi.string(),
        }),
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
        }),
    }),

    toggleActive: validator({
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
        }),
    }),

    fetch: validator({
        query: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID"),
            search: Joi.string(),
            project: Joi.string(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            userName: Joi.string(),
            postalCode: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
            isSales: Joi.boolean(),
            workYears: Joi.string(),
            page: Joi.number().default(1),
            limit: Joi.number().default(100),
            sortBy: Joi.string().default("createdAt"),
            sortOrder: Joi.string().default("-1"),
        }),
    }),
};