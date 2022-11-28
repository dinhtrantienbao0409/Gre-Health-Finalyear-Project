const User = require("../databases/models/UserModel");
const { USER_ROLE } = require("../constants/role");
const { hash, comparePassword } = require("../helpers/bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role = USER_ROLE,
      name,
      address,
      contact,
      dateOfBirth,
      gender,
      jobTitle,
    } = req.body;
    console.log(
      "🚀 ~ file: authController.js ~ line 16 ~ register ~ req",
      req.body
    );

    if (
      !email ||
      !password ||
      !name ||
      !address ||
      !contact ||
      !dateOfBirth ||
      !gender ||
      !jobTitle
    )
      return res.status(400).send("MISSING_FIELD");

    const user = await User.findOne({ email: req.body.email });

    if (user) return res.status(400).send("EXISTED_FIELD");

    const hashedPassword = await hash(password);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      role,
      name,
      address,
      contact,
      dateOfBirth,
      gender,
      jobTitle,
    });
    console.log(
      "🚀 ~ file: authController.js ~ line 40 ~ register ~ createdUser",
      createdUser
    );

    if (!createdUser) return res.status(500);

    return res.status(200).send(createdUser);
  } catch (error) {
    console.log("🚀 ~ file: auth.js ~ line 11 ~ router.get ~ error", error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("MISSING_PARAMS");

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("USER_NOTFOUND");

    const result = await comparePassword(password, user.password);

    if (!result) res.status(400).send("INVALID_PASSWORD");

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return res
      .status(200)
      .send({ token, payload, message: "loggin successfully", status: 200 });
  } catch (error) {
    console.log(
      "🚀 ~ file: authController.js ~ line 56 ~ login ~ error",
      error
    );
  }
};

const deleteUserByEmail = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email) return res.status(400).send("NOTFOUND");

  const deletedUser = await User.deleteOne({ email: req.body.email });
  return res.status(200).send(deletedUser);
};

const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).send("NOTFOUND");

  const deletedUser = await User.findByIdAndDelete({ _id: userId });
  return res.status(200).send(deletedUser);
};

const findAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const options = {
      page,
      limit,
    };
    const users = await User.paginate({}, options);
    // const users = await User.find({});

    return res.status(200).send(users);
  } catch (error) {
    console.log(
      "🚀 ~ file: doctorController.js ~ line 32 ~ getAllDoctors ~ error",
      error
    );
  }
};

const findUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(
      "🚀 ~ file: authController.js ~ line 129 ~ findUserById ~ userId",
      userId
    );

    if (!userId) return res.status(400).send("NOTFOUND");

    const user = await User.findOne({ _id: userId });

    if (!user) return res.status(400).send("NOTFOUND");

    return res.status(200).send(user);
  } catch (error) {
    console.log(
      "🚀 ~ file: authController.js ~ line 143 ~ findUserById ~ error",
      error
    );
    return res.status(500).json(error);
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      email,
      password,
      role,
      name,
      address,
      contact,
      dateOfBirth,
      gender,
      jobTitle,
    } = req.body;

    if (!userId) return res.status(400).send("NOTFOUND");

    const user = await User.findOne({ email: req.body.email });

    if (user) return res.status(400).send("EXISTED_FIELD");

    const hashedPassword = await hash(password);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      email,
      password: hashedPassword,
      role,
      name,
      address,
      contact,
      dateOfBirth,
      gender,
      jobTitle,
    });
    return res.status(200).send(updatedUser);
  } catch (error) {
    console.log(
      "🚀 ~ file: authController.js ~ line 167 ~ updateUserById ~ error",
      error
    );
  }
};

const findUserByDoctorRole = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    return res.status(200).send(doctors);
  } catch (error) {
    console.log(
      "🚀 ~ file: authController.js ~ line 204 ~ findUserByDoctorRole ~ error",
      error
    );
  }
};

module.exports = {
  register,
  login,
  deleteUserByEmail,
  findAllUser,
  findUserById,
  deleteUserById,
  updateUserById,
  findUserByDoctorRole,
};
