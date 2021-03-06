import React, { Component } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  CssBaseline,
  Button,
  Avatar
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { Field, reduxForm } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import { VerifyResetPasswordTokenAction,
  UpdatePasswordAction } from "../../_actions/auth";
import { connect } from "react-redux";
import Notifier from "../Notifier";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(5, 0, 2)
  }
});

class ResetPassword extends Component {

  state = {
    type: 'password',
    Icon: <VisibilityIcon/>,
    cType: 'password',
    cIcon: <VisibilityIcon/>,
    notifier_message: '',
    done: false
  }

  componentDidMount = () => {
    this.props.VerifyResetPasswordTokenAction(this.props.match.params.user_id, 
      this.props.match.params.token);
  }


  handleClick = () => this.setState(({type}) => ({
    Icon: type === 'text' ? <VisibilityIcon/> : <VisibilityOffIcon/> ,
    type: type === 'text' ? 'password' : 'text'
    
  }))

  confirmPassowrdShow = () => this.setState(({cType}) => ({
    cIcon: cType === 'text' ? <VisibilityIcon/> : <VisibilityOffIcon/> ,
    cType: cType === 'text' ? 'password' : 'text'
    
  }))
  
  renderInputError = ({ error, touched }) => {
    if (error && touched) return { error: true, message: error };
    else return { error: false, message: "" };
  };

  renderInput = ({ input, label, type, id, meta }) => {
    const { error, message } = this.renderInputError(meta);
    if (error) {
      return (
        <TextField
          {...input}
          autoComplete="off"
          variant="outlined"
          fullWidth
          type={type}
          id={id}
          error
          label={message}
        />
      );
    } else {
      return (
        <TextField
          {...input}
          autoComplete="off"
          variant="outlined"
          fullWidth
          type={type}
          id={id}
          required
          label={label}
        />
      );
    }
  };
  
  submit = ({ password }) => {
    const {user_id, token} = this.props.match.params;
    this.props.UpdatePasswordAction({user_id, password, token})
    .then(()=>  {
      const { password_updated } = this.props;
      if(password_updated) {
        this.setState({notifier_message: "Password updated successfully"});
      }
      else {
        this.setState({notifier_message: "The token has expired or is invalid"});
      }
      this.setState({done: true});
    });
  };

  handleClose = () => {
    this.setState({ done: false });
  };

  passwordCheckHandler = () => {
    alert(" Rules for a valid Password : \n 1- Minimum password length is 6. \n 2- Password must contain atleast an uppercase letter \n 3- Password must contain atleast an lowercase letter. \n 4- Password must contain atleast a digit. \n 5- Password must contain atleast a special character. (@,$,#,%,&)")
  }
  render() {
    const { classes, invalid, token_verified } = this.props;
    return (
        <Container component="main" maxWidth="xs" data-test="ResetPasswordComponent">
          <CssBaseline />
          {token_verified?
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <form
              className={classes.form}
              onSubmit={this.props.handleSubmit(this.submit)}
              data-test="ResetPasswordForm"
            >
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Field
                    name="password"
                    id="password"
                    label="Password"
                    type={this.state.type}
                    component={this.renderInput}
                  />
                </Grid>
                <IconButton aria-label="info" onClick = {this.handleClick}>
                    {this.state.Icon}
                </IconButton>
                <IconButton aria-label="info" onClick = {this.passwordCheckHandler}>
                  <InfoIcon/>
                </IconButton>
                <Grid item xs={10}>
                  <Field
                    name="cPassword"
                    id="cPassword"
                    label="Confirm Password"
                    type={this.state.cType}
                    component={this.renderInput}
                  />
                </Grid>
                <IconButton aria-label="info" onClick = {this.confirmPassowrdShow}>
                    {this.state.cIcon}
                </IconButton>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={invalid}
              >
                Submit
              </Button>
            </form>
          </div>:
          <div className={classes.paper}>
            <Typography component="h3" variant="h5">
              The token has expired or is invalid.
            </Typography>
          </div>
          }
          <Notifier
            done={this.state.done}
            message={this.state.notifier_message}
            handleClose={this.handleClose}
          />
        </Container>
    );
  }
}

const passwordValid = password => {
  const passwordCheck = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$")
  if (password === undefined || !(passwordCheck.test(password))) return false;
  return true;
};

const validate = ({ password, cPassword }) => {
  const errors = {};
  if (!passwordValid(password)) errors.password = "Password invalid";
  if (cPassword !== password) errors.cPassword = "Password don't match";
  return errors;
};

const MapStateToProp = state => {
  return {
    token_verified: state.auth.token_verified,
    password_updated: state.auth.password_updated
  };
};

export default reduxForm({
  form: "resetPassword",
  validate: validate
})(connect(
  MapStateToProp,
  { VerifyResetPasswordTokenAction, UpdatePasswordAction }
)(withStyles(styles, { withTheme: true })(ResetPassword)));
