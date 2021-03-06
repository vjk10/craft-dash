import React, { useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'

import './edit.scss'
import './edit-light.scss'


import { deSelectAll_Main } from '../../../redux/elements/focus-elements/focusElementsActions'
import { setFocusText_Main } from '../../../redux/elements/focus-text/focusTextActions'

import {
	onTextChange_Main,
	removeElements_Main
} from '../../../redux/elements/elementsActions'

import { removeElements } from 'react-flow-renderer'

// Emoji
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

const Edit = ({
	socket,
	room,
	focus_element,
	elements,
	onTextChange_Main,
	removeElements_Main,
	deSelectAll_Main
}) => {
	const removeHandler = () => {
		if (focus_element.id !== undefined) {
			removeElements_Main(removeElements([focus_element], elements))

			// [Sends Data]
			socket.emit('remove-elements-broadcast', {
				elements: removeElements([focus_element], elements),
				room
			})

			deSelectAll_Main()
		}
	}

	const textChangeHandler = (text) => {
		onTextChange_Main({ id: focus_element.id, text })
	}

	useEffect(() => {
		socket.on('receiving-updated-text', (data) => {
			dispatch({
				type: 'SET_FOCUS_TEXT',
				payload: data.text
			})
			onTextChange_Main({ id: data.id, text: data.text })
		})
	}, [])

	// Emoji Handler
	const focus_text = useSelector((state) => state.focus_text)
	const dispatch = useDispatch()

	const theme = useSelector((state) => state.theme);
	const dark = theme === "dark";

	const addEmoji = (emoji) => {
		if (focus_element.id !== undefined) {
			dispatch({
				type: 'SET_FOCUS_TEXT',
				payload: `${focus_text}${emoji.native}`
			})
			socket.emit('send-updated-text', {
				id: focus_element.id,
				room,
				text: `${focus_text}${emoji.native}`
			})
			textChangeHandler(`${focus_text}${emoji.native}`)
		}
	}

	const [showEmojiPicker, setShowEmojiPicker] = useState(false)

	return (
		<div className={`edit-sidebar ${dark ? "":"edit-sidebar-light"}`}>
			<div className={`edit-sidebar-wrapper ${dark ? "":"edit-sidebar-wrapper-light"}`}>
				<div className={`el-id ${dark ? "":"el-id-light"}`}>
					<ElementGroup
						data={{
							label: '#id',
							content: focus_element.id,
							label_width: '20%',
							content_width: '80%'
						}}
					/>
				</div>

				<div className={`co ${dark ? "":"co-light"}`} style={{ display: showEmojiPicker ? 'none' : '' }}>
					<div className={`x-co ${dark ? "":"x-co-light"}`}>
						<ElementGroup
							data={{
								label: 'x :',
								content:
									focus_element.position === undefined
										? 'Na'
										: Math.floor(focus_element.position.x),
								label_width: '40%',
								content_width: '60%'
							}}
						/>
					</div>
					<div className={`y-co ${dark ? "":"y-co-light"}`}>
						<ElementGroup
							data={{
								label: 'y :',
								content:
									focus_element.position === undefined
										? 'Na'
										: Math.floor(focus_element.position.y),
								label_width: '40%',
								content_width: '60%'
							}}
						/>
					</div>
				</div>

				<div
					className={`fg-bg ${dark ? "":"fg-bg-light"}`}
					style={{ display: showEmojiPicker ? 'none' : '' }}>
					<ElementGroup
						data={{
							label: 'fg',
							content: '7',
							label_width: '40%',
							content_width: '60%'
						}}
					/>
					<ElementGroup
						data={{
							label: 'bg',
							content: '7',
							label_width: '40%',
							content_width: '60%'
						}}
					/>
				</div>

				<div className={`text ${dark ? "":"text-light"}`}>
					<ElementGroup
						data={{
							label: 'text',
							content:
								focus_element.data === undefined
									? ' '
									: focus_element.data.label,
							label_width: '100%',
							content_width: '100%'
						}}
						textChangeHandler={textChangeHandler}
						socket={socket}
						room={room}
					/>
				</div>

				<div className={`edit-update-btn ${dark ? "":"edit-update-btn-light"}`}>
					<button
						style={{
							backgroundColor: showEmojiPicker ? '#08E789' : 'transparent'
						}}
						onClick={() => setShowEmojiPicker((e) => !e)}>
						{/* <span role='img' aria-label='sheep'>
							🐑
						</span> */}
						<span role='img' aria-label='smiley'>
							😋
						</span>
					</button>
				</div>

				<div
					className={`emoji-picker ${dark ? "":"emoji-picker-light"}`}
					style={{
						display: showEmojiPicker ? 'block' : 'none'
					}}>
					<Picker
						style={{
							width: '280px',
							height: '440px'
						}}
						onSelect={addEmoji}
						theme='dark'
						title='Pick an emoji'
						emoji='point_up'
					/>
				</div>

				<div className={`edit-remove-btn ${dark ? "":"edit-remove-btn-light"}`}>
					<button onClick={removeHandler}>REMOVE</button>
				</div>
			</div>
		</div>
	)
}

const ElementGroup = (props) => {
	const focus_element = useSelector((state) => state.focus.focus_element)
	const focus_text = useSelector((state) => state.focus_text)
	const dispatch = useDispatch()

	const textChangeHandler = (e) => {
		dispatch({ type: 'SET_FOCUS_TEXT', payload: e.target.value })
		props.socket.emit('send-updated-text', {
			id: focus_element.id,
			room: props.room,
			text: e.target.value
		})
		props.textChangeHandler(e.target.value)
	}
	const theme = useSelector((state) => state.theme);
	const dark = theme === "dark";
	return (
		<div className={`edit-group ${dark ? "":"edit-group-light"}`}>
			<h3 className={`field-label ${dark ? "":"field-label-light"}`} style={{ width: props.data.label_width }}>
				{props.data.label}
			</h3>
			<div
				className={`field-content-wrapper ${dark ? "":"field-content-wrapper-light"}`}
				style={{ width: props.data.content_width }}>
				{props.data.label === 'text' ? (
					<textarea
						disabled={focus_element.data === undefined ? true : false}
						className={`field-content-textarea ${dark ? "":"field-content-textarea-light"}`}
						rows='4'
						cols='20'
						value={focus_text}
						onChange={textChangeHandler}
					/>
				) : (
					<h3 className={`field-content ${dark ? "":"field-content-light"}`}>{props.data.content}</h3>
				)}
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		elements: state.elements,
		focus_element: state.focus.focus_element
	}
}

const dispatches = {
	onTextChange_Main,
	removeElements_Main,
	setFocusText_Main,
	deSelectAll_Main
}

export default connect(mapStateToProps, { ...dispatches })(Edit)
