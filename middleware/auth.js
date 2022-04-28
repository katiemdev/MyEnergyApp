const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

module.exports.authorise = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		res.status(401).json({ message: "No token provided" });
	}
};

module.exports.ensureAuth = () => {
	return (
		check("name")
			.not()
			.isEmpty()
			.isLength({ min: 3 })
			.withMessage("Name must be atleast 3 characters long"),
		check("email", "Email is required").not().isEmpty(),
		check("password", "Password should be between 5 to 8 characters long")
			.not()
			.isEmpty()
			.isLength({ min: 5, max: 8 })
	);
};
