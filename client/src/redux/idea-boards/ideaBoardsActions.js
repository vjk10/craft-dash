import api from '../../utils/api'
import * as TYPE from './ideaBoardsTypes'

import * as NOTIFICATION_TYPE from '../../utils/notifications/notifyTypes'
import notify from '../../utils/notifications/notify'

export const loadIBS = () => async (dispatch) => {
	dispatch(ibsRequest())
	try {
		const res = await api.get('/idea-board/get-idea-boards')
		if (res.data.message && res.data.message === 'NRF') {
			dispatch(ibsEmpty(res.data))
		} else {
			dispatch(ibsSuccess(res.data))
		}

		console.log(res.data)
	} catch (e) {
		if (e.response) {
			dispatch(ibsFailure(e.response.data))
		} else {
			dispatch(ibsFailure(e.message))
		}
	}
}

export const createIBS = (data) => async (dispatch) => {
	dispatch(ibCreateRequest())
	try {
		const res = await api.post('/idea-board/create-new-idea-board', data)
		dispatch(ibCreateSuccess(res.data))
		console.log(res.data)
	} catch (e) {
		if (e.response) {
			dispatch(ibCreateFailure(e.response.data))
		} else {
			dispatch(ibCreateFailure(e.message))
		}
		console.log(e)
	}
}

export const deleteIBS = (board_id) => async (dispatch) => {
	dispatch(ibDeleteRequest())
	try {
		const res = await api.delete(`/idea-board/delete-board/${board_id}`)
		dispatch(ibDeleteSuccess(res.data.info))
		notify(`${res.data.message}`, NOTIFICATION_TYPE.INFO)
	} catch (e) {
		if (e.response) {
			dispatch(ibDeleteFailure(e.response.data))
		} else {
			dispatch(ibDeleteFailure(e.message))
		}
		notify('Unable to perform the delete action.', NOTIFICATION_TYPE.ERROR)
		console.log(e)
	}
}

export const editIBS = () => async (dispatch) => {}

export const refreshIBS = () => async (dispatch) => {}

// READ

const ibsRequest = () => {
	return {
		type: TYPE.IBS_REQUEST
	}
}
const ibsSuccess = (data) => {
	return {
		type: TYPE.IBS_SUCCESS,
		payload: data
	}
}
const ibsEmpty = () => {
	return {
		type: TYPE.IBS_EMPTY
	}
}
const ibsFailure = (error) => {
	return {
		type: TYPE.IBS_FAILURE,
		payload: error
	}
}

// CREATE
const ibCreateRequest = () => {
	return {
		type: TYPE.IB_CREATE_REQUEST
	}
}

const ibCreateSuccess = (data) => {
	return {
		type: TYPE.IB_CREATE_SUCCESS,
		payload: data
	}
}

const ibCreateFailure = (error) => {
	return {
		type: TYPE.IB_CREATE_FAILURE,
		payload: error
	}
}

// DELETE
const ibDeleteRequest = () => {
	return {
		type: TYPE.IB_DELETE_REQUEST
	}
}

const ibDeleteSuccess = (data) => {
	return {
		type: TYPE.IB_DELETE_SUCCESS,
		payload: data
	}
}

const ibDeleteFailure = (error) => {
	return {
		type: TYPE.IB_DELETE_FAILURE,
		payload: error
	}
}
