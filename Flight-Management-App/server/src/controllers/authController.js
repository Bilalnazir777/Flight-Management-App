const { userRegistration, userLogin } = require("./../services/authServices");

const userLoginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await userLogin(username, password);
    if (data) {
      res.json({ success: true, data });
    } else {
      res
        .status(401)
        .json({ success: false, message: "please enter valid creds" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const userSignupController = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await userRegistration(username, password, role);
    res.status(201).json({
      success: true,
      message: "User has been registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  userSignupController,
  userLoginController,
};
