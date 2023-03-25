const messages = require("../../json/message.json");
const DB = require("../../models");
const apiResponse = require("../../utils/api.response");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const { handleStatusColor } = require("../../script")
const csv = require('csvtojson');
const fs = require('fs');

/* APIS For ApplyNow */
module.exports = exports = {

    /* Create ApplyNow API */
    createApplyNow: async (req, res) => {

        if (!req.file?.path) return apiResponse.BAD_REQUEST({ res, message: messages.NOT_FOUND })

        let results = [];
        csv().fromFile(req.file.path).then(async (jsonObj) => {
            for await (const i of jsonObj) {
                const findExistPhone = await DB.APPLYNOW.findOne({ $or: [{ phone: i.phone }, { email: i.email }] });
                if (!findExistPhone) {
                    results.push(i);
                }

                let fields = Object.keys(jsonObj[0])
                let validateKeys = ['id', 'created_time', 'ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'form_id', 'form_name', 'is_organic', 'platform', 'full_name', 'phone_number', 'email', 'post_code']

                const missingField = fields.find(item => !validateKeys.includes(item))
                if (missingField) return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_DATA + missingField });
            }

            let data = [];
            for (let i = 0; i < results.length; i++) {
                let obj = {};
                obj.id = results[i].id;
                obj.createdTime = results[i].created_time;
                obj.adId = results[i].ad_id;
                obj.adName = results[i].ad_name;
                obj.adsetId = results[i].adset_id;
                obj.adsetName = results[i].adset_name;
                obj.campaignId = results[i].campaign_id;
                obj.campaignName = results[i].campaign_name;
                obj.formId = results[i].form_id;
                obj.formName = results[i].form_name;
                obj.isOrganic = results[i].is_organic;
                obj.plateform = results[i].platform;
                obj.fname = results[i].full_name;
                obj.email = results[i].email;
                obj.phone = results[i].phone_number;
                obj.postCode = results[i].post_code;
                data.push(obj);
            }
            await DB.APPLYNOW.insertMany(data);
            await fs.unlink(req.file.path, (err) => {
                if (err) console.log(err);
                return apiResponse.OK({ res, message: messages.SUCCESS });
            });
        });
    },

    /* Get ApplyNow API */
    getApplyNow: async (req, res) => {
        let { page, limit, skip, sortBy, sortOrder, search, startDate, endDate, color, ...query } = req.body;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        search ? query = {
            $or: [{ userName: { $regex: search, $options: "i" } },]
        } : ""

        query = (startDate && endDate)
            ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate).setHours(23, 59, 59) } }
            : query;

        query = color ? { ...query, color: color } : query;

        const applyNows = await DB.APPLYNOW
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return apiResponse.OK({ res, message: messages.SUCCESS, data: { count: await DB.APPLYNOW.countDocuments(query), data: applyNows } });
    },

    /* Update ApplyNow API*/
    updateApplyNow: async (req, res) => {
        let { contactedOn, contactedAgain, lastContact, appointmentDate } = req.body;

        let applyNowExists = await DB.APPLYNOW.findOne({ _id: req.params._id, isActive: true });
        if (!applyNowExists) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

        if (contactedOn) contactedOn = new Date(contactedOn) || applyNowExists.contactedOn
        if (contactedAgain) contactedAgain = new Date(contactedAgain) || applyNowExists.contactedAgain
        if (lastContact) lastContact = new Date(lastContact) || applyNowExists.lastContact
        if (appointmentDate) appointmentDate = new Date(appointmentDate) || applyNowExists.appointmentDate

        let data = {
            $set: {
                ...req.body,
                contactedOn: contactedOn,
                contactedAgain: contactedAgain,
                lastContact: lastContact,
                appointmentDate: appointmentDate,
            }
        }

        const update = await DB.APPLYNOW.findByIdAndUpdate(req.params._id, data, { new: true, });
        await handleStatusColor({ data: [update], models: DB.APPLYNOW })
        return apiResponse.OK({ res, message: messages.SUCCESS });
    },

    /* Delete ApplyNow API*/
    deleteApplyNow: async (req, res) => {
        if (!await DB.APPLYNOW.findOne({ _id: req.params._id })) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });
        await DB.APPLYNOW.findByIdAndDelete(req.params._id);

        return apiResponse.OK({ res, message: messages.SUCCESS });
    },
};