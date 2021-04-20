import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Modal, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface MessageModalI{
  header?:string,
  message?:string,
  state:boolean,
  link?:string,
  handleClose(): void
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
  
  const MessageModal=(props:MessageModalI)=>{
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
  
    const body = (
      <div style={modalStyle} className={classes.paper}>
          <div style={{display:'flex', flexDirection:'column'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <Typography variant='h5'>{props.header}</Typography>
                  <Button size='large' onClick={props.handleClose}>X</Button>
              </div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', lineHeight:2}}>
              {props.message}
          </div>
          {props.link && props.link!==""?
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <Link to={{pathname:`https://etherscan.io/tx/${props.link}`}} target="_blank" >Check on etherscan</Link>
            </div>
            :<></>
          }
        </div>
      </div>
    );
    // console.log('message modal: ', props.Message);
  
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
  
  export default MessageModal;