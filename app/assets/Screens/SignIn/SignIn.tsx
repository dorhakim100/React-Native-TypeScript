import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { Checkbox } from 'react-native-paper' // Using react-native-paper for Checkbox

import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

import ForgotPassword from './components/ForgotPassword'

// Placeholder Icons - replace with actual vector icons if available
const GoogleIcon = () => <Text>GoogleIcon</Text>
const FacebookIcon = () => <Text>FacebookIcon</Text>
const SitemarkIcon = () => <Text>SitemarkIcon</Text>

export function SignIn(props: { disableCustomTheme?: boolean }) {
  const [fullname, setFullname] = useState('')
  const [fullnameError, setFullnameError] = useState(false)
  const [fullnameErrorMessage, setFullnameErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const prefs = useSelector(
    (stateSelector: RootState) => stateSelector.systemModule.prefs
  )

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    if (emailError || passwordError || (isSignup && fullnameError)) {
      Alert.alert('Validation Error', 'Please correct the errors in the form.')
      return
    }

    console.log({
      email: email,
      password: password,
      fullname: isSignup ? fullname : undefined,
    })
    Alert.alert('Form Submitted', `Email: ${email}, Password: ${password}`)
  }

  const validateInputs = () => {
    let isValid = true

    if (isSignup && !fullname) {
      setFullnameError(true)
      setFullnameErrorMessage('Please enter your full name.')
      isValid = false
    } else {
      setFullnameError(false)
      setFullnameErrorMessage('')
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password || password.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Password must be at least 6 characters long.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  const handleSignup = () => {
    setIsSignup(!isSignup)
    // Clear form fields on toggle
    setFullname('')
    setEmail('')
    setPassword('')
    setFullnameError(false)
    setEmailError(false)
    setPasswordError(false)
  }

  useEffect(() => {
    // No direct equivalent for useColorScheme in React Native, manage theme via Redux prefs
  }, [prefs.isDarkMode])

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: prefs.isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <View style={{...styles.card,  backgroundColor: prefs.isDarkMode ? '#3e3e3e' : '#fff', }}>
        <SitemarkIcon />
        <Text style={{...styles.title, color:prefs.isDarkMode ? '#fff': '#333'}}>{isSignup ? 'Sign up' : 'Sign in'}</Text>

        <View style={styles.formContainer}>
          {isSignup && (
            <View style={styles.formControl}>
              <Text style={{...styles.label, color:prefs.isDarkMode ? '#fff': '#333'}}>Full Name</Text>
              <TextInput
                style={[styles.input, fullnameError && styles.inputError]}
                placeholder='Your full name'
                value={fullname}
                onChangeText={setFullname}
                autoCapitalize='words'
                autoCorrect={false}
                textContentType='name'
                autoFocus={true}
              />
              {fullnameError && (
                <Text style={styles.errorMessage}>{fullnameErrorMessage}</Text>
              )}
            </View>
          )}

          <View style={styles.formControl}>
            <Text style={{...styles.label, color:prefs.isDarkMode ? '#fff': '#333'}}>Email address</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder='Email address'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              textContentType='emailAddress'
            />
            {emailError && (
              <Text style={styles.errorMessage}>{emailErrorMessage}</Text>
            )}
          </View>

          <View style={styles.formControl}>
            <Text style={{...styles.label, color:prefs.isDarkMode ? '#fff': '#333'}}>Password</Text>
            <TextInput
              style={[styles.input, passwordError && styles.inputError]}
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType='password'
            />
            {passwordError && (
              <Text style={styles.errorMessage}>{passwordErrorMessage}</Text>
            )}
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
              color={prefs.isDarkMode ? '#fff' : '#000'}
            />
            <Text
              style={[
                styles.checkboxLabel,
                { color: prefs.isDarkMode ? '#fff' : '#000' },
              ]}
            >
              Remember me
            </Text>
          </View>

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
            <Text style={styles.buttonPrimaryText}>
              {isSignup ? 'Sign up' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={handleClickOpen}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* <Text style={styles.dividerText}>or</Text> */}

          {/* <TouchableOpacity style={styles.buttonOutline}>
            <GoogleIcon />
            <Text style={styles.buttonOutlineText}>Sign in with Google</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.buttonOutline}>
            <FacebookIcon />
            <Text style={styles.buttonOutlineText}>Sign in with Facebook</Text>
          </TouchableOpacity> */}

          <View style={styles.signupTextContainer}>
            <Text style={styles.signupText}>
              {isSignup
                ? 'Already have an account? '
                : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>
                {isSignup ? 'Sign in' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ForgotPassword open={open} handleClose={handleClose} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 450,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  formControl: {
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
  dividerText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: '#666',
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonOutlineText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  signupTextContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#666',
  },
  signupLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
})
