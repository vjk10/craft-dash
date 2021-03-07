import React, { useEffect, useState, Fragment } from 'react'

// Styles
import './main.scss'

// Components
import Messaging from './messaging/messaging'
import Edit from './edit/edit'
import IdbFiles from './idb-files/idb-files'
import TopNavMain from './top-nav-main/top-nav-main'
import MainBoard from './main-board/main-board'
import VideoChat from './video-chat/video-chat'

import io from 'socket.io-client'
import { server } from '../../utils/api'

// Logos
import MessagingIcon from '../../img/messaging-icon.svg'
import EditTool from '../../img/edit-tool.svg'
import FilesFolderIcon from '../../img/folder-icon.svg'

function Main({ match, viewFile, viewFileInfo, hideFileInfo }) {
	const [socket, setSocket] = useState(null)

	const [sidebar_focus, set_sidebar_focus] = useState({
		chat: true,
		edit: false,
		files: false
	})

	useEffect(() => {
		// console.log('[Main]')
		const s = io(server)
		setSocket(s)
	}, [])

	const onChatClick = () => {
		set_sidebar_focus({ chat: true, edit: false, files: false })
	}

	const onEditClick = () => {
		set_sidebar_focus({ chat: false, edit: true, files: false })
	}

	const onFilesClick = () => {
		set_sidebar_focus({ chat: false, edit: false, files: true })
	}

	return (
		<div className='main'>
			<div className='top-nav-wrapper'>
				<TopNavMain />
			</div>
			{socket ? (
				<Fragment>
					<div className='main-board-wrapper'>
						<MainBoard room={match.params.id} socket={socket} />
					</div>
					<div className='video-chat-wrapper'>
						<VideoChat socket={socket} roomId={match.params.id} />
					</div>
					<div className='sidebar-main'>
						<div className='sidebar-top-nav'>
							<MessageNav
								handler={onChatClick}
								visibility={sidebar_focus.chat}
							/>
							<EditToolNav
								handler={onEditClick}
								visibility={sidebar_focus.edit}
							/>
							<FilesAddNav
								idea_board_id={match.params.id}
								handler={onFilesClick}
								visibility={sidebar_focus.files}
							/>
						</div>
						<div className='sidebar-body' />
					</div>
					<div
						style={{ display: sidebar_focus.chat ? 'block' : 'none' }}
						className='messaging-wrapper'>
						<Messaging room={match.params.id} socket={socket} />
					</div>
					<div
						style={{ display: sidebar_focus.edit ? 'block' : 'none' }}
						className='edit-wrapper'>
						<Edit room={match.params.id} socket={socket} />
					</div>
					<div
						style={{ display: sidebar_focus.files ? 'block' : 'none' }}
						className='files-wrapper'>
						<IdbFiles room={match.params.id} socket={socket} />
					</div>
				</Fragment>
			) : null}
		</div>
	)
}

const MessageNav = (props) => {
	return (
		<div
			className='message-nav-wrapper'
			style={{
				borderBottom: props.visibility
					? '2px solid #08E789'
					: '2px solid transparent'
			}}
			onClick={() => props.handler()}>
			<img src={MessagingIcon} alt='' />
		</div>
	)
}

const EditToolNav = (props) => {
	return (
		<div
			className='edit-tool-nav-wrapper'
			style={{
				borderBottom: props.visibility
					? '2px solid #08E789'
					: '2px solid transparent'
			}}
			onClick={() => props.handler()}>
			<img src={EditTool} alt='' />
		</div>
	)
}

const FilesAddNav = (props) => {
	return (
		<div
			className='files-folder-nav-wrapper'
			style={{
				borderBottom: props.visibility
					? '2px solid #08E789'
					: '2px solid transparent'
			}}
			onClick={() => props.handler()}>
			<img src={FilesFolderIcon} alt='' />
		</div>
	)
}

export default Main
