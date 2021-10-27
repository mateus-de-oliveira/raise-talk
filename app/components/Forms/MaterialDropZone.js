import React, { useEffect, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import ActionDelete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import CloudUpload from '@material-ui/icons/CloudUpload'
import 'dan-styles/vendors/react-dropzone/react-dropzone.css'

import { usePropertieContext } from '../Propertie/Context'

const styles = (theme) => ({
  dropItem: {
    borderColor: theme.palette.divider,
    background: theme.palette.background.default,
    borderRadius: theme.rounded.medium,
    color: theme.palette.text.disabled,
    textAlign: 'center',
  },
  uploadIconSize: {
    display: 'inline-block',
    '& svg': {
      width: 72,
      height: 72,
      fill: theme.palette.secondary.main,
    },
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    '& svg': {
      fill: theme.palette.common.white,
    },
  },
  button: {
    marginTop: 20,
  },
})

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
}

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const activeStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

function MaterialDropZone(props) {
  const { classes, text } = props
  const { files, setFiles } = usePropertieContext()
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  )

  const handleRemove = useCallback(
    (file, fileIndex) => {
      // This is to prevent memory leaks.
      window.URL.revokeObjectURL(file.preview)

      setFiles((thisFiles) => {
        const tempFiles = [...thisFiles]
        tempFiles.splice(fileIndex, 1)
        return tempFiles
      })
    },
    [files]
  )

  const thumbs = files.map((file, index) =>
    typeof file == 'string' ? (
      <div style={thumb} key={file}>
        <IconButton
          style={{ position: 'absolute' }}
          onClick={() => handleRemove(file, index)}
        >
          <ActionDelete className='removeBtn' />
        </IconButton>
        <div style={thumbInner}>
          <img src={file} style={img} />
        </div>
      </div>
    ) : (
      <div style={thumb} key={file.name}>
        <IconButton
          style={{ position: 'absolute' }}
          onClick={() => handleRemove(file, index)}
        >
          <ActionDelete className='removeBtn' />
        </IconButton>
        <div style={thumbInner}>
          <img src={file.preview} style={img} />
        </div>
      </div>
    )
  )

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  return (
    <section className='container'>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p className='dropzoneParagraph'>{text}</p>
        <div className={classes.uploadIconSize}>
          <CloudUpload />
        </div>
      </div>

      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  )
}

MaterialDropZone.propTypes = {
  files: PropTypes.array.isRequired,
  text: PropTypes.string.isRequired,
  acceptedFiles: PropTypes.array,
  showPreviews: PropTypes.bool.isRequired,
  showButton: PropTypes.bool,
  maxSize: PropTypes.number.isRequired,
  filesLimit: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
}

MaterialDropZone.defaultProps = {
  acceptedFiles: [],
  showButton: false,
}

export default withStyles(styles)(MaterialDropZone)
