import React, { useEffect, useState } from 'react'
import validator from 'validator'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import '../../sass/login.scss'

// Components
import BrandLogo from '../brand-logo/brand-logo'

const initialValues = {
	email: '',
	password: ''
}

const validate = (values) => {
	let errors = {}

	if (!values.email) {
		errors.email = 'Required'
	} else if (!validator.isEmail(values.email)) {
		errors.email = 'Invalid Email'
	}

	if (!values.password) {
		errors.password = 'Required'
	} else if (values.password.length <= 7) {
		errors.password = 'Enter a valid password'
	}

	return errors
}

const TextError = (props) => <div className='error-msg'>{props.children}</div>

const onSubmit = (values) => {
	console.log(values)
}

function Login() {
	const [ visible, setVisible ] = useState(false)

	useEffect(() => {
		document.title = 'Craft Dash | Login'
	}, [])

	return (
		<div className='login'>
			<BrandLogo custom={{ margin: 'auto', marginTop: '20px' }} />
			<Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
				{(formik) => {
					return (
						<Form>
							<div className='row-1'>
								<div className='input-group'>
									<label htmlFor='email'>Email</label>
									<Field type='text' name='email' id='email' autoComplete='off' />
									<div className='error-msg-wrapper'>
										<ErrorMessage name='email' component={TextError} />
									</div>
								</div>
							</div>
							<div className='row-2'>
								<div className='input-group'>
									<label htmlFor='password'>Password</label>
									<Field
										type='password'
										name='password'
										id='password'
										autoComplete='current-password'
									/>
									<div className='error-msg-wrapper'>
										<ErrorMessage name='password' component={TextError} />
									</div>
								</div>
							</div>
							<div className='row-3'>
								<button type='submit' id='submit-btn' onClick={() => setVisible(true)}>
									Login
								</button>
							</div>
							<div className='row-4'>
								<p>
									Don't have an account? <span className='register-link'>Register here</span>
								</p>
							</div>
						</Form>
					)
				}}
			</Formik>
		</div>
	)
}

export default Login
