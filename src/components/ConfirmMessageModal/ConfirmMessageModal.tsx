import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Modal, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface MessageModalI{
  header:string,
  message:string,
  state:boolean,
  handleClose(): void,
  handleConfirm(): void
}

function rand(){
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: '75%',
      maxWidth: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  
  const ConfirmMessageModal=(props:MessageModalI)=>{
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    const body = (
      <div style={modalStyle} className={classes.paper}>
          <div style={{display:'flex', flexDirection:'column'}}>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                  <Typography variant='h5'>{props.header}</Typography>
                  <Button size='large' onClick={props.handleClose}>X</Button>
              </div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', whiteSpace: 'pre-wrap'}}>
              {props.message}
          </div>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
              <Button style={{margin:'5px', backgroundColor:'#aaFF00'}} onClick={props.handleConfirm}>Ok</Button>
              <Button style={{margin:'5px'}} onClick={props.handleClose}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  
    return (
      <div>
        <Modal
          open={props.state}
          onClose={props.handleClose}
        >
          {body}
        </Modal>
      </div>
    );
  }
  
  export default ConfirmMessageModal