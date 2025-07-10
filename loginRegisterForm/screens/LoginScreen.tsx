import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import auth from '@/services/firebaseAuth';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({navigation}: any) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [isEmailFocused, setIsEmailFocused] = React.useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.navigate('dashboard');
            }
        });
    }, [navigation]);

    function handleLogin() {
        if (!emailRegex.test(email)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: 'Please enter a valid email address',
            });
            return;
        }
        if (password.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Password Required',
                text2: 'Please enter your password',
            });
            return;
        }

        setIsLoading(true);
        
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await AsyncStorage.setItem('user', JSON.stringify(user));
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: 'Welcome back!',
                });
                navigation.navigate('dashboard');
            })
            .catch((error) => {
                let errorMessage = 'An error occurred. Please try again.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No user found with this email.';
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Incorrect password. Please try again.';
                } else if (error.code === 'auth/invalid-credential') {
                    errorMessage = 'Incorrect email/password. Please try again.';
                }
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: errorMessage,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function goToRegister() {
        navigation.navigate('register'); 
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <ThemedView style={styles.themedViewContainer}>
                <View style={styles.logoContainer}>
                    <Ionicons name="lock-closed" size={48} color="#6366f1" style={styles.logoIcon} />
                    <Text style={styles.logoText}>SamForm</Text>
                    <Text style={styles.logoSubtext}>Sign in to your account</Text>
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, isEmailFocused && styles.focusedInput]}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your email"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                        />
                        {email.length > 0 && (
                            <Ionicons 
                                name={emailRegex.test(email) ? "checkmark-circle" : "close-circle"} 
                                size={20} 
                                color={emailRegex.test(email) ? "#10b981" : "#ef4444"} 
                                style={styles.inputIcon}
                            />
                        )}
                    </View>
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.inputWrapper, isPasswordFocused && styles.focusedInput]}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={secureTextEntry}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        >
                            <Ionicons 
                                name={secureTextEntry ? "eye-off" : "eye"} 
                                size={20} 
                                color={isPasswordFocused ? "#6366f1" : "#9ca3af"} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Ionicons name="refresh-circle" size={24} color="#fff" style={styles.loadingIcon} />
                            <Text style={styles.buttonText}>Processing...</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="log-in" size={24} color="#fff" />
                            <Text style={styles.buttonText}>Sign In</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.forgotPasswordContainer}>
                    <TouchableOpacity>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-apple" size={24} color="#000000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={goToRegister}>
                        <Text style={styles.registerLink}> Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
            <Toast />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    themedViewContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 32,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoIcon: {
        marginBottom: 12,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#6366f1',
        letterSpacing: -0.5,
        fontFamily: 'Inter_700Bold',
    },
    logoSubtext: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 8,
        fontFamily: 'Inter_400Regular',
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputWrapper: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    label: {
        fontSize: 14,
        color: '#334155',
        marginBottom: 8,
        fontWeight: '600',
        fontFamily: 'Inter_500Medium',
    },
    textInput: {
        height: 52,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1e293b',
        paddingRight: 40,
        fontFamily: 'Inter_400Regular',
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    focusedInput: {
        borderColor: '#6366f1',
        backgroundColor: '#f8fafc',
        shadowColor: '#a5b4fc',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    loginButton: {
        height: 52,
        backgroundColor: '#6366f1',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
        gap: 8,
    },
    loginButtonDisabled: {
        backgroundColor: '#a5b4fc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
    },
    loadingIcon: {
        marginRight: 8,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 12,
    },
    forgotPasswordText: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Inter_500Medium',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        color: '#64748b',
        fontSize: 14,
        marginHorizontal: 12,
        fontFamily: 'Inter_400Regular',
    },
    socialLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        alignItems: 'center',
    },
    registerText: {
        color: '#64748b',
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    registerLink: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
    },
});