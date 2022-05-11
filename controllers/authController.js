const validator = require("validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
	postLogin: (req, res, next) => {
		let getUser;
		return User.findOne({
			email: req.body.email,
		})
			.then((user) => {
				if (!user) {
					return res.status(401).json({
						message: "Authentication failed: No user found",
					});
				} else {
					getUser = user;
					// const hash = bcrypt.hashSync(req.body.password, 10);
					return bcrypt.compareSync(req.body.password, getUser.password);
				}
			})
			.then((result) => {
				if (!result) {
					return res.status(401).json({
						message: "Authentication failed: Incorrect password",
					});
				} else {
					let jwtToken = jwt.sign(
						{
							email: getUser.email,
							userId: getUser._id,
						},
						process.env.JWT_SECRET,
						{
							expiresIn: "1h",
						}
					);
					return res.status(200).json({
						token: jwtToken,
						expiresIn: 3600,
						user: getUser,
					});
				}
			})
			.catch((err) => {
				return res.status(401).json({
					message: "Authentication failed",
				});
			});
	},

	registerUser: (req, res, next) => {
		const validationErrors = [];
		if (!validator.isEmail(req.body.email))
			validationErrors.push({ msg: "Please enter a valid email address." });
		if (!validator.isLength(req.body.password, { min: 8 }))
			validationErrors.push({
				msg: "Password must be at least 8 characters long",
			});
		// if (req.body.password !== req.body.confirmPassword)
		// 	validationErrors.push({ msg: "Passwords do not match" });
		req.body.email = validator.normalizeEmail(req.body.email, {
			gmail_remove_dots: false,
		});

		if (!validationErrors.length == 0) {
			return res.status(422).json(validationErrors);
		} else {
			bcrypt.hash(req.body.password, 10).then((hash) => {
				const user = new User({
					name: req.body.name,
					email: req.body.email,
					password: hash,
				});
				user
					.save()
					.then((response) => {
						res.status(201).json({
							message: "User successfully created!",
							result: response,
						});
					})
					.catch((error) => {
						res.status(500).json({
							error: error,
						});
					});
				return user;
			});
		}
	},
	getUser: async (req, res) => {
		try {
			const user = await User.findById(req.params.id);
			res.send(user);
		} catch (err) {
			console.log(err);
		}
	},
};
