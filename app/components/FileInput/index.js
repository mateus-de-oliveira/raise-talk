import React, { useRef, useState } from 'react'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import ButtonBase from '@material-ui/core/ButtonBase'

const FileInput = ({ label, onChange, attachment, setAttachment }) => {
  const ref = useRef()
  const classes = useStyles()

  const handleChange = (event) => {
    const files = Array.from(event.target.files)
    const [file] = files
    setAttachment(file)
    if (!!onChange) onChange({ target: { value: file } })
  }

  return (
    <Box position='relative' height={100}>
      <Box position='absolute' top={0} bottom={0} left={0} right={0}>
        <TextField
          variant='standard'
          className={classes.field}
          InputProps={{ disableUnderline: true }}
          margin='normal'
          fullWidth
          disabled
          label={label}
          value={attachment ? attachment.name : ''}
          //   error={!!error}
          //   helperText={error ? error.message : ' '}
        />
      </Box>
      <ButtonBase className={classes.button} component='label'>
        <input
          ref={ref}
          type='file'
          accept='*'
          hidden
          onChange={handleChange}
        />
      </ButtonBase>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  field: {
    '& .MuiFormLabel-root.Mui-disabled': {
      color: theme.palette.text.secondary,
    },
  },
  button: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
}))

export default FileInput
