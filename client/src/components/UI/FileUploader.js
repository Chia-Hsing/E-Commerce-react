import React, { useRef } from 'react'

const FileUploader = props => {
    const fileInput = useRef(null)

    const handleFileInput = () => {
        const files = fileInput.current.files
        props.fileChange(files)
    }
    return (
        <>
            <div className="avatarUpload" onClick={props.fileClick}>
                <label for="file" className="label" />
                <input
                    id="file"
                    ref={fileInput}
                    type="file"
                    className="fileInput"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleFileInput}
                />
                <img src={props.img} alt="avatar" style={{ width: '100%', height: '100%' }} />
            </div>
        </>
    )
}

export default FileUploader
