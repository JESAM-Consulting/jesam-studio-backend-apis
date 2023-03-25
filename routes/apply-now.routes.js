const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN, SUPERADMIN } } = require("../json/enums.json");
const { localUpload } = require("../service/s3.upload")

const {
  APPLYNOW: { VALIDATOR, APIS }
} = require("../controllers");

/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN, SUPERADMIN] }), localUpload.single("uploadExcel"), VALIDATOR.fileUpload, APIS.createApplyNow);
router.post("/get", auth({ usersAllowed: [ADMIN, SUPERADMIN] }), VALIDATOR.fetch, APIS.getApplyNow);

/* Put Apis */
router.put("/update/:_id", auth({ usersAllowed: [ADMIN, SUPERADMIN] }), APIS.updateApplyNow);

/* Delete Apis */
router.delete("/delete/:_id", auth({ usersAllowed: [ADMIN, SUPERADMIN] }), VALIDATOR.toggleActive, APIS.deleteApplyNow);

module.exports = router;