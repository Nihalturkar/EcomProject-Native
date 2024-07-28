import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react';
const { width, height } = Dimensions.get("window");
import { RNToasty } from 'react-native-toasty'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation,setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);


    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return password.length > 0;
    }

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleLogin = async () => {
        setLoadingIndicator(true);
        try {
          const response = await axios.post('https://reqres.in/api/login', {
            email,
            password,
          });
          console.log(response?.data)
          const token = response?.data?.token;
          console.log(token)
          if (token && validateEmail(email) && validatePassword(password)) {
            await AsyncStorage.setItem('userToken', token);
            setToken(true);
            navigation.navigate('Home');
            RNToasty.Success({
              title: 'Login Successfully',
              position: 'top',
            });
          } else {
            RNToasty.Error({
              title: 'Login Failed',
              position: 'top',
            });
          }
        } catch (error) {
          console.error('Error logging in:', error);
          RNToasty.Error({
            title: 'Login Failed',
            position: 'top',
          });
        } finally {
          setLoadingIndicator(false);
        }
      };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='white' barStyle='dark-content' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inner}>
                    <Image source={{ uri: 'https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg' }}
                        style={styles.img} resizeMode='contain' />
                    <Text style={styles.title}>
                        Login
                    </Text>
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../assests/icons/email.png')}
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email ID"
                                value={email}
                                onChangeText={handleEmailChange}
                                placeholderTextColor='gray'
                            />

                        </View>
                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../assests/icons/pass.png')}
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={handlePasswordChange}
                                placeholderTextColor='gray'
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Image
                                    source={
                                        showPassword
                                            ? require('../../assests/icons/open.png')
                                            : require('../../assests/icons/close.png')
                                    }
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword} onPress={() => { }}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={loadingIndicator}>
                            {loadingIndicator ? (
                                <ActivityIndicator
                                    size={22}
                                    color={'white'}
                                    style={{ marginRight: width * 0.04 }}
                                />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.orText}>OR</Text>
                        <TouchableOpacity style={styles.googleButton} onPress={() => { }}>
                            <Image
                                source={require('../../assests/icons/google.png')}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>Login with Google</Text>
                        </TouchableOpacity>
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>
                                New to Logistics?
                            </Text>
                            <TouchableOpacity onPress={() => { }}>
                                <Text style={styles.registerButtonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    inner: {
        width: width * .9,
        alignSelf: 'center'
    },
    img: {
        marginTop: height * .05,
        width: width * .6,
        height: height * .3,
        alignSelf: 'center'
    },
    title: {
        color: "black",
        fontSize: width * .07,
        fontWeight: 'medium',
        marginLeft: width * .04,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: width * .01,
    },
    input: {
        width: width * .7,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        color: 'black'
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#333',
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#007bff',
        padding: width * .04,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 15,
        color: '#000',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: width * .04,
        borderRadius: 15,
        borderWidth: 1,
        backgroundColor: 'lightgray',
        borderColor: 'transparent'
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#333',
        marginLeft: width * .1,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: height * .03,
    },
    registerText: {
        color: '#333',
    },
    registerButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
})

export default Login