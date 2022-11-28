const RecordRepository = require("../repositories/recordRepository");

const createRecord = async (req, res) => {
  try {
    const {
      doctorName,
      doctorEmail,
      doctorAddress,
      doctorContact,
      username,
      userGender,
      userDateOfBirth,
      userAddress,
      userContact,
      dentalSymtoms,
      diagnosis,
      treatmentPlan,
      doctorId,
      userId,
    } = req.body;

    if (
      !doctorName ||
      !doctorEmail ||
      !doctorAddress ||
      !doctorContact ||
      !username ||
      !userGender ||
      !userDateOfBirth ||
      !userAddress ||
      !userContact ||
      !userContact ||
      !dentalSymtoms ||
      !treatmentPlan ||
      !doctorId ||
      !userId
    )
      return res.status(400).send("MISSING PARAMS!");

    const record = await RecordRepository.CreateRecord({
      doctorName,
      doctorEmail,
      doctorAddress,
      doctorContact,
      username,
      userGender,
      userDateOfBirth,
      userAddress,
      userContact,
      dentalSymtoms,
      diagnosis,
      treatmentPlan,
      doctorId,
      userId,
    });

    return res.status(200).send(record);
  } catch (error) {
    console.log(
      "🚀 ~ file: recordController.js ~ line 22 ~ createRecord ~ error",
      error
    );
  }
};

const getAllRecords = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const options = {
      page,
      limit,
    };
    const records = await RecordRepository.FindAllRecords({}, options);
    return res.status(200).send(records);
  } catch (error) {
    console.log(
      "🚀 ~ file: recordController.js ~ line 53 ~ getAllRecords ~ error",
      error
    );
  }
};

const getRecordByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;

    if (!recordId) return res.status(400).send("NOTFOUND");

    const record = await RecordRepository.FindRecordByOption({ _id: recordId });

    if (!record) return res.status(400).send("NOTFOUND");

    return res.status(200).send(record);
  } catch (error) {
    console.log(
      "🚀 ~ file: recordController.js ~ line 65 ~ getRecordByOption ~ error",
      error
    );
  }
};

const getRecordByDoctorId = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const options = {
      page,
      limit,
    };
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).send("NOTFOUND");

    const records = await RecordRepository.FindRecordsByCondition(
      { doctorId },
      options
    );

    if (!records) return res.status(400).send("NOTFOUND");

    return res.status(200).send(records);
  } catch (error) {
    console.log(
      "🚀 ~ file: recordController.js ~ line 110 ~ getRecordByDoctorId ~ error",
      error
    );
  }
};

const getRecordByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).send("NOTFOUND");

    const records = await RecordRepository.FindRecordsByCondition({ userId });

    if (!records) return res.status(400).send("NOTFOUND");

    return res.status(200).send(records);
  } catch (error) {
    console.log(
      "🚀 ~ file: recordController.js ~ line 110 ~ getRecordByDoctorId ~ error",
      error
    );
  }
};

const deletedRecordForTesting = async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedRecord = await RecordRepository.DeleteRecord({ userId });
    return res.status(200).send(deletedRecord);
  } catch (error) {
    console.log(
      "🚀 ~ file: recordController.js ~ line 139 ~ deletedRecordForTesting ~ error",
      error
    );
  }
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordByRecordId,
  getRecordByDoctorId,
  getRecordByUserId,
  deletedRecordForTesting,
};
