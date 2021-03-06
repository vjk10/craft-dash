const mongoose = require('mongoose')

// Validator
const validator = require('validator')

// Bcrypt
const bcrypt = require('bcrypt')

const d = Date.now()

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true
	},
	avatar_id: {
		type: Number,
		required: false,
		default: 0
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate(email) {
			if (!validator.isEmail(email)) {
				throw new Error('Invalid Email')
			}
		}
	},
	googleId: {
		type: String,
		unique: true,
		default: () => Date.now()
	},
	password: {
		type: String,
		minlength: 6,
		trim: true,
		validate(password) {
			if (password.toLowerCase().includes('password')) {
				throw new Error('Password cannot include password')
			}
		}
	},
	thumbnail: {
		type: String
	},
	added_to: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'IdeaBoard'
		}
	],
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
})

// getAuthToken() works on the instance of the
// current user who is successfully verified
userSchema.methods.getAuthToken = async function () {
	const user = this

	const { signToken } = require('../helpers/jwt-helper')
	const token = await signToken(user._id)

	// Saving the generated token into tokens array of the current user
	user.tokens = user.tokens.concat({ token })
	await user.save()
	return token
}

userSchema.statics.findByCredentials = async function (username, password) {
	const user = await User.findOne({ email: username })
	if (!user) {
		throw new Error('Unable to login email')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw new Error('Unable to login password')
	}

	return user
}

// Hashing the password brfore saving it in the database
userSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
