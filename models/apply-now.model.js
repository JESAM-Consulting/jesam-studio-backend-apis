const { Schema, model } = require("mongoose");
const { COLOR } = require("../json/enums.json");

const applyNowSchema = new Schema(
    {
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
        sms: { type: Boolean, default: null },
        contactedBy: { type: String, default: null },
        contactedOn: { type: Date, default: null },
        contactedAgain: { type: Date, default: null },
        lastContact: { type: Date, default: null },
        emailFailed: { type: Boolean, default: null },
        reached: { type: Boolean, default: null },
        appointmentDate: { type: Date, default: null },
        appointmentTime: { type: String, default: null },
        makeAppointment: { type: String, default: null },
        usefulInformation: { type: String, default: null },
        nichtGeeignet: { type: Boolean, default: null },
        color: { type: String, enum: COLOR, default: COLOR.RED },
        starterSeminar: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let applyNowrModel = model("applyNow", applyNowSchema, "applyNow");

module.exports = applyNowrModel;